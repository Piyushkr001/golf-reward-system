import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { db } from "@/config/db";
import { winners, winnerProofs, draws, drawEntries } from "@/config/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's wins
    const genericWinners = await db.select()
       .from(winners)
       .where(eq(winners.userId, user.id))
       .orderBy(desc(winners.createdAt));

    // Bind mappings cleanly connecting objects structurally
    const mappedPayloads = await Promise.all(
        genericWinners.map(async (winnerNode) => {
            const [draw] = await db.select().from(draws).where(eq(draws.id, winnerNode.drawId)).limit(1);
            const [entry] = await db.select().from(drawEntries).where(eq(drawEntries.id, winnerNode.drawEntryId)).limit(1);
            const [proof] = await db.select().from(winnerProofs).where(eq(winnerProofs.winnerId, winnerNode.id)).limit(1);
            
            return {
                ...winnerNode,
                draw: draw || null,
                entry: entry || null,
                proof: proof || null,
            }
        })
    );

    return NextResponse.json({ winnings: mappedPayloads });
  } catch (error: any) {
    console.error("GET /api/winnings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
