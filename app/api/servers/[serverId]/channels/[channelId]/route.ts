import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

const UpdateChannelSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-_]+$/)
    .optional(),
  categoryId: z.string().uuid().nullable().optional(),
  allowedRole: z.enum(["ADMIN", "MODERATOR", "GUEST"]).optional(),
});

type RouteParams = { params: Promise<{ serverId: string; channelId: string }> };

// PATCH /api/servers/[serverId]/channels/[channelId]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { serverId, channelId } = await params;
    const body = await req.json();
    const parsed = UpdateChannelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const member = await db.serverMember.findFirst({
      where: {
        serverId,
        userId,
        role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
      },
    });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const channel = await db.channel.findFirst({
      where: { id: channelId, serverId },
    });
    if (!channel) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await db.channel.update({
      where: { id: channelId },
      data: parsed.data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[CHANNEL_PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/servers/[serverId]/channels/[channelId]
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { serverId, channelId } = await params;

    const member = await db.serverMember.findFirst({
      where: { serverId, userId, role: MemberRole.ADMIN },
    });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await db.channel.delete({ where: { id: channelId, serverId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CHANNEL_DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
