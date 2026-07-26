import { Request, Response, NextFunction } from "express";
import { orderService } from "./order.service";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  assignWaiterSchema,
  updatePaymentSchema,
  orderQuerySchema,
} from "./order.schema";

export const orderController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createOrderSchema.parse(req.body);
      const order = await orderService.createOrder(input);
      res.status(201).json({ success: true, message: "Order placed successfully.", data: order });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = orderQuerySchema.parse(req.query);
      const result = await orderService.listOrders(query);
      res.status(200).json({ success: true, data: result.orders, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateOrderStatusSchema.parse(req.body);
      const order = await orderService.updateStatus(req.params.id, input);
      res.status(200).json({ success: true, message: "Order status updated.", data: order });
    } catch (err) {
      next(err);
    }
  },

  async assignWaiter(req: Request, res: Response, next: NextFunction) {
    try {
      const input = assignWaiterSchema.parse(req.body);
      const order = await orderService.assignWaiter(req.params.id, input.waiterId);
      res.status(200).json({ success: true, message: "Waiter assigned.", data: order });
    } catch (err) {
      next(err);
    }
  },

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.cancelOrder(req.params.id);
      res.status(200).json({ success: true, message: "Order cancelled.", data: order });
    } catch (err) {
      next(err);
    }
  },

  async recordPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updatePaymentSchema.parse(req.body);
      const order = await orderService.recordPayment(req.params.id, input.method, input.transactionId);
      res.status(200).json({ success: true, message: "Payment recorded.", data: order });
    } catch (err) {
      next(err);
    }
  },
};
