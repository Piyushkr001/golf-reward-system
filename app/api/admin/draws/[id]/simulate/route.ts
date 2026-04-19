import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { db } from "@/config/db";
import { 
  draws, 
  prizePools, 
  drawEntries 
} from "@/config/schema";
import { eq } from "drizzle-orm";
import { 
  getEligibleUsersForDraw, 
  generateWinningNumbers, 
  calculatePrizePools, 
  getUserLatest5Scores, 
  calculateMatchCount 
} from "@/lib/draws";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await getCurrentDbUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [draw] = await db.select().from(draws).where(eq(draws.id, id)).limit(1);

    if (!draw) {
      return NextResponse.json({ error: "Draw not found" }, { status: 404 });
    }
    if (draw.status !== "draft") {
      return NextResponse.json({ error: "Only draft draws can be simulated" }, { status: 400 });
    }

    // 1. Fetch eligible users
    const eligibleUsers = await getEligibleUsersForDraw();

    // 2. Derive Winning Numbers
    const winningNumbers = await generateWinningNumbers(draw.logicType, eligibleUsers);

    // 3. Mathematical Prize Pool Mapping
    const poolConfig = calculatePrizePools(eligibleUsers.length);
    
    // Clear old prize pools matching this ID just in case it's a re-sim
    await db.delete(prizePools).where(eq(prizePools.drawId, id));
    
    // Build new pool
    await db.insert(prizePools).values({
      id: crypto.randomUUID(),
      drawId: id,
      totalPool: poolConfig.totalPool,
      fiveMatchPool: poolConfig.fiveMatchPool,
      fourMatchPool: poolConfig.fourMatchPool,
      threeMatchPool: poolConfig.threeMatchPool,
      rolloverIntoNext: 0,
    });

    // 4. Transform scores into entries
    await db.delete(drawEntries).where(eq(drawEntries.drawId, id));

    for (const userId of eligibleUsers) {
      const entryNumbers = await getUserLatest5Scores(userId);
      const matchCount = calculateMatchCount(entryNumbers, winningNumbers);
      const isWinner = matchCount >= 3;

      await db.insert(drawEntries).values({
        id: crypto.randomUUID(),
        drawId: id,
        userId,
        entryNumbers,
        matchCount,
        isWinner
      });
    }

    // 5. Commit draw payload
    await db.update(draws)
      .set({
        winningNumbers,
        status: "simulated",
        updatedAt: new Date()
      })
      .where(eq(draws.id, id));

    return NextResponse.json({ success: true, winningNumbers, entryCount: eligibleUsers.length }, { status: 200 });
  } catch (error: any) {
    console.error(`POST /api/admin/draws/${id}/simulate error:`, error);
    return NextResponse.json({ error: "Failed to simulate draw" }, { status: 500 });
  }
}
