import { Request, Response } from "express";
import { POSService } from "../services/posService.js";
import { SaleService } from "../services/saleService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../config/db.js";

export const POSController = {
  verifyAccountNumber: async (req: Request, res: Response) => {
    const { accountNumber } = req.body;
    
    if (!accountNumber || accountNumber.length !== 10) {
      return ApiResponse.error(res, "Invalid NUBAN format", 400);
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    return ApiResponse.success(res, {
      accountName: "SHIGOSAG VENTURES - " + (Math.random() > 0.5 ? "SEGUN GABRIEL" : "SEGUN ARULOGUN"),
      accountNumber,
      bankName: req.body.bank || "First Bank of Nigeria"
    });
  },

  processTransfer: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    try {
      const result = await POSService.processTransfer(userId, req.body);
      return ApiResponse.success(res, result, "Transfer successful", 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  processRetailCheckout: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    try {
      const result = await SaleService.processSale(userId, req.body);
      return ApiResponse.success(res, result, "Sale completed successfully");
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 400);
    }
  },

  getTransactions: async (req: Request, res: Response) => {
    try {
      const txs = await prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      return ApiResponse.success(res, txs);
    } catch (error) {
      return ApiResponse.error(res, "Failed to fetch history");
    }
  }
};
