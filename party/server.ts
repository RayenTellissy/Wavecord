import { Server, type Connection, type ConnectionContext } from "partyserver";
import { PartyEvents, type VoiceSession } from "./types";
import type { Env } from "./env";

// Voice channel state and event broadcasting.
type SocketState = {
  userId?: string;
  voice?: { channelId: string; userId: string };
};

export class MainParty extends Server<Env> {
  static options = { hibernate: false };
  declare env: Env;

  private voiceRooms = new Map<string, Map<string, VoiceSession>>();

  onConnect(conn: Connection<SocketState>, ctx: ConnectionContext) {
    const userId = new URL(ctx.request.url).searchParams.get("userId") ?? undefined;
    conn.setState({ userId });

    const snapshot: { channelId: string; serverId: string; sessions: VoiceSession[] }[] = [];
    for (const [channelId, room] of this.voiceRooms) {
      const sessions = Array.from(room.values());
      if (sessions.length) snapshot.push({ channelId, serverId: this.name, sessions });
    }
    if (snapshot.length) {
      conn.send(JSON.stringify({ event: PartyEvents.VOICE_STATE_SNAPSHOT, payload: snapshot }));
    }
  }

  onMessage(conn: Connection<SocketState>, message: string | ArrayBuffer) {
    if (typeof message !== "string") return;
    let parsed: { event: string; payload: unknown };
    try { parsed = JSON.parse(message); } catch { return; }

    // A late-joining subscriber (e.g. <MemberList> remounting on nav) may
    // attach to an already-open socket and miss the initial snapshot fired
    // by onConnect. Resend on demand.
    if (parsed.event === "voice:snapshot:request") {
      const snapshot: { channelId: string; serverId: string; sessions: VoiceSession[] }[] = [];
      for (const [channelId, room] of this.voiceRooms) {
        const sessions = Array.from(room.values());
        if (sessions.length) snapshot.push({ channelId, serverId: this.name, sessions });
      }
      if (snapshot.length) {
        conn.send(JSON.stringify({ event: PartyEvents.VOICE_STATE_SNAPSHOT, payload: snapshot }));
      } else {
        // Empty snapshot still useful — clients can clear stale state.
        conn.send(JSON.stringify({ event: PartyEvents.VOICE_STATE_SNAPSHOT, payload: [] }));
      }
      return;
    }

    if (parsed.event === "voice:join") {
      const p = parsed.payload as Partial<VoiceSession> | undefined;
      if (!p?.channelId || !p?.userId || !p?.serverId) return;
      const state = conn.state;
      if (state?.voice && state.voice.channelId !== p.channelId) {
        this.removeFromChannel(state.voice.channelId, state.voice.userId);
        this.broadcastChannel(state.voice.channelId);
      }
      let room = this.voiceRooms.get(p.channelId);
      if (!room) { room = new Map(); this.voiceRooms.set(p.channelId, room); }
      room.set(p.userId, {
        userId: p.userId,
        name: p.name ?? "User",
        image: p.image ?? null,
        serverId: p.serverId,
        channelId: p.channelId,
        isMuted: !!p.isMuted,
        isDeafened: !!p.isDeafened,
        isLive: false,
      });
      conn.setState({ ...state, voice: { channelId: p.channelId, userId: p.userId } });
      this.broadcastChannel(p.channelId);
      return;
    }

    if (parsed.event === "voice:leave") {
      const state = conn.state;
      if (!state?.voice) return;
      const { channelId, userId } = state.voice;
      this.removeFromChannel(channelId, userId);
      conn.setState({ ...state, voice: undefined });
      this.broadcastChannel(channelId);
      return;
    }

    if (parsed.event === "voice:state") {
      const state = conn.state;
      if (!state?.voice) return;
      const room = this.voiceRooms.get(state.voice.channelId);
      const session = room?.get(state.voice.userId);
      if (!session) return;
      const patch = parsed.payload as { isMuted?: boolean; isDeafened?: boolean; isLive?: boolean } | undefined;
      if (patch) {
        if (typeof patch.isMuted === "boolean") session.isMuted = patch.isMuted;
        if (typeof patch.isDeafened === "boolean") session.isDeafened = patch.isDeafened;
        if (typeof patch.isLive === "boolean") session.isLive = patch.isLive;
      }
      this.broadcastChannel(state.voice.channelId);
    }
  }

  onClose(conn: Connection<SocketState>) {
    const state = conn.state;
    if (state?.voice) {
      const { channelId, userId } = state.voice;
      this.removeFromChannel(channelId, userId);
      this.broadcastChannel(channelId);
    }
  }

  async onRequest(req: Request) {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    if (!verifySecret(req, this.env)) return new Response("Forbidden", { status: 403 });
    let body: { event: string; payload: unknown };
    try { body = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
    this.broadcast(JSON.stringify(body));
    return new Response("ok");
  }

  private removeFromChannel(channelId: string, userId: string) {
    const room = this.voiceRooms.get(channelId);
    if (!room) return;
    room.delete(userId);
    if (room.size === 0) this.voiceRooms.delete(channelId);
  }

  private broadcastChannel(channelId: string) {
    const room = this.voiceRooms.get(channelId);
    const sessions = room ? Array.from(room.values()) : [];
    this.broadcast(
      JSON.stringify({
        event: PartyEvents.VOICE_STATE_UPDATE,
        payload: { channelId, serverId: this.name, sessions },
      })
    );
  }
}

export function verifySecret(req: Request, env: Env): boolean {
  const expected = env.PARTYKIT_SECRET;
  if (!expected) return true;
  return req.headers.get("x-partykit-secret") === expected;
}
