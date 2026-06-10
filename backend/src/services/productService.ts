import { prisma } from "../config/db.js";

export const ProductService = {
  getAll: async () => prisma.product.findMany(),
  create: async (data: any) => prisma.product.create({ data })
};