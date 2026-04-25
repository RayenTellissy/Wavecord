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
  // app.prepare() loads .env.local — safe to require db now
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { db } = require("./lib/db") as typeof import("./lib/db");

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

  // Reset all user statuses to OFFLINE on server startup (handles crash/restart).
  db.user.updateMany({ data: { status: "OFFLINE" } }).catch(console.error);

  // ─── Presence tracking (in-memory) ────────────────────────────────────────
  // userId → Set of active socketIds. When the set hits 0, the user is offline.
  const userSockets = new Map<string, Set<string>>();

  async function broadcastUserStatus(userId: string, status: "ONLINE" | "OFFLINE") {
    const memberships = await db.serverMember.findMany({
      where: { userId },
      select: { serverId: true },
    });
    for (const { serverId } of memberships) {
      io.to(`server:${serverId}`).emit("user:status", { userId, status });
    }
  }

  function trackUserConnect(userId: string, socketId: string) {
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    const sockets = userSockets.get(userId)!;
    const wasOffline = sockets.size === 0;
    sockets.add(socketId);
    if (wasOffline) {
      db.user.update({ where: { id: userId }, data: { status: "ONLINE" } })
        .then(() => broadcastUserStatus(userId, "ONLINE"))
        .catch(console.error);
    }
  }

  function trackUserDisconnect(userId: string, socketId: string) {
    const sockets = userSockets.get(userId);
    if (!sockets) return;
    sockets.delete(socketId);
    if (sockets.size === 0) {
      userSockets.delete(userId);
      db.user.update({ where: { id: userId }, data: { status: "OFFLINE" } })
        .then(() => broadcastUserStatus(userId, "OFFLINE"))
        .catch(console.error);
    }
  }

  // ─── Voice-channel occupancy registry (in-memory) ──────────────────────────
  // channelId → userId → session data. Broadcast on every mutation so every
  // user viewing the server sees who's in which voice channel.
  type VoiceSession = {
    userId: string;
    name: string;
    image: string | null;
    serverId: string;
    channelId: string;
    isMuted: boolean;
    isDeafened: boolean;
    isLive: boolean;
  };
  const voiceRooms = new Map<string, Map<string, VoiceSession>>();
  // Track each socket's current session so we can clean up on disconnect.
  const socketSessions = new Map<string, { channelId: string; userId: string; serverId: string }>();

  function snapshotChannel(channelId: string): VoiceSession[] {
    const room = voiceRooms.get(channelId);
    return room ? Array.from(room.values()) : [];
  }

  function broadcastChannel(channelId: string, serverId: string) {
    io.to(`server:${serverId}`).emit("voice:state:update", {
      channelId,
      serverId,
      sessions: snapshotChannel(channelId),
    });
  }

  io.on("connection", (socket) => {
    const authUserId = (socket.handshake.auth as { userId?: string } | undefined)?.userId;
    if (authUserId && typeof authUserId === "string") {
      socket.join(`user:${authUserId}`);
      trackUserConnect(authUserId, socket.id);
    }

    socket.on("identify", (userId: string) => {
      if (typeof userId === "string" && userId.length > 0) {
        socket.join(`user:${userId}`);
        // Only track if not already tracked from handshake auth
        if (userId !== authUserId) trackUserConnect(userId, socket.id);
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
      // Send current voice state for all channels in this server on subscribe.
      const payload: { channelId: string; serverId: string; sessions: VoiceSession[] }[] = [];
      for (const [channelId, room] of voiceRooms) {
        const sessions = Array.from(room.values()).filter((s) => s.serverId === serverId);
        if (sessions.length) payload.push({ channelId, serverId, sessions });
      }
      if (payload.length) socket.emit("voice:state:snapshot", payload);
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

    // ─── Voice presence ───
    socket.on("voice:join", (payload: {
      channelId: string; serverId: string; userId: string;
      name: string; image: string | null;
      isMuted: boolean; isDeafened: boolean;
    }) => {
      if (!payload?.channelId || !payload?.userId || !payload?.serverId) return;
      const prev = socketSessions.get(socket.id);
      if (prev && prev.channelId !== payload.channelId) {
        const prevRoom = voiceRooms.get(prev.channelId);
        prevRoom?.delete(prev.userId);
        if (prevRoom && prevRoom.size === 0) voiceRooms.delete(prev.channelId);
        broadcastChannel(prev.channelId, prev.serverId);
      }
      let room = voiceRooms.get(payload.channelId);
      if (!room) { room = new Map(); voiceRooms.set(payload.channelId, room); }
      room.set(payload.userId, {
        userId: payload.userId,
        name: payload.name,
        image: payload.image,
        serverId: payload.serverId,
        channelId: payload.channelId,
        isMuted: !!payload.isMuted,
        isDeafened: !!payload.isDeafened,
        isLive: false,
      });
      socketSessions.set(socket.id, {
        channelId: payload.channelId, userId: payload.userId, serverId: payload.serverId,
      });
      broadcastChannel(payload.channelId, payload.serverId);
    });

    socket.on("voice:leave", () => {
      const prev = socketSessions.get(socket.id);
      if (!prev) return;
      const room = voiceRooms.get(prev.channelId);
      room?.delete(prev.userId);
      if (room && room.size === 0) voiceRooms.delete(prev.channelId);
      socketSessions.delete(socket.id);
      broadcastChannel(prev.channelId, prev.serverId);
    });

    socket.on("voice:state", (patch: { isMuted?: boolean; isDeafened?: boolean; isLive?: boolean }) => {
      const prev = socketSessions.get(socket.id);
      if (!prev) return;
      const room = voiceRooms.get(prev.channelId);
      const session = room?.get(prev.userId);
      if (!session) return;
      if (typeof patch.isMuted === "boolean") session.isMuted = patch.isMuted;
      if (typeof patch.isDeafened === "boolean") session.isDeafened = patch.isDeafened;
      if (typeof patch.isLive === "boolean") session.isLive = patch.isLive;
      broadcastChannel(prev.channelId, prev.serverId);
    });

    if (dev) {
      console.log(
        `[Socket.io] connect id=${socket.id} user=${authUserId ?? "(anon)"}`
      );
    }

    socket.on("disconnect", (reason) => {
      const prev = socketSessions.get(socket.id);
      if (prev) {
        const room = voiceRooms.get(prev.channelId);
        room?.delete(prev.userId);
        if (room && room.size === 0) voiceRooms.delete(prev.channelId);
        socketSessions.delete(socket.id);
        broadcastChannel(prev.channelId, prev.serverId);
      }
      if (authUserId) trackUserDisconnect(authUserId, socket.id);
      if (dev) console.log(`[Socket.io] disconnect id=${socket.id} reason=${reason}`);
    });
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
