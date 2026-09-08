import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Validates user roles server-side to prevent privilege escalation.
 * @param allowedRoles Array of Role enums allowed to access the route.
 */
export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return ApiResponse.error(res, "Authentication required", 401);
    }

    if (!allowedRoles.includes(user.role)) {
      return ApiResponse.error(res, "Access denied: Insufficient permissions", 403);
    }
    
    next();
  };
};
