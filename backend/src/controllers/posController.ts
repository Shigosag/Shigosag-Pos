import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { io } from "../server.js";

export const POSController = {
  // Simulate Name Lookup
  verifyAccountNumber: async (req: Request, res: Response) => {
    const { accountNumber, bankCode } = req.body;
    
    // Simulate API delay (like Paystack/Flutterwave)
    await new Promise(resolve => setTimeout(resolve, 800));

    if (accountNumber.length !== 10) {
      return res.status(400).json({ error: "Invalid NUBAN length" });
    }

    // Mock response for simulation
    res.json({
      accountName: "SHIGOSAG VENTURES - " + (Math.random() > 0.5 ? "SEGUN ARULOGUN" : "GABRIEL ADEDEJI"),
      accountNumber,
      bankName: "First Bank of Nigeria"
    });
  },

  processTransfer: async (req: Request, res: Response) => {
    const { amount, accountNumber, bankName, accountName, userId } = req.body;

    try {
      // Log the transaction
      const transaction = await prisma.transaction.create({
        data: {
          reference: `SHG-TX-${Math.floor(100000 + Math.random() * 900000)}`,
          type: "TRANSFER",
          amount: parseFloat(amount),
          recipientDetail: `${bankName} | ${accountNumber} | ${accountName}`,
          status: "SUCCESS"
        }
      });

      // ACTUALLY DEDUCT FROM BALANCE
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: parseFloat(amount) } }
      });

      io.emit("transaction:new", transaction);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Transfer failed" });
    }
  }
};
