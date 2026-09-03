import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import { rateLimit } from 'express-rate-limit';
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import posRoutes from "./routes/posRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../../frontend/dist");

export const app = express();

// 1. Security & Performance
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "cdn.tailwindcss.com"],
    },
  },
}));
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// 2. Rate Limiting
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

// 4. Static Files (Production Build)
app.use(express.static(distPath));

// 5. Global Error Handler
app.use(errorHandler);

// 6. SPA Fallback
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"));
  }
});
