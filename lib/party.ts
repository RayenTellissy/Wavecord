
import { PartyEvents } from "@/party/types";

export { PartyEvents };

type PartyName = "main" | "channel" | "dm" | "user";

function host(): string | null {
  return process.env.PARTYKIT_HOST ?? null;
}

function protocol(h: string): string {
  return h.startsWith("127.0.0.1") || h.startsWith("localhost") ? "http" : "https";
}

export async function publish(
  party: PartyName,
  roomId: string,
  event: string,
  payload: unknown,
): Promise<void> {
  const h = host();
  if (!h) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[party] PARTYKIT_HOST unset — skipping ${party}/${roomId} ${event}`);
    }
    return;
  }
  const url = `${protocol(h)}://${h}/parties/${party}/${roomId}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-partykit-secret": process.env.PARTYKIT_SECRET ?? "",
      },
      body: JSON.stringify({ event, payload }),
    });
    if (!res.ok && process.env.NODE_ENV === "development") {
      console.warn(`[party] ${url} → ${res.status}`);
    }
  } catch (err) {
    console.error(`[party] publish failed (${party}/${roomId} ${event})`, err);
  }
}

export const publishToServer = (serverId: string, event: string, payload: unknown) =>
  publish("main", serverId, event, payload);
export const publishToChannel = (channelId: string, event: string, payload: unknown) =>
  publish("channel", channelId, event, payload);
export const publishToDm = (conversationId: string, event: string, payload: unknown) =>
  publish("dm", conversationId, event, payload);
export const publishToUser = (userId: string, event: string, payload: unknown) =>
  publish("user", userId, event, payload);
