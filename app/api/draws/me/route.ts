import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { db } from "@/config/db";
import { drawEntries, draws } from "@/config/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return entries explicitly grouped or joined with 'draws' where status is "published"
    const entries = await db
      .select({
        entry: drawEntries,
        draw: draws
      })
      .from(drawEntries)
      .innerJoin(draws, eq(drawEntries.drawId, draws.id))
      .where(eq(drawEntries.userId, user.id))
      .orderBy(desc(draws.publishedAt), desc(draws.createdAt));

    // Only expose published results clearly
    const publishedEntries = entries.filter(e => e.draw.status === "published").map(e => ({
      ...e.entry,
      drawDate: `${e.draw.month}/${e.draw.year}`,
      winningNumbers: e.draw.winningNumbers
    }));

    return NextResponse.json({ entries: publishedEntries });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
