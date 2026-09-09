import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("join", (room: string) => {
      if (room && typeof room === "string") {
        socket.join(room);
      }
    });

    socket.on("leave", (room: string) => {
      if (room && typeof room === "string") {
        socket.leave(room);
      }
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized. Call initSocket(server) first.");
  }
  return io;
};
