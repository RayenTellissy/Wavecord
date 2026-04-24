import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { setIO } from "./lib/socket";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url || "/", true);
    handler(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    path: "/api/socket/io",
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_SITE_URL ?? `http://${hostname}:${port}`,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const authUserId = (socket.handshake.auth as { userId?: string } | undefined)?.userId;
    if (authUserId && typeof authUserId === "string") {
      socket.join(`user:${authUserId}`);
    }

    socket.on("identify", (userId: string) => {
      if (typeof userId === "string" && userId.length > 0) {
        socket.join(`user:${userId}`);
      }
    });

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

    if (dev) {
      console.log(
        `[Socket.io] connect id=${socket.id} user=${authUserId ?? "(anon)"}`
      );
      socket.on("disconnect", (reason) => {
        console.log(`[Socket.io] disconnect id=${socket.id} reason=${reason}`);
      });
    }
  });

  setIO(io);

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`[Socket.io] Attached at /api/socket/io`);
    });
});
