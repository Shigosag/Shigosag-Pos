import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { env } from "../utils/validateEnv.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional()
});

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = registerSchema.parse(req.body);
      const existingUser = await (prisma as any).user.findFirst({ 
        where: { email: email.toLowerCase() } 
      });

      if (existingUser) {
        return ApiResponse.error(res, "An account with this email already exists", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await (prisma as any).user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: "CASHIER",
          balance: 10000000.00
        }
      });

      const token = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const { password: _, ...userData } = user;
      return ApiResponse.success(res, { token, user: userData }, "Account created successfully", 201);
    } catch (err: any) {
      return ApiResponse.error(res, err.errors?.[0]?.message || err.message || "Registration failed", 400);
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return ApiResponse.error(res, "Email and password are required", 400);
      }

      const user = await (prisma as any).user.findFirst({
        where: { email: email.toLowerCase(), deletedAt: null }
      });

      if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
        return ApiResponse.error(res, "Invalid email or password", 401);
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const { password: _, ...userData } = user;
      return ApiResponse.success(res, { token, user: userData }, "Login successful");
    } catch (err) {
      return ApiResponse.error(res, "Authentication service error", 500);
    }
  },

  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      const user = await (prisma as any).user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, balance: true, role: true, isActive: true, createdAt: true }
      });

      if (!user) {
        return ApiResponse.error(res, "User profile not found", 404);
      }

      return ApiResponse.success(res, user);
    } catch (err) {
      return ApiResponse.error(res, "Profile fetch failed", 500);
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      const body = updateProfileSchema.parse(req.body);

      const user = await (prisma as any).user.findUnique({ where: { id: userId } });
      if (!user) return ApiResponse.error(res, "User not found", 404);

      const updateData: any = {};
      if (body.name) updateData.name = body.name;
      if (body.email) updateData.email = body.email.toLowerCase();

      if (body.newPassword) {
        if (!body.currentPassword) {
          return ApiResponse.error(res, "Current password is required to set a new password", 400);
        }
        const matches = await bcrypt.compare(body.currentPassword, user.password);
        if (!matches) {
          return ApiResponse.error(res, "Current password is incorrect", 400);
        }
        updateData.password = await bcrypt.hash(body.newPassword, 12);
      }

      const updated = await (prisma as any).user.update({
        where: { id: userId },
        data: updateData,
        select: { id: true, name: true, email: true, balance: true, role: true }
      });

      return ApiResponse.success(res, updated, "Profile updated successfully");
    } catch (err: any) {
      return ApiResponse.error(res, err.message || "Failed to update profile", 400);
    }
  },

  deleteAccount: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      await (prisma as any).user.update({
        where: { id: userId },
        data: { deletedAt: new Date(), isActive: false }
      });

      await (prisma as any).systemLog.create({
        data: {
          action: "ACCOUNT_DELETED",
          userId,
          details: "User soft-deleted own profile"
        }
      });

      return ApiResponse.success(res, null, "Account deleted successfully");
    } catch (err) {
      return ApiResponse.error(res, "Failed to delete account", 500);
    }
  }
};
