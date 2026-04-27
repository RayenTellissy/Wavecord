import { Server, type Connection } from "partyserver";
import { PartyEvents } from "./types";
import type { Env } from "./env";
import { verifySecret } from "./server";

// One DO instance per userId.
//
// Every browser client opens a single connection to its own user-party. The
// first connection writes status=ONLINE (via a callback to the Next.js app);
// the last one to close writes status=OFFLINE. The Next.js side does the
// fan-out to every server-party the user belongs to.
//
// Hibernation is disabled because we hold a connectionCount in memory.

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
    if (!url || !secret) return;
    try {
      await fetch(`${url}/api/internal/presence`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-partykit-secret": secret,
        },
        body: JSON.stringify({ userId: this.name, status }),
      });
    } catch (err) {
      console.error("[user-party] presence notify failed", err);
    }
    this.broadcast(
      JSON.stringify({ event: PartyEvents.USER_STATUS, payload: { userId: this.name, status } })
    );
  }
}
