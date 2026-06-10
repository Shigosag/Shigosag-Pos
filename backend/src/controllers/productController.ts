import { Request, Response } from "express";
import { ProductService } from "../services/productService.js";
import { productSchema } from "../validations/productValidator.js";
import { io } from "../server.js";

export const ProductController = {
  getAll: async (_: Request, res: Response) => {
    const products = await ProductService.getAll();
    res.json(products);
  },

  create: async (req: Request, res: Response) => {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const product = await ProductService.create(parsed.data);
    io.emit("product:update", product);
    res.status(201).json(product);
  }
};