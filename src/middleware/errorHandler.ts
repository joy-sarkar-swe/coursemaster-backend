import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../types";

export const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { ...error, statusCode: 404, message };
  }

  // Mongoose duplicate key
  if (err.statusCode === 11000) {
    const message = "Duplicate field value entered";
    error = { ...error, statusCode: 400, message };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errorsObj = (err as any).errors || {};
    const message = Object.values(errorsObj)
      .map((val: any) => val.message)
      .join(", ");
    error = { ...error, statusCode: 400, message };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};
