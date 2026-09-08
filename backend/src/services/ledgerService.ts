import { prisma } from "../lib/prisma.js";
import { getIO } from "../lib/socket.js";
import { TransactionType } from "@prisma/client";
import { logger } from "../utils/logger.js";

export class LedgerService {
  /**
   * Executes a financial transaction with automatic retry logic for serialization failures.
   * Ensures absolute data integrity for balances.
   */
  static async executeTransaction(
    userId: string, 
    amount: number, 
    type: TransactionType, 
    details: string, 
    metadata: any = {}
  ) {
    let retries = 3;
    while (retries > 0) {
      try {
        return await prisma.$transaction(async (tx) => {
          const user = await tx.user.findUnique({
            where: { id: userId },
            select: { id: true, balance: true, isActive: true }
          });

          if (!user || !user.isActive) throw new Error("Terminal unauthorized");

          const numericBalance = Number(user.balance);
          const numericAmount = Number(amount);

          // Liquidity Check for outbound funds
          if (["TRANSFER", "WITHDRAWAL"].includes(type) && numericBalance < numericAmount) {
            throw new Error("Insufficient terminal liquidity");
          }

          // Atomic Balance Update
          const updatedUser = await tx.user.update({
            where: { id: userId },
            data: { 
              balance: type === "SALE" 
                ? { increment: numericAmount } 
                : { decrement: numericAmount } 
            }
          });

          // Ledger Entry
          const transaction = await tx.transaction.create({
            data: {
              reference: `SHG-${type.substring(0,3)}-${Date.now()}-${Math.random().toString(36).toUpperCase().slice(-4)}`,
              type,
              amount: numericAmount,
              recipientDetail: details,
              paymentMethod: metadata.paymentMethod || "INTERNAL",
              userId
            }
          });

          // Real-time Targeted Broadcast (Security: Only to the specific user)
          const io = getIO();
          io.to(`user:${userId}`).emit("balance:update", updatedUser.balance);
          io.to(`user:${userId}`).emit("transaction:new", transaction);

          logger.info(`Financial Action: ${type} | User: ${userId} | Amt: ${amount}`);

          return { transaction, newBalance: updatedUser.balance };
        }, {
          isolationLevel: "Serializable"
        });
      } catch (error: any) {
        if (error.code === 'P2034') { // Prisma serialization failure code
          retries--;
          if (retries === 0) throw new Error("Terminal busy, please retry.");
          await new Promise(r => setTimeout(r, 100)); // Backoff
          continue;
        }
        throw error;
      }
    }
  }
}
