import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/users/[userId]?serverId=xxx
// Returns public profile + optional server membership info
export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const callerId = await requireUserId();
    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, username: true, image: true, bio: true, status: true },
    });

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let member = null;
    if (serverId) {
      const callerInServer = await db.serverMember.findFirst({
        where: { serverId, userId: callerId },
      });
      if (callerInServer) {
        member = await db.serverMember.findFirst({
          where: { serverId, userId },
          select: { role: true, createdAt: true },
        });
      }
    }

    return NextResponse.json({ ...user, member });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
