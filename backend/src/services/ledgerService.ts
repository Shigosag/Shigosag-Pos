import { prisma } from "../lib/prisma.js";
import { getIO } from "../lib/socket.js";
import { TransactionType, TransactionStatus } from "@prisma/client";
import { logger } from "../utils/logger.js";

export class LedgerService {
  /**
   * Executes a financial movement with strict serializable isolation.
   * Prevents race conditions, double-spending, and inconsistent balances.
   */
  static async executeWalletAction(params: {
    userId: string;
    amount: number;
    type: TransactionType;
    details: string;
    metadata?: any;
  }) {
    const { userId, amount, type, details, metadata = {} } = params;
    let retries = 5;
    let delay = 50;

    while (retries > 0) {
      try {
        return await prisma.$transaction(async (tx) => {
          // 1. Lock user record for update
          const user = await tx.user.findUnique({
            where: { id: userId },
            select: { id: true, balance: true, isActive: true }
          });

          if (!user || !user.isActive) throw new Error("Unauthorized terminal access");

          const balance = Number(user.balance);
          const amt = Number(amount);

          // 2. Business Logic: Balance Check for outflows
          const isOutflow = ["TRANSFER", "WITHDRAWAL", "ADJUSTMENT"].includes(type);
          if (isOutflow && balance < amt) {
            throw new Error("Insufficient terminal liquidity for this operation");
          }

          // 3. Update Balance
          const updatedUser = await tx.user.update({
            where: { id: userId },
            data: { 
              balance: isOutflow ? { decrement: amt } : { increment: amt }
            }
          });

          // 4. Create Immutable Ledger Entry
          const transaction = await tx.transaction.create({
            data: {
              reference: `SHG-${type.slice(0,3)}-${Date.now()}-${Math.random().toString(36).toUpperCase().slice(-4)}`,
              type,
              amount: amt,
              status: TransactionStatus.SUCCESS,
              recipientDetail: details,
              paymentMethod: metadata.paymentMethod || "TERMINAL",
              userId
            }
          });

          // 5. Audit Log
          await tx.systemLog.create({
            data: {
              action: `WALLET_${type}`,
              userId,
              details: `Amt: ${amt} | New Bal: ${updatedUser.balance}`
            }
          });

          // 6. Real-time Targeted Sync
          const io = getIO();
          io.to(`user:${userId}`).emit("balance:update", updatedUser.balance);
          io.to(`user:${userId}`).emit("transaction:new", transaction);

          return { transaction, newBalance: updatedUser.balance };
        }, {
          isolationLevel: "Serializable"
        });
      } catch (error: any) {
        // P2034 is Prisma's Transaction conflict code
        if (error.code === 'P2034' && retries > 1) {
          retries--;
          await new Promise(res => setTimeout(res, delay));
          delay *= 2; // Exponential backoff
          continue;
        }
        logger.error(`Ledger Error: ${error.message}`);
        throw error;
      }
    }
  }
}
