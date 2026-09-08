import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) return ApiResponse.error(res, "Unauthenticated", 401);
    
    if (!roles.includes(user.role)) {
      return ApiResponse.error(res, "Forbidden: Insufficient privileges", 403);
    }
    
    next();
  };
};
