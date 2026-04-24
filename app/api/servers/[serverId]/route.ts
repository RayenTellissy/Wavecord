import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

const UpdateServerSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

// GET /api/servers/[serverId]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const userId = await requireUserId();
    const { serverId } = await params;

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: { some: { userId } },
      },
      include: {
        categories: {
          orderBy: { position: "asc" },
          include: {
            channels: { orderBy: { position: "asc" } },
          },
        },
        members: {
          include: { user: { select: { id: true, name: true, username: true, image: true, status: true } } },
          orderBy: { role: "asc" },
        },
        bans: { select: { userId: true } },
      },
    });

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    return NextResponse.json(server);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// PATCH /api/servers/[serverId]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const userId = await requireUserId();
    const { serverId } = await params;
    const body = await req.json();
    const parsed = UpdateServerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const member = await db.serverMember.findFirst({
      where: { serverId, userId, role: { in: [MemberRole.ADMIN] } },
    });

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, imageUrl } = parsed.data;
    const server = await db.server.update({
      where: { id: serverId },
      data: {
        ...(name && { name }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.error("[SERVER_PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/servers/[serverId]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const userId = await requireUserId();
    const { serverId } = await params;

    const server = await db.server.findFirst({
      where: { id: serverId, ownerId: userId },
    });

    if (!server) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.server.delete({ where: { id: serverId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[SERVER_DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
