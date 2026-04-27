/// <reference types="@cloudflare/workers-types" />
import { routePartykitRequest } from "partyserver";

// Re-export the party classes so Wrangler can find the DO classes referenced
// from wrangler.toml. The bindings (MAIN/CHANNEL/DM/USER) point at these names.
export { MainParty } from "../party/server";
export { ChannelParty } from "../party/channel";
export { DmParty } from "../party/dm";
export { UserParty } from "../party/user";

export interface Env {
  MAIN: DurableObjectNamespace;
  CHANNEL: DurableObjectNamespace;
  DM: DurableObjectNamespace;
  USER: DurableObjectNamespace;
  PARTYKIT_SECRET?: string;
  NEXT_APP_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env as unknown as Record<string, unknown>)) ??
      new Response("Not found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
