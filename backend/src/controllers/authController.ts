import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "shigosag_secret_6482";

export const AuthController = {
  register: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: "Email already registered" });

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, balance: 10000000 }
      });

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ token, user: userWithoutPassword, message: "Account created successfully" });
    } catch (err) {
      res.status(500).json({ error: "Registration failed" });
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
      const { password: _, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  },

  getProfile: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const user = await prisma.user.findUnique({ 
        where: { id: userId },
        select: { id: true, name: true, email: true, balance: true, role: true }
    });
    res.json(user);
  },

  deleteAccount: async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    try {
      await prisma.user.delete({ where: { id: userId } });
      res.json({ message: "Account deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete account" });
    }
  }
};
