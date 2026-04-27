// Env shape exposed to party servers via `this.env`. The DO bindings are
// opaque here — they're only used at the worker entry, where they're typed
// against @cloudflare/workers-types.

export interface Env {
  PARTYKIT_SECRET?: string;
  NEXT_APP_URL?: string;
  MAIN?: unknown;
  CHANNEL?: unknown;
  DM?: unknown;
  USER?: unknown;
}
