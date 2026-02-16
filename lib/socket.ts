import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: Server | undefined;

export function initSocket(server: HTTPServer) {
  if (io) {
    console.log("♻️ Socket already initialized");
    return io;
  }

  console.log("🚀 Initializing Socket.IO server");

  io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("join", (userId: string) => {
      socket.join(userId);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ DISCONNECTED:", socket.id, reason);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
