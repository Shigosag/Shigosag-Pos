import { Request, Response } from "express";
import { ProductService } from "../services/productService.js";
import { productSchema } from "../validations/productValidator.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { io } from "../server.js";

export const ProductController = {
  getAll: async (_: Request, res: Response) => {
    try {
      const products = await ProductService.getAll();
      return ApiResponse.success(res, products, "Inventory fetched");
    } catch (error) {
      return ApiResponse.error(res, "Failed to load products");
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const parsed = productSchema.safeParse(req.body);
      if (!parsed.success) return ApiResponse.error(res, "Invalid product data", 400, parsed.error);

      const product = await ProductService.create(parsed.data);
      io.emit("product:update", product);
      return ApiResponse.success(res, product, "Product created", 201);
    } catch (error) {
      return ApiResponse.error(res, "Failed to create product");
    }
  }
};
