import { prisma } from "../config/db.js";
import { io } from "../server.js";

export class POSService {
  static async processTransfer(userId: string, data: {
    amount: number;
    accountNumber: string;
    bankName: string;
    accountName: string;
  }) {
    // Atomic Transaction: All succeed or all fail
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      
      if (!user || Number(user.balance) < data.amount) {
        throw new Error("Insufficient institutional balance");
      }

      const transaction = await tx.transaction.create({
        data: {
          reference: `SHG-TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

      // Real-time notification
      io.emit("transaction:new", transaction);

      return { transaction, newBalance: updatedUser.balance };
    });
  }

  static async processSale(userId: string, total: number, items: any[]) {
    return await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          total,
          items,
          userId
        }
      });

      // Update inventory stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      io.emit("sale:new", sale);
      return sale;
    });
  }
}
