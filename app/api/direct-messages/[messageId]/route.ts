import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIO, userRoom, SocketEvents } from "@/lib/socket";

const EditDMSchema = z.object({
  content: z.string().min(1).max(4000),
});

type RouteParams = { params: Promise<{ messageId: string }> };

// PATCH /api/direct-messages/[messageId] — edit own DM
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { messageId } = await params;
    const body = await req.json();
    const parsed = EditDMSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const message = await db.directMessage.findUnique({
      where: { id: messageId },
      select: {
        senderId: true,
        conversationId: true,
        deleted: true,
        conversation: { select: { memberOneId: true, memberTwoId: true } },
      },
    });

    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (message.deleted) return NextResponse.json({ error: "Message deleted" }, { status: 400 });
    if (message.senderId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updated = await db.directMessage.update({
      where: { id: messageId },
      data: { content: parsed.data.content },
      include: {
        sender: { select: { id: true, name: true, username: true, image: true } },
        attachments: true,
      },
    });

    getIO()
      ?.to(userRoom(message.conversation.memberOneId))
      .to(userRoom(message.conversation.memberTwoId))
      .emit(SocketEvents.DM_MESSAGE_UPDATE, updated);

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[DM_PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/direct-messages/[messageId] — soft-delete (own only)
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { messageId } = await params;

    const message = await db.directMessage.findUnique({
      where: { id: messageId },
      select: {
        senderId: true,
        conversationId: true,
        conversation: { select: { memberOneId: true, memberTwoId: true } },
      },
    });

    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (message.senderId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const deleted = await db.directMessage.update({
      where: { id: messageId },
      data: { deleted: true, content: "This message was deleted." },
      include: {
        sender: { select: { id: true, name: true, username: true, image: true } },
        attachments: true,
      },
    });

    getIO()
      ?.to(userRoom(message.conversation.memberOneId))
      .to(userRoom(message.conversation.memberTwoId))
      .emit(SocketEvents.DM_MESSAGE_DELETE, deleted);

    return NextResponse.json(deleted);
  } catch (err) {
    console.error("[DM_DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
