import { prisma } from "../config/db.js";
import { io } from "../server.js";

export class POSService {
  static async processTransfer(userId: string, data: {
    amount: number;
    accountNumber: string;
    bankName: string;
    accountName: string;
  }) {
    // High isolation to prevent race conditions (double-spending)
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ 
        where: { id: userId },
        select: { balance: true, id: true }
      });
      
      if (!user || Number(user.balance) < data.amount) {
        throw new Error("Insufficient institutional balance");
      }

      const transaction = await tx.transaction.create({
        data: {
          reference: `SHG-TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          type: "TRANSFER",
          amount: data.amount,
          recipientDetail: `${data.bankName} | ${data.accountNumber} | ${data.accountName}`,
          status: "SUCCESS"
        }
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: data.amount } }
      });

      // Log the critical financial action
      await tx.systemLog.create({
        data: {
          action: "TRANSFER_OUT",
          userId,
          details: `Transfer of ${data.amount} to ${data.accountNumber}`
        }
      });

      io.emit("transaction:new", transaction);
      return { transaction, newBalance: updatedUser.balance };
    }, {
      isolationLevel: "Serializable"
    });
  }

  static async getHistory(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { items, total, pages: Math.ceil(total / limit) };
  }
}
