import { Router } from "express";
import { orderController } from "./order.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireStaff, requireRole } from "../../middleware/rbac.middleware";

const router = Router();

// Any authenticated user (customer placing an order, or staff on their behalf) can create.
router.post("/", authMiddleware, orderController.create);

// Staff-only: viewing/managing the full order queue.
router.get("/", authMiddleware, requireStaff, orderController.list);
router.get("/:id", authMiddleware, orderController.getById); // customers can view their own order for tracking
router.patch("/:id/status", authMiddleware, requireStaff, orderController.updateStatus);
router.patch("/:id/assign-waiter", authMiddleware, requireRole("MANAGER", "ADMIN"), orderController.assignWaiter);
router.patch("/:id/cancel", authMiddleware, requireStaff, orderController.cancel);
router.post("/:id/payment", authMiddleware, requireRole("CASHIER", "MANAGER", "ADMIN"), orderController.recordPayment);

export default router;
