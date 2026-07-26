import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import { getIO, emitOrderStatusUpdate } from "../../sockets";
import type { CreateOrderInput, OrderQueryInput, UpdateOrderStatusInput } from "./order.schema";

const TAX_RATE = 0.05; // 5% — flat rate for hackathon simplicity; make configurable per-restaurant later

export const orderService = {
  async createOrder(input: CreateOrderInput) {
    // Fetch all menu items in one query to compute totals and validate availability.
    const menuItemIds = input.items.map((i) => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, restaurantId: input.restaurantId },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new AppError("One or more menu items are invalid for this restaurant.", 400);
    }
    const unavailable = menuItems.find((m) => !m.isAvailable);
    if (unavailable) {
      throw new AppError(`"${unavailable.name}" is currently unavailable.`, 400);
    }

    const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));
    let subtotal = 0;
    const orderItemsData = input.items.map((item) => {
      const menuItem = menuItemMap.get(item.menuItemId)!;
      const price = Number(menuItem.price);
      subtotal += price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price,
        notes: item.notes,
        customization: item.customization,
      };
    });

    // Optional coupon
    let discount = 0;
    let couponId: string | undefined;
    if (input.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: input.couponCode } });
      if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) {
        throw new AppError("Invalid or expired coupon.", 400);
      }
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new AppError("This coupon has reached its usage limit.", 400);
      }
      discount = (subtotal * coupon.discountPct) / 100;
      couponId = coupon.id;
    }

    const tax = (subtotal - discount) * TAX_RATE;
    const total = subtotal - discount + tax;

    // Everything below happens atomically: creating the order, its items,
    // bumping the coupon usage count, and deducting inventory. If any step
    // fails (e.g. insufficient stock), the whole order creation rolls back —
    // we never want a half-created order or partially deducted stock.
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          restaurantId: input.restaurantId,
          tableId: input.tableId,
          customerId: input.customerId,
          notes: input.notes,
          subtotal,
          tax,
          discount,
          total,
          couponId,
          items: { create: orderItemsData },
        },
        include: { items: { include: { menuItem: true } }, table: true },
      });

      if (couponId) {
        await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
      }

      // Auto-deduct inventory based on each menu item's recipe.
      for (const item of input.items) {
        const recipeLinks = await tx.recipeIngredient.findMany({
          where: { menuItemId: item.menuItemId },
        });
        for (const link of recipeLinks) {
          await tx.ingredient.update({
            where: { id: link.ingredientId },
            data: { currentStock: { decrement: link.quantityUsed * item.quantity } },
          });
        }
      }

      // Bump each menu item's popularity counter for "top selling dishes" reports.
      for (const item of input.items) {
        await tx.menuItem.update({
          where: { id: item.menuItemId },
          data: { totalOrders: { increment: item.quantity } },
        });
      }

      // Mark the table occupied, if this is a dine-in order.
      if (input.tableId) {
        await tx.restaurantTable.update({ where: { id: input.tableId }, data: { status: "OCCUPIED" } });
      }

      return created;
    });

    // Notify kitchen + customer in real time.
    emitOrderStatusUpdate(getIO(), {
      orderId: order.id,
      restaurantId: input.restaurantId,
      status: order.status,
      tableLabel: order.table?.label,
    });

    return order;
  },

  async listOrders(query: OrderQueryInput) {
    const where: any = { restaurantId: query.restaurantId };
    if (query.status) where.status = query.status;
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
    if (query.search) {
      where.OR = [
        { id: { contains: query.search, mode: "insensitive" } },
        { table: { label: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { menuItem: true } }, table: true, waiter: true },
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: { page: query.page, limit: query.limit, total, pages: Math.ceil(total / query.limit) },
    };
  },

  async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { menuItem: true } }, table: true, waiter: true, payment: true },
    });
    if (!order) throw new AppError("Order not found.", 404);
    return order;
  },

  async updateStatus(orderId: string, input: UpdateOrderStatusInput) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: input.status },
      include: { table: true },
    });

    // Free up the table once an order is served or cancelled.
    if (order.tableId && (input.status === "SERVED" || input.status === "CANCELLED")) {
      await prisma.restaurantTable.update({ where: { id: order.tableId }, data: { status: "CLEANING" } });
    }

    emitOrderStatusUpdate(getIO(), {
      orderId: order.id,
      restaurantId: order.restaurantId,
      status: order.status,
      tableLabel: order.table?.label,
    });

    return order;
  },

  async assignWaiter(orderId: string, waiterId: string) {
    return prisma.order.update({ where: { id: orderId }, data: { waiterId } });
  },

  async cancelOrder(orderId: string) {
    return this.updateStatus(orderId, { status: "CANCELLED" });
  },

  async recordPayment(orderId: string, method: "CASH" | "CARD" | "UPI" | "STRIPE", transactionId?: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new AppError("Order not found.", 404);

    const [, updatedOrder] = await prisma.$transaction([
      prisma.payment.upsert({
        where: { orderId },
        create: { orderId, amount: order.total, method, status: "PAID", transactionId },
        update: { method, status: "PAID", transactionId },
      }),
      prisma.order.update({ where: { id: orderId }, data: { paymentStatus: "PAID", paymentMethod: method } }),
    ]);

    return updatedOrder;
  },
};
