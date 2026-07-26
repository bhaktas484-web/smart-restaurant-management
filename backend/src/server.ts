import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app";
import { env } from "./config/env";
import { registerSocketHandlers, setIO } from "./sockets";

const app = createApp();
const httpServer = http.createServer(app);

export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
});

setIO(io);
registerSocketHandlers(io);

httpServer.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
});

// Prevent the process from dying silently on unexpected errors — log and exit
// cleanly so the process manager (Railway/Render) can restart it.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
