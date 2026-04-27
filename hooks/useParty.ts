"use client";

import { useEffect, useRef } from "react";
import PartySocket from "partysocket";

// Process-singleton cache of open PartySocket instances. Keyed by `${party}:${room}`.
// Multiple components can subscribe to the same room and we'll only open one
// socket; refcounting closes it when the last subscriber unmounts.
type Entry = { socket: PartySocket; refs: number };
const sockets = new Map<string, Entry>();

function host(): string {
  return (
    process.env.NEXT_PUBLIC_PARTYKIT_HOST ??
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "127.0.0.1:8787"
      : "")
  );
}

export interface PartyMessage {
  event: string;
  payload: unknown;
}

interface UsePartyOptions {
  party: "main" | "channel" | "dm" | "user";
  room: string | undefined;
  userId?: string;
  onMessage?: (msg: PartyMessage) => void;
  /** Called once when the underlying socket transitions to OPEN. */
  onOpen?: (socket: PartySocket) => void;
}

/**
 * Subscribes to a single PartyKit room. Sockets are shared across components
 * subscribing to the same (party, room) pair and refcounted on unmount.
 */
export function useParty({ party, room, userId, onMessage, onOpen }: UsePartyOptions) {
  const socketRef = useRef<PartySocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  onMessageRef.current = onMessage;
  onOpenRef.current = onOpen;

  useEffect(() => {
    if (!room) return;
    const h = host();
    if (!h) return;
    const key = `${party}:${room}`;

    let entry = sockets.get(key);
    if (!entry) {
      const socket = new PartySocket({
        host: h,
        party,
        room,
        query: userId ? { userId } : undefined,
      });
      entry = { socket, refs: 0 };
      sockets.set(key, entry);
    }
    entry.refs += 1;
    socketRef.current = entry.socket;

    const handleMessage = (e: MessageEvent) => {
      const cb = onMessageRef.current;
      if (!cb) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : null;
        if (data && typeof data === "object" && "event" in data) cb(data as PartyMessage);
      } catch {
        // ignore non-JSON frames
      }
    };
    const handleOpen = () => onOpenRef.current?.(entry!.socket);

    entry.socket.addEventListener("message", handleMessage);
    entry.socket.addEventListener("open", handleOpen);
    if (entry.socket.readyState === entry.socket.OPEN) handleOpen();

    return () => {
      entry!.socket.removeEventListener("message", handleMessage);
      entry!.socket.removeEventListener("open", handleOpen);
      entry!.refs -= 1;
      if (entry!.refs <= 0) {
        entry!.socket.close();
        sockets.delete(key);
      }
    };
  }, [party, room, userId]);

  return socketRef;
}
