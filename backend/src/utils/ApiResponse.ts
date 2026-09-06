import { Response } from "express";

export class ApiResponse {
  static success(res: Response, data: any, message = "Operation successful", code = 200) {
    return res.status(code).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res: Response, message = "Internal Server Error", code = 500, details: any = null) {
    return res.status(code).json({
      success: false,
      message,
      details,
      timestamp: new Date().toISOString()
    });
  }
}
