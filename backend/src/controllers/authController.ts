import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { env } from "../utils/validateEnv.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = registerSchema.parse(req.body);
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return ApiResponse.error(res, "An account with this email already exists", 400);

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: "CASHIER", balance: 10000000 }
      });

      const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "24h" });
      const { password: _, ...userData } = user;
      return ApiResponse.success(res, { token, user: userData }, "Account created successfully", 201);
    } catch (err: any) {
      return ApiResponse.error(res, err.message || "Registration failed", 400);
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({ where: { email, deletedAt: null } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return ApiResponse.error(res, "Invalid email or password", 401);
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "24h" });
      const { password: _, ...userData } = user;
      return ApiResponse.success(res, { token, user: userData });
    } catch (err) {
      return ApiResponse.error(res, "Authentication service error");
    }
  },

  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, balance: true, role: true }
      });
      return ApiResponse.success(res, user);
    } catch (err) {
      return ApiResponse.error(res, "Profile fetch failed");
    }
  },

  deleteAccount: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      await prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date(), isActive: false }
      });
      return ApiResponse.success(res, null, "Account deleted successfully");
    } catch (err) {
      return ApiResponse.error(res, "Failed to delete account");
    }
  }
};
