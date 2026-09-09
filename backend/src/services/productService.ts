import { prisma } from "../lib/prisma.js";

export const ProductService = {
  getAll: async (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    const page = Math.max(1, params?.page || 1);
    const limit = Math.min(200, Math.max(1, params?.limit || 100));
    const skip = (page - 1) * limit;

    const where: any = {
      isArchived: false,
      deletedAt: null
    };

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { barcode: { contains: params.search } },
        { sku: { contains: params.search } }
      ];
    }

    if (params?.category && params.category !== "All") {
      where.category = params.category;
    }

    const [total, items] = await Promise.all([
      (prisma as any).product.count({ where }),
      (prisma as any).product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      })
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
  },

  getById: async (id: string) => {
    return (prisma as any).product.findFirst({
      where: { id, deletedAt: null }
    });
  },

  create: async (data: { name: string; price: number; stock: number; category?: string; barcode?: string }) => {
    return (prisma as any).product.create({
      data: {
        name: data.name.trim(),
        price: data.price,
        stock: data.stock,
        category: data.category || "General",
        barcode: data.barcode || null
      }
    });
  },

  update: async (id: string, data: Partial<{ name: string; price: number; stock: number; category: string; barcode: string; isArchived: boolean }>) => {
    return (prisma as any).product.update({
      where: { id },
      data
    });
  },

  delete: async (id: string) => {
    return (prisma as any).product.update({
      where: { id },
      data: { deletedAt: new Date(), isArchived: true }
    });
  }
};
