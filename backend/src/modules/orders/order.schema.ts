import { z } from "zod";

export const orderItemInputSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
  customization: z.record(z.any()).optional(),
});

export const createOrderSchema = z.object({
  restaurantId: z.string().min(1),
  tableId: z.string().optional(),
  customerId: z.string().optional(),
  items: z.array(orderItemInputSchema).min(1, "Order must contain at least one item"),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["RECEIVED", "PREPARING", "COOKING", "READY", "SERVED", "CANCELLED"]),
});

export const assignWaiterSchema = z.object({
  waiterId: z.string().min(1),
});

export const updatePaymentSchema = z.object({
  method: z.enum(["CASH", "CARD", "UPI", "STRIPE"]),
  status: z.enum(["PENDING", "PAID", "REFUNDED", "FAILED"]).default("PAID"),
  transactionId: z.string().optional(),
});

export const orderQuerySchema = z.object({
  restaurantId: z.string().min(1),
  status: z.enum(["RECEIVED", "PREPARING", "COOKING", "READY", "SERVED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "REFUNDED", "FAILED"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
