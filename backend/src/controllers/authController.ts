import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shigosag_secret_key";

export const AuthController = {
  register: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: "Account already exists" });

      const user = await prisma.user.create({
        data: { 
          name, 
          email, 
          password, 
          balance: 10000000 
        }
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({ 
        token, 
        user, 
        message: "Account created successfully" 
      });
    } catch (err) {
      res.status(500).json({ error: "Registration failed" });
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, user });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  }, // <--- THIS COMMA WAS MISSING

  deleteAccount: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      await prisma.user.delete({ where: { id: userId } });
      res.json({ message: "Account deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete account" });
    }
  }
};
