import { Server, Socket } from "socket.io";

// Services (e.g. order.service.ts) need to emit socket events but must not
// import server.ts directly — that would create a circular dependency
// (server.ts -> app.ts -> routes -> service -> server.ts). Instead,
// server.ts calls setIO() once at startup, and services call getIO().
let ioInstance: Server | null = null;

export function setIO(io: Server) {
  ioInstance = io;
}

export function getIO(): Server {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized yet. Call setIO() in server.ts first.");
  }
  return ioInstance;
}

/**
 * Room-based real-time architecture:
 * - `restaurant:{id}`  -> staff dashboards (orders, kitchen, tables) for that restaurant
 * - `order:{id}`       -> the specific customer tracking that one order's live status
 *
 * Rooms let us broadcast "order ready" to exactly the customer watching it,
 * and "new order" to exactly the kitchen staff of that restaurant — without
 * leaking data across restaurants or customers.
 */
export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join:restaurant", (restaurantId: string) => {
      socket.join(`restaurant:${restaurantId}`);
    });

    socket.on("join:order", (orderId: string) => {
      socket.join(`order:${orderId}`);
    });

    socket.on("leave:order", (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

/**
 * Helper called from order.service.ts whenever an order's status changes.
 * Emits to both the customer tracking that order and the restaurant's staff views.
 */
export function emitOrderStatusUpdate(
  io: Server,
  params: { orderId: string; restaurantId: string; status: string; tableLabel?: string }
) {
  io.to(`order:${params.orderId}`).emit("order:statusUpdated", params);
  io.to(`restaurant:${params.restaurantId}`).emit("kitchen:orderUpdated", params);
}

/** Helper for table status changes (drag-and-drop reassignment, cleaning, etc.) */
export function emitTableStatusUpdate(
  io: Server,
  params: { restaurantId: string; tableId: string; status: string }
) {
  io.to(`restaurant:${params.restaurantId}`).emit("table:statusUpdated", params);
}

/** Helper for low-stock / AI-generated alerts pushed to managers. */
export function emitNotification(
  io: Server,
  params: { restaurantId: string; type: string; title: string; message: string }
) {
  io.to(`restaurant:${params.restaurantId}`).emit("notification:new", params);
}
