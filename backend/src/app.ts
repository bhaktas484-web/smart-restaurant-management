import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";

// Feature routers — added incrementally as each module is built.
import authRoutes from "./modules/auth/auth.routes";
import orderRoutes from "./modules/orders/order.routes";

export function createApp(): Application {
  const app = express();

  // --- Security & core middleware ---
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

  // Global rate limiter — protects against brute force / abuse.
  // Auth routes get a stricter limiter defined inside auth.routes.ts.
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: "Too many requests, please try again later." },
    })
  );

  // --- Health check (useful for Railway/Render deploy checks) ---
  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Server is healthy", timestamp: new Date().toISOString() });
  });

  // --- API routes ---
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/orders", orderRoutes);
  // Additional modules mount here as they're built:
  // app.use("/api/v1/tables", tableRoutes);
  // app.use("/api/v1/menu", menuRoutes);
  // app.use("/api/v1/inventory", inventoryRoutes);
  // app.use("/api/v1/billing", billingRoutes);
  // app.use("/api/v1/staff", staffRoutes);
  // app.use("/api/v1/reports", reportRoutes);
  // app.use("/api/v1/ai", aiRoutes);

  // --- 404 + error handling (must be last) ---
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
