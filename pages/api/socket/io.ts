import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/socket";
import { setIO } from "@/lib/socket";

export const config = { api: { bodyParser: false } };

export default function ioHandler(
  _req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as unknown as NetServer;

    const io = new SocketIOServer(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      socket.on("join-channel", (channelId: string) => {
        socket.join(`channel:${channelId}`);
      });
      socket.on("leave-channel", (channelId: string) => {
        socket.leave(`channel:${channelId}`);
      });
      socket.on("join-server", (serverId: string) => {
        socket.join(`server:${serverId}`);
      });
      socket.on("leave-server", (serverId: string) => {
        socket.leave(`server:${serverId}`);
      });
      socket.on("join-dm", (conversationId: string) => {
        socket.join(`dm:${conversationId}`);
      });
      socket.on("leave-dm", (conversationId: string) => {
        socket.leave(`dm:${conversationId}`);
      });
    });

    res.socket.server.io = io;
    console.log("[Socket.io] Server initialized");
  }

  // Always re-sync globalThis so App Router routes see the instance even
  // after a hot-module reload clears the previous reference.
  setIO(res.socket.server.io);

  res.end();
}
