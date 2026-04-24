import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit, tooManyRequests } from "@/lib/rateLimit";

// GET /api/users/search?q=alice
export async function GET(req: Request) {
  try {
    const userId = await requireUserId();

    // 20 searches per user per minute
    const rl = checkRateLimit(`search:${userId}`, 20, 60_000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfter);

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 1) {
      return NextResponse.json([]);
    }

    const users = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { username: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, username: true, image: true },
      take: 10,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
