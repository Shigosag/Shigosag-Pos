import { prisma } from "../config/db.js";
import { io } from "../server.js";
import { TransactionType } from "@prisma/client";

export class SaleService {
  static async processSale(userId: string, payload: { items: any[]; total: number }) {
    // High-isolation transaction to ensure data integrity
    return await prisma.$transaction(async (tx) => {
      // 1. Verify User exists and is active
      const user = await tx.user.findUnique({ 
        where: { id: userId },
        select: { id: true, balance: true, isActive: true }
      });
      
      if (!user || !user.isActive) {
        throw new Error("Terminal operator not authorized or inactive");
      }

      // 2. Atomic Stock Validation & Update
      for (const item of payload.items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        
        if (!product) throw new Error(`Product ${item.name} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}. Available: ${product.stock}`);
        }

        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 3. Create Retail Sale Record
      const sale = await tx.sale.create({
        data: {
          total: payload.total,
          items: payload.items, // Stored as Json
          userId: userId
        }
      });

      // 4. Create Financial Ledger Entry (Transaction)
      // This increases the terminal "Sales" volume tracked in the system
      const transaction = await tx.transaction.create({
        data: {
          reference: `SHG-SALE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: "SALE" as TransactionType,
          amount: payload.total,
          paymentMethod: "TERMINAL_RETAIL",
          status: "SUCCESS",
          userId: userId // Linked for audit trails
        }
      });

      // 5. System Audit Log for Security
      await tx.systemLog.create({
        data: {
          action: "RETAIL_SALE_COMPLETED",
          userId,
          details: `Sale ID: ${sale.id} | Items: ${payload.items.length} | Total: ${payload.total}`
        }
      });

      // 6. Real-time broadcast to all connected terminals
      const broadcastPayload = { sale, transaction };
      io.emit("sale:new", broadcastPayload);
      io.emit("transaction:new", transaction);

      return broadcastPayload;
    }, {
      isolationLevel: "Serializable" // Highest level of concurrency protection
    });
  }
}
