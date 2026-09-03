import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from 'express-rate-limit';
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import posRoutes from "./routes/posRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

// 1. Security & Performance
app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// 2. Rate Limiting (Brute force protection)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100, 
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});
app.use("/api/", limiter);

app.use(express.json());

// 3. API Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pos", posRoutes);

// 4. Global Error Handler
app.use(errorHandler);

// 5. Static & SPA
app.get("*any", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"));
  }
});
