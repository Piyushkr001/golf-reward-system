import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { db } from "@/config/db";
import { draws, prizePools, drawEntries } from "@/config/schema";
import { desc, count, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allDraws = await db
      .select()
      .from(draws)
      .orderBy(desc(draws.createdAt));

    // For each draw, pull basic metadata
    const enhancedDraws = await Promise.all(
      allDraws.map(async (d) => {
        const pools = await db.select().from(prizePools).where(eq(prizePools.drawId, d.id)).limit(1);
        const [entryCount] = await db.select({ total: count() }).from(drawEntries).where(eq(drawEntries.drawId, d.id));
        return {
          ...d,
          prizePool: pools[0] || null,
          participantCount: entryCount.total || 0,
        };
      })
    );

    return NextResponse.json({ draws: enhancedDraws });
  } catch (error: any) {
    console.error("GET /api/admin/draws error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
