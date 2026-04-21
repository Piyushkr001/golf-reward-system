import { db } from "@/config/db";
import { users, subscriptions, charities, draws, winners } from "@/config/schema";
import { count, sum, eq, and, desc } from "drizzle-orm";

export async function getAdminAnalyticsSummary() {
  // Aggregate distinct counts natively pushing processing bounds to Postgres efficiently
  
  const [totalUsers] = await db.select({ value: count() }).from(users);
  const [activeSubs] = await db.select({ value: count() }).from(subscriptions).where(eq(subscriptions.status, "active"));
  
  const [totalCharities] = await db.select({ value: count() }).from(charities);
  const [featuredCharities] = await db.select({ value: count() }).from(charities).where(eq(charities.featured, true));
  
  const [publishedDraws] = await db.select({ value: count() }).from(draws).where(eq(draws.status, "published"));
  
  const [totalWinners] = await db.select({ value: count() }).from(winners);
  const [pendingReviews] = await db.select({ value: count() }).from(winners).where(eq(winners.reviewStatus, "submitted"));
  const [pendingPayouts] = await db.select({ value: count() }).from(winners).where(eq(winners.payoutStatus, "approved_for_payment"));
  const [paidPayouts] = await db.select({ value: count() }).from(winners).where(eq(winners.payoutStatus, "paid"));
  
  // Calculate raw distributed prize arrays natively handling null
  const [prizeSums] = await db.select({ value: sum(winners.prizeAmount) }).from(winners);

  return {
    users: totalUsers.value,
    subscriptions: activeSubs.value,
    charities: {
        total: totalCharities.value,
        featured: featuredCharities.value,
    },
    draws: {
        published: publishedDraws.value,
    },
    winners: {
        total: totalWinners.value,
        pendingReviews: pendingReviews.value,
        pendingPayouts: pendingPayouts.value,
        paidPayouts: paidPayouts.value,
        distributedPool: prizeSums?.value ? parseInt(prizeSums.value, 10) : 0,
    }
  };
}

export async function getUserDashboardSummary(userId: string) {
  const [userSubs] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).orderBy(desc(subscriptions.createdAt)).limit(1);
  
  const [totalWinnings] = await db.select({ value: count() }).from(winners).where(eq(winners.userId, userId));
  const [pendingPayouts] = await db.select({ value: count() }).from(winners).where(and(eq(winners.userId, userId), eq(winners.payoutStatus, "approved_for_payment")));
  
  const [sumPrizes] = await db.select({ value: sum(winners.prizeAmount) }).from(winners).where(eq(winners.userId, userId));

  return {
    subscriptionStatus: userSubs?.status || "inactive",
    winnings: {
        total: totalWinnings.value,
        pendingPayouts: pendingPayouts.value,
        totalPrizeValue: sumPrizes?.value ? parseInt(sumPrizes.value, 10) : 0
    }
  };
}
