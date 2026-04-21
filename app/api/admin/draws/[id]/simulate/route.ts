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
  getUsersLatest5Scores, 
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
    if (draw.status !== "draft" && draw.status !== "simulated") {
      return NextResponse.json({ error: "Only draft or simulated draws can be evaluated" }, { status: 400 });
    }

    // 1. Fetch eligible users
    const eligibleUsers = await getEligibleUsersForDraw();

    // 2. Derive Winning Numbers
    const winningNumbers = await generateWinningNumbers(draw.logicType, eligibleUsers);
    
    // Clear old prize pools matching this draw ID to ensure idempotency
    await db.delete(prizePools).where(eq(prizePools.drawId, id));
    await db.delete(drawEntries).where(eq(drawEntries.drawId, id));

    const entriesToInsert = [];
    let fiveMatchCount = 0;

    // 3. Process each eligible user
    const userScores = await getUsersLatest5Scores(eligibleUsers);
    
    for (const userId of eligibleUsers) {
      const entryNumbers = userScores[userId] || [];
      const matchCount = calculateMatchCount(entryNumbers, winningNumbers);
      const isWinner = matchCount >= 3;
      
      if (matchCount === 5) {
          fiveMatchCount++;
      }

      entriesToInsert.push({
        id: crypto.randomUUID(),
        drawId: id,
        userId,
        entryNumbers,
        matchCount,
        isWinner
      });
    }

    // 4. Calculate Prize Pool Allocation
    const poolConfig = calculatePrizePools(eligibleUsers.length);
    let rolloverAmount = 0;

    if (fiveMatchCount === 0) {
        // Roll over 5-match allocation if no winners
        rolloverAmount = poolConfig.fiveMatchPool;
        poolConfig.fiveMatchPool = 0;
    }

    // Insert entries into database
    if (entriesToInsert.length > 0) {
        await db.insert(drawEntries).values(entriesToInsert);
    }
    
    await db.insert(prizePools).values({
      id: crypto.randomUUID(),
      drawId: id,
      totalPool: poolConfig.totalPool,
      fiveMatchPool: poolConfig.fiveMatchPool,
      fourMatchPool: poolConfig.fourMatchPool,
      threeMatchPool: poolConfig.threeMatchPool,
      rolloverIntoNext: rolloverAmount,
    });

    // 5. Commit draw state and rollover
    await db.update(draws)
      .set({
        winningNumbers,
        rolloverAmount,
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
