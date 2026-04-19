import { db } from "@/config/db";
import { 
  draws, 
  drawEntries, 
  prizePools, 
  subscriptions,
  golfScores
} from "@/config/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getEligibleUsersForDraw() {
  const activeSubs = await db
    .select({ userId: subscriptions.userId })
    .from(subscriptions)
    .where(eq(subscriptions.status, "active"));

  const eligibleUserIds: string[] = [];

  for (const sub of activeSubs) {
    const scores = await db
      .select({ score: golfScores.score })
      .from(golfScores)
      .where(eq(golfScores.userId, sub.userId))
      .orderBy(desc(golfScores.scoreDate), desc(golfScores.createdAt))
      .limit(5);

    if (scores.length === 5) {
      eligibleUserIds.push(sub.userId);
    }
  }

  return eligibleUserIds;
}

export async function getUserLatest5Scores(userId: string): Promise<number[]> {
  const scores = await db
    .select({ score: golfScores.score })
    .from(golfScores)
    .where(eq(golfScores.userId, userId))
    .orderBy(desc(golfScores.scoreDate), desc(golfScores.createdAt))
    .limit(5);
    
  return scores.map(s => s.score);
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function generateWinningNumbers(logicType: "random" | "algorithmic", eligibleUsers: string[]): Promise<number[]> {
  const winningSet = new Set<number>();

  if (logicType === "algorithmic" && eligibleUsers.length > 0) {
    const frequencies: Record<number, number> = {};
    for (const userId of eligibleUsers) {
      const scores = await getUserLatest5Scores(userId);
      for (const s of scores) {
        frequencies[s] = (frequencies[s] || 0) + 1;
      }
    }
    
    // Sort scores by frequency descending
    const sortedScores = Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .map(entry => parseInt(entry[0]));

    for (const score of sortedScores) {
      if (winningSet.size < 5) winningSet.add(score);
    }
  }

  // Fill remainder randomly ensuring uniqueness
  while (winningSet.size < 5) {
    winningSet.add(getRandomNumber(1, 45));
  }

  return Array.from(winningSet);
}

export function calculateMatchCount(entryNumbers: number[], winningNumbers: number[]): number {
  const winningSet = new Set(winningNumbers);
  return entryNumbers.filter(n => winningSet.has(n)).length;
}

export function calculatePrizePools(eligibleCount: number) {
  // Assume each eligible subscriber contributes internal 10 units mathematically
  const totalPool = eligibleCount * 10;
  
  return {
    totalPool,
    fiveMatchPool: Math.floor(totalPool * 0.40),
    fourMatchPool: Math.floor(totalPool * 0.35),
    threeMatchPool: Math.floor(totalPool * 0.25),
  };
}
