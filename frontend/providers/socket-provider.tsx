"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000", {
      autoConnect: true,
      withCredentials: true,
    });
  }

  useEffect(() => {
    const socket = socketRef.current;
    return () => {
      socket?.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
}

/** Access the shared socket instance from any client component. */
export function useSocket() {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("useSocket must be used within SocketProvider");
  return socket;
}