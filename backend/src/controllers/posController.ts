import { Request, Response } from "express";
import { POSService } from "../services/posService.js";
import { prisma } from "../config/db.js";

export const POSController = {
  // Add this back in
  verifyAccountNumber: async (req: Request, res: Response) => {
    const { accountNumber } = req.body;
    await new Promise(resolve => setTimeout(resolve, 800));
    if (accountNumber.length !== 10) return res.status(400).json({ error: "Invalid NUBAN" });

    res.json({
      accountName: "SHIGOSAG VENTURES - " + (Math.random() > 0.5 ? "SEGUN GABRIEL" : "SEGUN ARULOGUN"),
      accountNumber,
      bankName: "First Bank of Nigeria"
    });
  },

  processTransfer: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    try {
      const result = await POSService.processTransfer(userId, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  getTransactions: async (req: Request, res: Response) => {
    try {
      const { type, limit = 50 } = req.query;
      const txs = await prisma.transaction.findMany({
        where: type ? { type: type as any } : {},
        orderBy: { createdAt: 'desc' },
        take: Number(limit)
      });
      res.json(txs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  }
};
