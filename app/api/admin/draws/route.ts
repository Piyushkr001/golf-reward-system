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

    // For each draw, pull basic metadata including internal match count mappings
    const enhancedDraws = await Promise.all(
      allDraws.map(async (d) => {
        const pools = await db.select().from(prizePools).where(eq(prizePools.drawId, d.id)).limit(1);
        const entries = await db.select({ matchCount: drawEntries.matchCount }).from(drawEntries).where(eq(drawEntries.drawId, d.id));
        
        let fiveMatch = 0;
        let fourMatch = 0;
        let threeMatch = 0;

        for (const e of entries) {
           if (e.matchCount === 5) fiveMatch++;
           if (e.matchCount === 4) fourMatch++;
           if (e.matchCount === 3) threeMatch++;
        }

        return {
          ...d,
          prizePool: pools[0] || null,
          participantCount: entries.length || 0,
          winnerCounts: {
            five: fiveMatch,
            four: fourMatch,
            three: threeMatch
          }
        };
      })
    );

    return NextResponse.json({ draws: enhancedDraws });
  } catch (error: any) {
    console.error("GET /api/admin/draws error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
