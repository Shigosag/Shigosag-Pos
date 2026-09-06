import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      return ApiResponse.error(res, "Access denied: Insufficient permissions", 403);
    }
    next();
  };
};
