"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io as socketIO, type Socket } from "socket.io-client";

let globalSocket: Socket | null = null;

function ensureSocket(userId: string | undefined): Socket {
  if (globalSocket) return globalSocket;
  globalSocket = socketIO({
    path: "/api/socket/io",
    addTrailingSlash: false,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
    auth: userId ? { userId } : {},
  });
  if (process.env.NODE_ENV === "development") {
    globalSocket.on("connect", () => console.log("[ws] connect", globalSocket!.id));
    globalSocket.on("disconnect", (r) => console.log("[ws] disconnect", r));
    globalSocket.on("connect_error", (e) => console.log("[ws] connect_error", e.message));
  }
  return globalSocket;
}

export function useSocket() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [socket, setSocket] = useState<Socket | null>(globalSocket);
  const [connected, setConnected] = useState<boolean>(globalSocket?.connected ?? false);

  useEffect(() => {
    if (status === "loading") return;
    const s = ensureSocket(userId);
    setSocket(s);
    setConnected(s.connected);
  }, [status, userId]);

  useEffect(() => {
    if (!socket) return;
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    if (socket.connected) setConnected(true);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  // Supplemental identify — idempotent on the server; closes the race if
  // the socket was created before the session resolved.
  useEffect(() => {
    if (!socket || !userId) return;
    const emitIdentify = () => socket.emit("identify", userId);
    if (socket.connected) emitIdentify();
    socket.on("connect", emitIdentify);
    return () => {
      socket.off("connect", emitIdentify);
    };
  }, [socket, userId]);

  return { socket, connected };
}
