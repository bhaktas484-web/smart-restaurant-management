import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";

/**
 * Throw `new AppError("message", 404)` anywhere in a controller/service
 * and it will be caught here and formatted consistently.
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes "expected" errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  // Zod validation errors -> 422 with field-level details
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
    });
  }

  // Known, expected errors (thrown intentionally via AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma unique constraint violation, etc.
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${err.meta?.target ?? "unknown"}`,
    });
  }

  // Unknown/unexpected error — log full detail server-side, hide internals from client
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong on our end.",
    ...(env.NODE_ENV === "development" && { stack: err.stack, detail: err.message }),
  });
}
