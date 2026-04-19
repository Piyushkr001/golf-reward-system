import { db } from "@/config/db";
import { draws, drawEntries, prizePools, winners } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function createWinnerRecordsForDraw(drawId: string, tx?: any) {
  const dbConn = tx || db;

  // 1. Fetch draw and prize pool
  const [draw] = await dbConn.select().from(draws).where(eq(draws.id, drawId)).limit(1);
  if (!draw) throw new Error("Draw not found");

  const [pool] = await dbConn.select().from(prizePools).where(eq(prizePools.drawId, drawId)).limit(1);
  if (!pool) throw new Error("Prize pool missing for target draw");

  const entries = await dbConn.select().from(drawEntries).where(eq(drawEntries.drawId, drawId));

  // Bucket entries by match count
  const match5Entries = entries.filter((e: { matchCount: number; }) => e.matchCount === 5);
  const match4Entries = entries.filter((e: { matchCount: number; }) => e.matchCount === 4);
  const match3Entries = entries.filter((e: { matchCount: number; }) => e.matchCount === 3);

  // Calculate payout amount per tier
  const getPayoutAmount = (count: number, rawPool: number) => {
      if (count === 0) return 0;
      return Math.floor(rawPool / count);
  };

  const payout5Match = getPayoutAmount(match5Entries.length, pool.fiveMatchPool);
  const payout4Match = getPayoutAmount(match4Entries.length, pool.fourMatchPool);
  const payout3Match = getPayoutAmount(match3Entries.length, pool.threeMatchPool);

  // Delete existing winners for this draw to handle duplicate publishes
  await dbConn.delete(winners).where(eq(winners.drawId, drawId));

  const insertQueue: {
      id: string,
      drawId: string,
      drawEntryId: string,
      userId: string,
      tier: "5-match" | "4-match" | "3-match",
      prizeAmount: number,
      reviewStatus: "not_submitted",
      payoutStatus: "pending"
  }[] = [];

  for (const entry of match5Entries) {
      insertQueue.push({
          id: crypto.randomUUID(), drawId, drawEntryId: entry.id, userId: entry.userId,
          tier: "5-match", prizeAmount: payout5Match, reviewStatus: "not_submitted", payoutStatus: "pending"
      });
  }
  for (const entry of match4Entries) {
      insertQueue.push({
          id: crypto.randomUUID(), drawId, drawEntryId: entry.id, userId: entry.userId,
          tier: "4-match", prizeAmount: payout4Match, reviewStatus: "not_submitted", payoutStatus: "pending"
      });
  }
  for (const entry of match3Entries) {
      insertQueue.push({
          id: crypto.randomUUID(), drawId, drawEntryId: entry.id, userId: entry.userId,
          tier: "3-match", prizeAmount: payout3Match, reviewStatus: "not_submitted", payoutStatus: "pending"
      });
  }

  // Bulk insert winner records
  if (insertQueue.length > 0) {
      await dbConn.insert(winners).values(insertQueue);
  }

  return { success: true, count: insertQueue.length };
}
