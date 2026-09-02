import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import posRoutes from "./routes/posRoutes.js";

// 1. Initialize app
export const app = express();

// 2. Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// 3. API Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pos", posRoutes);

// 4. Static Files (For Production)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "../../frontend/dist");

app.use(express.static(distPath));

// 5. SPA Fallback
app.get("*any", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"));
  }
});
