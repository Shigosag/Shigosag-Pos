import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "shigosag_secret_prod_2026";

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
      if (existingUser) return ApiResponse.error(res, "Email already in use", 400);

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: "CASHIER" }
      });

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
      const { password: _, ...userData } = user;
      
      return ApiResponse.success(res, { token, user: userData }, "Account created successfully", 201);
    } catch (err: any) {
      return ApiResponse.error(res, err.message || "Registration failed", 400);
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({ 
        where: { email, deletedAt: null } 
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return ApiResponse.error(res, "Invalid credentials", 401);
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
      const { password: _, ...userData } = user;

      return ApiResponse.success(res, { token, user: userData });
    } catch (err) {
      return ApiResponse.error(res, "Login service unavailable");
    }
  }
};
