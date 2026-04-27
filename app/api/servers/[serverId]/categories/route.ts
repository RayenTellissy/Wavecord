import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
});

type RouteParams = { params: Promise<{ serverId: string }> };

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const userId = await requireUserId();
    const { serverId } = await params;
    const body = await req.json();
    const parsed = CreateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const member = await db.serverMember.findFirst({
      where: { serverId, userId, role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] } },
    });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const count = await db.category.count({ where: { serverId } });

    const category = await db.category.create({
      data: { name: parsed.data.name.toUpperCase(), position: count, serverId },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("[CATEGORY_POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
