import { Server, type Connection } from "partyserver";
import { PartyEvents } from "./types";
import type { Env } from "./env";
import { verifySecret } from "./server";

// Presence management for users.
export class UserParty extends Server<Env> {
  static options = { hibernate: false };
  declare env: Env;

  private connectionCount = 0;

  async onConnect(_conn: Connection) {
    this.connectionCount += 1;
    if (this.connectionCount === 1) {
      await this.notifyPresence("ONLINE");
    }
  }

  async onClose(_conn: Connection) {
    this.connectionCount = Math.max(0, this.connectionCount - 1);
    if (this.connectionCount === 0) {
      await this.notifyPresence("OFFLINE");
    }
  }

  async onRequest(req: Request) {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    if (!verifySecret(req, this.env)) return new Response("Forbidden", { status: 403 });
    const body = await req.text();
    this.broadcast(body);
    return new Response("ok");
  }

  private async notifyPresence(status: "ONLINE" | "OFFLINE") {
    const url = this.env.NEXT_APP_URL;
    const secret = this.env.PARTYKIT_SECRET;
    if (!url || !secret) {
      console.error("[user-party] missing env: url=%s secret=%s", !!url, !!secret);
      return;
    }
    try {
      const res = await fetch(`${url}/api/internal/presence`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-partykit-secret": secret,
        },
        body: JSON.stringify({ userId: this.name, status }),
      });
      console.log("[user-party] presence %s → %d", status, res.status);
    } catch (err) {
      console.error("[user-party] presence notify failed", err);
    }
    this.broadcast(
      JSON.stringify({ event: PartyEvents.USER_STATUS, payload: { userId: this.name, status } })
    );
  }
}
