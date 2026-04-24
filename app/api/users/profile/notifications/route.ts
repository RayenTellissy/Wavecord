import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const userId = await requireUserId();

  const [memberships, notifications] = await Promise.all([
    db.serverMember.findMany({
      where: { userId },
      include: {
        server: {
          include: {
            channels: {
              orderBy: { position: "asc" },
              select: { id: true, name: true, type: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    db.channelNotification.findMany({
      where: { userId },
      select: { channelId: true, muted: true },
    }),
  ]);

  const mutedChannelIds = new Set(
    notifications.filter((n) => n.muted).map((n) => n.channelId)
  );

  const servers = memberships.map((m) => ({
    id: m.server.id,
    name: m.server.name,
    image: m.server.imageUrl,
    channels: m.server.channels.map((ch) => ({
      id: ch.id,
      name: ch.name,
      type: ch.type,
      muted: mutedChannelIds.has(ch.id),
    })),
  }));

  return NextResponse.json(servers);
}
