import { Server } from "partyserver";
import type { Env } from "./env";
import { verifySecret } from "./server";

// One DO instance per conversationId. Both DM participants connect; API
// routes POST dm:* events.

export class DmParty extends Server<Env> {
  declare env: Env;

  async onRequest(req: Request) {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    if (!verifySecret(req, this.env)) return new Response("Forbidden", { status: 403 });
    const body = await req.text();
    this.broadcast(body);
    return new Response("ok");
  }
}
