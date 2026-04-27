import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const actorId = await requireUserId();
    const { serverId } = await params;

    const actor = await db.serverMember.findFirst({
      where: {
        serverId,
        userId: actorId,
        role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
      },
    });
    if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const bans = await db.ban.findMany({
      where: { serverId },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
        issuer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bans);
  } catch (err) {
    console.error("[BAN_GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const BanSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const actorId = await requireUserId();
    const { serverId } = await params;
    const body = await req.json();
    const parsed = BanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { userId, reason } = parsed.data;

    if (userId === actorId) {
      return NextResponse.json({ error: "Cannot ban yourself" }, { status: 400 });
    }

    const actor = await db.serverMember.findFirst({
      where: {
        serverId,
        userId: actorId,
        role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
      },
    });
    if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const target = await db.serverMember.findFirst({
      where: { serverId, userId },
    });
    if (!target) return NextResponse.json({ error: "User not in server" }, { status: 404 });

    if (actor.role === MemberRole.MODERATOR && target.role === MemberRole.ADMIN) {
      return NextResponse.json({ error: "Cannot ban an admin" }, { status: 403 });
    }

    await db.$transaction([
      db.ban.upsert({
        where: { userId_serverId: { userId, serverId } },
        create: { userId, serverId, issuerId: actorId, reason: reason ?? null },
        update: { reason: reason ?? null, issuerId: actorId },
      }),
      db.serverMember.delete({ where: { id: target.id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[BAN_POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const actorId = await requireUserId();
    const { serverId } = await params;
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const actor = await db.serverMember.findFirst({
      where: { serverId, userId: actorId, role: MemberRole.ADMIN },
    });
    if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await db.ban.delete({ where: { userId_serverId: { userId, serverId } } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[BAN_DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
