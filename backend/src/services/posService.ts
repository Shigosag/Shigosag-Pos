import { prisma } from "../lib/prisma.js";
import { getIO } from "../lib/socket.js";
import { TransactionType, TransactionStatus } from "@prisma/client";

export class POSService {
  static async processTransfer(userId: string, data: {
    amount: number;
    accountNumber: string;
    bankName: string;
    accountName: string;
  }) {
    const amountNum = Number(data.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error("Invalid transfer amount");
    }

    return await (prisma as any).$transaction(async (tx: any) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, balance: true, isActive: true }
      });

      if (!user || !user.isActive) {
        throw new Error("Terminal operator session inactive or invalid");
      }

      if (Number(user.balance) < amountNum) {
        throw new Error("Insufficient institutional terminal balance");
      }

      const reference = `SHG-TX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const transaction = await tx.transaction.create({
        data: {
          reference,
          type: "TRANSFER" as TransactionType,
          amount: amountNum,
          recipientDetail: `${data.bankName} | ${data.accountNumber} | ${data.accountName}`,
          paymentMethod: "NIP_TRANSFER",
          status: TransactionStatus.SUCCESS,
          userId: user.id
        }
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amountNum } },
        select: { balance: true }
      });

      await tx.systemLog.create({
        data: {
          action: "TRANSFER_OUT",
          userId: user.id,
          details: `Transfer of ₦${amountNum} to ${data.accountNumber} (${data.bankName})`
        }
      });

      try {
        const io = getIO();
        io.to(`user:${userId}`).emit("balance:update", updatedUser.balance);
        io.to(`user:${userId}`).emit("transaction:new", transaction);
        io.emit("transaction:new", transaction);
      } catch (_) {}

      return {
        transaction,
        newBalance: updatedUser.balance
      };
    }, {
      isolationLevel: "Serializable"
    });
  }
}
