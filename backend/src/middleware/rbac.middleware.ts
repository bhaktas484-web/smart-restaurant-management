import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { AppError } from "./error.middleware";

/**
 * Usage: router.post("/orders", authMiddleware, requireRole("WAITER", "MANAGER"), handler)
 * Must run AFTER authMiddleware, since it reads req.user set there.
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action.", 403));
    }
    next();
  };
}

/** Shorthand for the common "staff only" (everyone except customer) check. */
export const requireStaff = requireRole("WAITER", "CHEF", "CASHIER", "MANAGER", "ADMIN");

/** Shorthand for admin/manager-only operations like staff management or settings. */
export const requireManagement = requireRole("MANAGER", "ADMIN");
