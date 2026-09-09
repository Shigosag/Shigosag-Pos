import { Request, Response } from "express";
import { POSService } from "../services/posService.js";
import { SaleService } from "../services/saleService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../lib/prisma.js";

export const POSController = {
  verifyAccountNumber: async (req: Request, res: Response) => {
    const { accountNumber, bank } = req.body;
    
    if (!accountNumber || String(accountNumber).trim().length !== 10) {
      return ApiResponse.error(res, "Invalid account number. Must be exactly 10 digits.", 400);
    }

    const recipientName = "SHIGOSAG VENTURES - " + (accountNumber.endsWith("0") ? "SEGUN GABRIEL" : "SEGUN ARULOGUN");

    return ApiResponse.success(res, {
      accountName: recipientName,
      accountNumber: String(accountNumber).trim(),
      bankName: bank || "Zenith Bank"
    }, "Account resolved");
  },

  processTransfer: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    try {
      const result = await POSService.processTransfer(userId, req.body);
      return ApiResponse.success(res, result, "Transfer successful", 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message || "Transfer failed", 400);
    }
  },

  processRetailCheckout: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    try {
      const result = await SaleService.processSale(userId, req.body);
      return ApiResponse.success(res, result, "Sale completed successfully", 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message || "Sale failed", 400);
    }
  },

  getTransactions: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    try {
      const [total, transactions] = await Promise.all([
        (prisma as any).transaction.count({ where: { userId } }),
        (prisma as any).transaction.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit
        })
      ]);

      return ApiResponse.success(res, {
        items: transactions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return ApiResponse.error(res, "Failed to fetch transactions", 500);
    }
  }
};
