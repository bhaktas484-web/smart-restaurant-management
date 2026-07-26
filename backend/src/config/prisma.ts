import { PrismaClient } from "@prisma/client";

// In dev, tsx watch mode reloads modules on every save, which would create a
// new PrismaClient (and a new DB connection pool) each time without this
// global-singleton guard. Standard Prisma + Node hot-reload pattern.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV === "development") {
  global.__prisma = prisma;
}
