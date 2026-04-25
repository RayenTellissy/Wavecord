import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { getIO, channelRoom, SocketEvents } from "@/lib/socket";

const EditMessageSchema = z.object({
  content: z.string().min(1).max(4000),
});

type RouteParams = { params: Promise<{ messageId: string }> };

// PATCH /api/messages/[messageId] — edit own message
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { messageId } = await params;
    const body = await req.json();
    const parsed = EditMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const message = await db.message.findUnique({
      where: { id: messageId },
      select: { authorId: true, channelId: true, deleted: true },
    });

    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (message.deleted) return NextResponse.json({ error: "Message deleted" }, { status: 400 });
    if (message.authorId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updated = await db.message.update({
      where: { id: messageId },
      data: { content: parsed.data.content },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        reactions: { include: { user: { select: { id: true, name: true } } } },
        replyTo: { include: { author: { select: { id: true, name: true, image: true } } } },
        attachments: true,
      },
    });

    getIO()
      ?.to(channelRoom(message.channelId))
      .emit(SocketEvents.CHANNEL_MESSAGE_UPDATE, updated);

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[MESSAGE_PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/messages/[messageId] — soft delete (own) or hard delete (mod+)
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { messageId } = await params;

    const message = await db.message.findUnique({
      where: { id: messageId },
      include: {
        channel: { select: { serverId: true } },
      },
    });

    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isAuthor = message.authorId === userId;

    // Check if moderator/admin
    const member = message.channel.serverId
      ? await db.serverMember.findFirst({
          where: {
            serverId: message.channel.serverId,
            userId,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        })
      : null;

    if (!isAuthor && !member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.message.delete({ where: { id: messageId } });

    getIO()
      ?.to(channelRoom(message.channelId))
      .emit(SocketEvents.CHANNEL_MESSAGE_DELETE, { id: messageId, channelId: message.channelId });

    return NextResponse.json({ id: messageId });
  } catch (err) {
    console.error("[MESSAGE_DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
