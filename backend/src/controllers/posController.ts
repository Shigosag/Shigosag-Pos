import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { io } from "../server.js";

export const POSController = {
  verifyAccountNumber: async (req: Request, res: Response) => {
    const { accountNumber } = req.body;
    await new Promise(resolve => setTimeout(resolve, 800));
    if (accountNumber.length !== 10) return res.status(400).json({ error: "Invalid NUBAN" });

    res.json({
      accountName: "SHIGOSAG VENTURES - " + (Math.random() > 0.5 ? "SEGUN GABRIEL" : "ADEDEJI ARULOGUN"),
      accountNumber,
      bankName: "First Bank of Nigeria"
    });
  },

  processTransfer: async (req: Request, res: Response) => {
    const { amount, accountNumber, bankName, accountName } = req.body;
    const userId = (req as any).user?.userId; 

    try {
      const transaction = await prisma.transaction.create({
        data: {
          reference: `SHG-TX-${Math.floor(100000 + Math.random() * 900000)}`,
          type: "TRANSFER",
          amount: parseFloat(amount),
          recipientDetail: `${bankName} | ${accountNumber} | ${accountName}`,
          status: "SUCCESS"
        }
      });

      await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: parseFloat(amount) } }
      });

      io.emit("transaction:new", transaction);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Transfer failed" });
    }
  },

  getTransactions: async (req: Request, res: Response) => {
    try {
      const txs = await prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      res.json(txs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  }
};
