import { Request, Response } from "express";
import { ProductService } from "../services/productService.js";
import { productSchema } from "../validations/productValidator.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getIO } from "../lib/socket.js";

export const ProductController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const category = typeof req.query.category === "string" ? req.query.category : undefined;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;

      const result = await ProductService.getAll({ search, category, page, limit });
      return ApiResponse.success(res, result, "Inventory fetched");
    } catch (error) {
      return ApiResponse.error(res, "Failed to load products", 500);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const product = await ProductService.getById(req.params.id);
      if (!product) return ApiResponse.error(res, "Product not found", 404);
      return ApiResponse.success(res, product);
    } catch (error) {
      return ApiResponse.error(res, "Failed to fetch product", 500);
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const parsed = productSchema.safeParse(req.body);
      if (!parsed.success) {
        return ApiResponse.error(res, "Invalid product data", 400, parsed.error.format());
      }

      const product = await ProductService.create(parsed.data);
      try {
        getIO().emit("product:update", product);
      } catch (_) {}

      return ApiResponse.success(res, product, "Product created", 201);
    } catch (error: any) {
      return ApiResponse.error(res, error.message || "Failed to create product", 400);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const parsed = productSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return ApiResponse.error(res, "Invalid product update data", 400, parsed.error.format());
      }

      const product = await ProductService.update(req.params.id, parsed.data);
      try {
        getIO().emit("product:update", product);
      } catch (_) {}

      return ApiResponse.success(res, product, "Product updated");
    } catch (error: any) {
      return ApiResponse.error(res, error.message || "Failed to update product", 400);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await ProductService.delete(req.params.id);
      try {
        getIO().emit("product:delete", { id: req.params.id });
      } catch (_) {}

      return ApiResponse.success(res, null, "Product deleted successfully");
    } catch (error: any) {
      return ApiResponse.error(res, error.message || "Failed to delete product", 400);
    }
  }
};
