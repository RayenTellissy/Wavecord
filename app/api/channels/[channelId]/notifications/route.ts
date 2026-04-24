import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const userId = await requireUserId();
  const { channelId } = await params;
  const { muted } = await req.json() as { muted: boolean };

  const notification = await db.channelNotification.upsert({
    where: { userId_channelId: { userId, channelId } },
    create: { userId, channelId, muted },
    update: { muted },
  });

  return NextResponse.json(notification);
}
