import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const userId = await requireUserId();
    const { serverId } = await params;

    const member = await db.serverMember.findFirst({
      where: { serverId, userId },
      include: { server: { select: { inviteCode: true } } },
    });

    if (!member) {
      return NextResponse.json({ error: "Not a member" }, { status: 403 });
    }

    return NextResponse.json({ inviteCode: member.server.inviteCode });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const userId = await requireUserId();
    const { serverId } = await params;

    const member = await db.serverMember.findFirst({
      where: {
        serverId,
        userId,
        role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const server = await db.server.update({
      where: { id: serverId },
      data: { inviteCode: nanoid(10) },
      select: { inviteCode: true },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.error("[INVITE_POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
