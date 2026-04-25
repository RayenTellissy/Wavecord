import type { Server as SocketIOServer } from "socket.io";

declare global {
  // eslint-disable-next-line no-var
  var socketIO: SocketIOServer | undefined;
}

export function getIO(): SocketIOServer | undefined {
  if (!globalThis.socketIO && process.env.NODE_ENV === "development") {
    console.warn("[Socket.io] getIO() called before server was initialized — emit skipped");
  }
  return globalThis.socketIO;
}

export function setIO(io: SocketIOServer): void {
  globalThis.socketIO = io;
}

// Channel room key helpers
export const channelRoom = (channelId: string) => `channel:${channelId}`;
export const dmRoom = (conversationId: string) => `dm:${conversationId}`;
export const serverRoom = (serverId: string) => `server:${serverId}`;
export const userRoom = (userId: string) => `user:${userId}`;

// Socket event names (shared between server and client)
export const SocketEvents = {
  // Messages
  CHANNEL_MESSAGE_NEW: "channel:message:new",
  CHANNEL_MESSAGE_UPDATE: "channel:message:update",
  CHANNEL_MESSAGE_DELETE: "channel:message:delete",
  // DMs
  DM_MESSAGE_NEW: "dm:message:new",
  DM_MESSAGE_UPDATE: "dm:message:update",
  DM_MESSAGE_DELETE: "dm:message:delete",
  // Members
  MEMBER_UPDATE: "member:update",
  MEMBER_REMOVE: "member:remove",
  // Voice
  VOICE_STATE_UPDATE: "voice:state:update",
  // Notifications
  CHANNEL_MESSAGE_NOTIFY: "channel:message:notify",
  // Presence
  USER_STATUS: "user:status",
} as const;
