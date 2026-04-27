// Shared event names + payload types for PartyKit + the Next.js app.
// Mirrors the old SocketEvents enum from lib/socket.ts.

export const PartyEvents = {
  // Channel messages
  CHANNEL_MESSAGE_NEW: "channel:message:new",
  CHANNEL_MESSAGE_UPDATE: "channel:message:update",
  CHANNEL_MESSAGE_DELETE: "channel:message:delete",
  // Direct messages
  DM_MESSAGE_NEW: "dm:message:new",
  DM_MESSAGE_UPDATE: "dm:message:update",
  DM_MESSAGE_DELETE: "dm:message:delete",
  // Server members
  MEMBER_UPDATE: "member:update",
  MEMBER_REMOVE: "member:remove",
  // Voice
  VOICE_STATE_UPDATE: "voice:state:update",
  VOICE_STATE_SNAPSHOT: "voice:state:snapshot",
  // Presence
  USER_STATUS: "user:status",
  // User-targeted
  CHANNEL_MESSAGE_NOTIFY: "channel:message:notify",
} as const;

export type PartyEventName = (typeof PartyEvents)[keyof typeof PartyEvents];

export interface VoiceSession {
  userId: string;
  name: string;
  image: string | null;
  serverId: string;
  channelId: string;
  isMuted: boolean;
  isDeafened: boolean;
  isLive: boolean;
}

export interface PartyEnvelope {
  event: PartyEventName | string;
  payload: unknown;
}
