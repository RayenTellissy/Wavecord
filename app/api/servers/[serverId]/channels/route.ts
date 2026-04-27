import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole, ChannelType } from "@prisma/client";

const CreateChannelSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-_]+$/, "Lowercase letters, numbers, hyphens, underscores only"),
  type: z.enum(["TEXT", "VOICE"]).default("TEXT"),
  categoryId: z.string().uuid().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const userId = await requireUserId();
    const { serverId } = await params;

    const isMember = await db.serverMember.findFirst({
      where: { serverId, userId },
    });
    if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const channels = await db.channel.findMany({
      where: { serverId },
      orderBy: { position: "asc" },
    });

    return NextResponse.json(channels);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const userId = await requireUserId();
    const { serverId } = await params;
    const body = await req.json();
    const parsed = CreateChannelSchema.safeParse(body);

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

    const { name, type, categoryId } = parsed.data;

    const count = await db.channel.count({ where: { serverId } });

    const channel = await db.channel.create({
      data: {
        name,
        type: type as ChannelType,
        serverId,
        categoryId: categoryId ?? null,
        position: count,
      },
    });

    return NextResponse.json(channel, { status: 201 });
  } catch (err) {
    console.error("[CHANNEL_POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
