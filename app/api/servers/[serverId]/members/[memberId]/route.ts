import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { getIO, serverRoom, SocketEvents } from "@/lib/socket";

const RoleSchema = z.object({
  role: z.enum(["ADMIN", "MODERATOR", "GUEST"]),
});

type RouteParams = { params: Promise<{ serverId: string; memberId: string }> };

// PATCH /api/servers/[serverId]/members/[memberId] — change role
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { serverId, memberId } = await params;
    const body = await req.json();
    const parsed = RoleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid role" }, { status: 422 });
    }

    const actor = await db.serverMember.findFirst({
      where: { serverId, userId, role: MemberRole.ADMIN },
    });

    if (!actor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const target = await db.serverMember.findFirst({
      where: { id: memberId, serverId },
    });

    if (!target || target.userId === userId) {
      return NextResponse.json({ error: "Cannot modify own role" }, { status: 400 });
    }

    const updated = await db.serverMember.update({
      where: { id: memberId },
      data: { role: parsed.data.role as MemberRole },
      include: { user: { select: { id: true, name: true, username: true, image: true } } },
    });

    getIO()?.to(serverRoom(serverId)).emit(SocketEvents.MEMBER_UPDATE, updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[MEMBER_PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/servers/[serverId]/members/[memberId] — kick member
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { serverId, memberId } = await params;

    const actor = await db.serverMember.findFirst({
      where: {
        serverId,
        userId,
        role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
      },
    });

    if (!actor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const target = await db.serverMember.findFirst({
      where: { id: memberId, serverId },
    });

    if (!target || target.userId === userId) {
      return NextResponse.json({ error: "Cannot kick yourself" }, { status: 400 });
    }

    // Moderators cannot kick admins
    if (
      actor.role === MemberRole.MODERATOR &&
      target.role === MemberRole.ADMIN
    ) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    await db.serverMember.delete({ where: { id: memberId } });

    getIO()
      ?.to(serverRoom(serverId))
      .emit(SocketEvents.MEMBER_REMOVE, { memberId, userId: target.userId });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[MEMBER_DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
