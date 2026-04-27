import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";

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

    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const members = await db.serverMember.findMany({
      where: { serverId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            status: true,
          },
        },
      },
      orderBy: { role: "asc" },
    });

    return NextResponse.json(members);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
