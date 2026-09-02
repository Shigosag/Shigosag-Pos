import express from "express";
import cors from "cors";
import helmet from "helmet";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import posRoutes from "./routes/posRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  }
});

export const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pos", posRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
