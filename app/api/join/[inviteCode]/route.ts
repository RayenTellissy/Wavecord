import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { checkRateLimit, tooManyRequests } from "@/lib/rateLimit";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  try {
    const userId = await requireUserId();

    const rl = checkRateLimit(`join:${userId}`, 10, 60 * 60_000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfter);

    const { inviteCode } = await params;

    const server = await db.server.findUnique({
      where: { inviteCode },
      include: { bans: { where: { userId } } },
    });

    if (!server) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
    }

    if (server.bans.length > 0) {
      return NextResponse.json({ error: "You are banned from this server" }, { status: 403 });
    }

    const existing = await db.serverMember.findFirst({
      where: { serverId: server.id, userId },
    });

    if (existing) {
      return NextResponse.json({ serverId: server.id, alreadyMember: true });
    }

    await db.serverMember.create({
      data: { userId, serverId: server.id, role: MemberRole.GUEST },
    });

    return NextResponse.json({ serverId: server.id }, { status: 201 });
  } catch (err) {
    console.error("[JOIN_POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  try {
    await requireUserId();
    const { inviteCode } = await params;

    const server = await db.server.findUnique({
      where: { inviteCode },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        inviteCode: true,
        _count: { select: { members: true } },
      },
    });

    if (!server) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
    }

    return NextResponse.json(server);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
