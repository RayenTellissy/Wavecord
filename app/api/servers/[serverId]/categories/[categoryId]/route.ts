import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(100),
});

type RouteParams = { params: Promise<{ serverId: string; categoryId: string }> };

// PATCH /api/servers/[serverId]/categories/[categoryId]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { serverId, categoryId } = await params;
    const body = await req.json();
    const parsed = UpdateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const member = await db.serverMember.findFirst({
      where: { serverId, userId, role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] } },
    });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const category = await db.category.findFirst({ where: { id: categoryId, serverId } });
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await db.category.update({
      where: { id: categoryId },
      data: { name: parsed.data.name.toUpperCase() },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[CATEGORY_PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/servers/[serverId]/categories/[categoryId]
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { serverId, categoryId } = await params;

    const member = await db.serverMember.findFirst({
      where: { serverId, userId, role: MemberRole.ADMIN },
    });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const category = await db.category.findFirst({ where: { id: categoryId, serverId } });
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete all channels in the category (messages/reactions cascade via DB)
    await db.channel.deleteMany({ where: { categoryId, serverId } });
    await db.category.delete({ where: { id: categoryId } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CATEGORY_DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
