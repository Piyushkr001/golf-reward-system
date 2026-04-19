import { db } from "@/config/db";
import { golfScores } from "@/config/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getUserScores(userId: string) {
  return await db
    .select()
    .from(golfScores)
    .where(eq(golfScores.userId, userId))
    .orderBy(desc(golfScores.scoreDate), desc(golfScores.createdAt));
}

export async function enforceLatestFiveScores(userId: string) {
  // Fetch scores ordered by scoreDate descending (and createdAt as fallback)
  const allScores = await db
    .select({ id: golfScores.id })
    .from(golfScores)
    .where(eq(golfScores.userId, userId))
    .orderBy(desc(golfScores.scoreDate), desc(golfScores.createdAt));

  // If there are more than 5, delete the oldest ones
  if (allScores.length > 5) {
    const scoresToDelete = allScores.slice(5);
    for (const score of scoresToDelete) {
      await db.delete(golfScores).where(eq(golfScores.id, score.id));
    }
  }
}

export async function createUserScore(
  userId: string,
  score: number,
  scoreDate: string
) {
  if (score < 1 || score > 45) {
    throw new Error("Score must be between 1 and 45");
  }

  // Generate ID explicitly or rely on default? 
  // Wait, the schema uses text("id") without default. We should generate it.
  const newId = crypto.randomUUID();

  const [newScore] = await db
    .insert(golfScores)
    .values({
      id: newId,
      userId,
      score,
      scoreDate,
    })
    .returning();

  await enforceLatestFiveScores(userId);

  return newScore;
}

export async function updateUserScore(
  userId: string,
  scoreId: string,
  score: number,
  scoreDate: string
) {
  if (score < 1 || score > 45) {
    throw new Error("Score must be between 1 and 45");
  }

  const [updatedScore] = await db
    .update(golfScores)
    .set({
      score,
      scoreDate,
      updatedAt: new Date(),
    })
    .where(and(eq(golfScores.id, scoreId), eq(golfScores.userId, userId)))
    .returning();

  if (!updatedScore) {
    throw new Error("Score not found or you do not have permission to edit it");
  }

  await enforceLatestFiveScores(userId);

  return updatedScore;
}

export async function deleteUserScore(userId: string, scoreId: string) {
  const [deletedScore] = await db
    .delete(golfScores)
    .where(and(eq(golfScores.id, scoreId), eq(golfScores.userId, userId)))
    .returning();

  if (!deletedScore) {
    throw new Error("Score not found or unauthorized");
  }

  return true;
}
