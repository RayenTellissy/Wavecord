"use client";

import { useEffect, useRef, useState } from "react";
import { io as socketIO, type Socket } from "socket.io-client";

let globalSocket: Socket | null = null;
let serverInitialized = false;

async function ensureServerInitialized() {
  if (serverInitialized) return;
  try {
    await fetch("/api/socket/io");
    serverInitialized = true;
  } catch {
    // will retry on next mount
  }
}

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let onConnect: (() => void) | undefined;
    let onDisconnect: (() => void) | undefined;

    ensureServerInitialized().then(() => {
      if (!globalSocket) {
        globalSocket = socketIO({
          path: "/api/socket/io",
          addTrailingSlash: false,
          // WebSocket only — polling requests are routed through the Pages Router
          // handler which calls res.end(), breaking socket.io's protocol.
          transports: ["websocket"],
        });
      }

      socketRef.current = globalSocket;

      onConnect = () => setConnected(true);
      onDisconnect = () => setConnected(false);

      globalSocket.on("connect", onConnect);
      globalSocket.on("disconnect", onDisconnect);

      if (globalSocket.connected) setConnected(true);
    });

    return () => {
      if (onConnect) globalSocket?.off("connect", onConnect);
      if (onDisconnect) globalSocket?.off("disconnect", onDisconnect);
    };
  }, []);

  return { socket: socketRef.current, connected };
}
