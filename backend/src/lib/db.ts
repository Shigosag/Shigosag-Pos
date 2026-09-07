import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async findMany({ model, operation, args, query }) {
        if (args.where) {
          if (args.where.deletedAt === undefined) {
            args.where = { ...args.where, deletedAt: null };
          }
        } else {
          args.where = { deletedAt: null };
        }
        return query(args);
      },
      async findFirst({ model, operation, args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findUnique({ model, operation, args, query }) {
        // Special case for unique: Prisma doesn't allow 'where' modification here normally
        // but we ensure business logic handles it
        return query(args);
      },
    },
  },
});
