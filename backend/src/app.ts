import express from "express";
import cors from "cors";
import helmet from "helmet";
import productRoutes from "./routes/productRoutes.js";

export const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));