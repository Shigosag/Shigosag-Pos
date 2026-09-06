import { prisma } from "../config/db.js";
import { io } from "../server.js";
import { TransactionType } from "@prisma/client";

export class SaleService {
  static async processSale(userId: string, payload: { items: any[]; total: number }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Verify User
      const user = await tx.user.findUnique({ 
        where: { id: userId },
        select: { balance: true }
      });
      if (!user) throw new Error("Terminal operator not found");

      // 2. Validate and Update Stock
      for (const item of payload.items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item.name}`);
        }

        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 3. Create Sale Record
      const sale = await tx.sale.create({
        data: {
          total: payload.total,
          items: payload.items,
          userId: userId
        }
      });

      // 4. Create Ledger Entry (Transaction)
      const transaction = await tx.transaction.create({
        data: {
          reference: `SHG-SALE-${Date.now()}`,
          type: "SALE" as TransactionType,
          amount: payload.total,
          paymentMethod: "TERMINAL_RETAIL",
          status: "SUCCESS"
        }
      });

      // 5. System Log
      await tx.systemLog.create({
        data: {
          action: "RETAIL_SALE",
          userId,
          details: `Processed sale ID ${sale.id} for ${payload.total}`
        }
      });

      io.emit("sale:new", { sale, transaction });
      return { sale, transaction };
    }, {
      isolationLevel: "Serializable"
    });
  }
}
