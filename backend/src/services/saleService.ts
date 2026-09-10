import { prisma } from "../lib/prisma.js";
import { getIO } from "../lib/socket.js";
import { TransactionType, TransactionStatus } from "@prisma/client";

export class SaleService {
  static async processSale(userId: string, payload: { items: any[]; total: number; paymentMethod?: string }) {
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      throw new Error("Cannot checkout with an empty cart");
    }

    const totalAmount = Number(payload.total);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      throw new Error("Invalid sale total calculation");
    }

    return await (prisma as any).$transaction(async (tx: any) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, balance: true, isActive: true }
      });

      if (!user || !user.isActive) {
        throw new Error("Terminal operator not authorized or inactive");
      }

      // 1. Stock validation and decrement
      for (const item of payload.items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) {
          throw new Error(`Product ${item.name || item.id} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }

        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 2. Persist Sale record
      const sale = await tx.sale.create({
        data: {
          total: totalAmount,
          items: payload.items,
          userId: user.id
        }
      });

      // 3. Create Sale Transaction entry
      const reference = `SHG-SALE-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const transaction = await tx.transaction.create({
        data: {
          reference,
          type: "SALE" as TransactionType,
          amount: totalAmount,
          paymentMethod: payload.paymentMethod || "TERMINAL_RETAIL",
          status: TransactionStatus.SUCCESS,
          recipientDetail: `Terminal Retail (${payload.items.length} items)`,
          userId: user.id
        }
      });

      // 4. Atomically credit Cashier Vault Balance with received revenue
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: totalAmount } },
        select: { balance: true }
      });

      // 5. Audit Log
      await tx.systemLog.create({
        data: {
          action: "RETAIL_SALE_COMPLETED",
          userId: user.id,
          details: `Sale Ref: ${reference} | Total: ₦${totalAmount}`
        }
      });

      const broadcastPayload = {
        sale,
        transaction,
        newBalance: updatedUser.balance
      };

      try {
        const io = getIO();
        io.to(`user:${userId}`).emit("balance:update", updatedUser.balance);
        io.to(`user:${userId}`).emit("transaction:new", transaction);
        io.emit("sale:new", broadcastPayload);
      } catch (_) {}

      return broadcastPayload;
    }, {
      isolationLevel: "Serializable"
    });
  }
}
