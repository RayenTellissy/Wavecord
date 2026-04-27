import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { checkRateLimit, tooManyRequests } from "@/lib/rateLimit";

const CreateServerSchema = z.object({
  name: z.string().min(1).max(100),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const userId = await requireUserId();

    const memberships = await db.serverMember.findMany({
      where: { userId },
      include: {
        server: {
          include: {
            channels: { orderBy: { position: "asc" }, take: 1 },
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(memberships.map((m) => m.server));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();

    const rl = checkRateLimit(`server-create:${userId}`, 5, 60 * 60_000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfter);

    const body = await req.json();
    const parsed = CreateServerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const { name, imageUrl } = parsed.data;

    const newServer = await db.$transaction(async (tx) => {
      const srv = await tx.server.create({
        data: {
          name,
          imageUrl: imageUrl || null,
          inviteCode: nanoid(10),
          ownerId: userId,
          members: { create: { userId, role: MemberRole.ADMIN } },
        },
      });

      const category = await tx.category.create({
        data: { name: "TEXT CHANNELS", serverId: srv.id, position: 0 },
      });

      await tx.channel.create({
        data: {
          name: "general",
          type: "TEXT",
          serverId: srv.id,
          categoryId: category.id,
          position: 0,
        },
      });

      return srv;
    });

    const full = await db.server.findUniqueOrThrow({
      where: { id: newServer.id },
      include: { channels: true, members: true, categories: true },
    });

    return NextResponse.json(full, { status: 201 });
  } catch (err) {
    console.error("[SERVERS_POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
