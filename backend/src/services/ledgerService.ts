import { prisma } from "../lib/db.js";
import { io } from "../server.js";
import { TransactionType } from "@prisma/client";

export class LedgerService {
  static async executeTransaction(userId: string, amount: number, type: TransactionType, details: string, metadata: any = {}) {
    return await prisma.$transaction(async (tx) => {
      // 1. Lock user record for update (Pessimistic concurrency control)
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, balance: true }
      });

      if (!user) throw new Error("Unauthorized terminal access");

      const numericBalance = Number(user.balance);
      
      // Validation for outbound funds
      if (["TRANSFER", "WITHDRAWAL", "SALE"].includes(type) && numericBalance < amount) {
        throw new Error("Insufficient terminal liquidity");
      }

      // 2. Update Balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { 
          balance: type === "SALE" ? { increment: amount } : { decrement: amount } 
        }
      });

      // 3. Create Transaction Record
      const transaction = await tx.transaction.create({
        data: {
          reference: `SHG-${type.substring(0,3)}-${Date.now()}`,
          type,
          amount,
          recipientDetail: details,
          paymentMethod: metadata.paymentMethod || "TERMINAL_INTERNAL",
          userId
        }
      });

      // 4. System Audit Log
      await tx.systemLog.create({
        data: {
          action: type,
          userId,
          details: `Amount: ${amount} | Ref: ${transaction.reference}`
        }
      });

      // 5. Emit real-time update
      io.emit("transaction:new", transaction);
      io.to(`user:${userId}`).emit("balance:update", updatedUser.balance);

      return { transaction, newBalance: updatedUser.balance };
    }, {
      isolationLevel: "Serializable"
    });
  }
}
