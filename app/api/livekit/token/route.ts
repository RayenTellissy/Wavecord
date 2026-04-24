import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { auth } from "@/auth";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const userId = await requireUserId();
    const session = await auth();

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");

    if (!channelId) {
      return NextResponse.json({ error: "channelId required" }, { status: 400 });
    }

    const channel = await db.channel.findUnique({
      where: { id: channelId },
      include: {
        server: {
          include: {
            members: { where: { userId } },
            bans: { where: { userId } },
          },
        },
      },
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }
    if (channel.server.bans.length > 0) {
      return NextResponse.json({ error: "You are banned from this server" }, { status: 403 });
    }
    if (!channel.server.members.length) {
      return NextResponse.json({ error: "Not a member of this server" }, { status: 403 });
    }
    if (channel.type !== "VOICE") {
      return NextResponse.json({ error: "Not a voice channel" }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      return NextResponse.json({ error: "LiveKit not configured" }, { status: 503 });
    }

    const identity = userId;
    const displayName =
      session?.user?.name ?? session?.user?.username ?? userId;

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: displayName,
      ttl: "4h",
    });

    at.addGrant({
      room: channelId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({ token, serverUrl });
  } catch (err) {
    console.error("[LIVEKIT_TOKEN]", err);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
