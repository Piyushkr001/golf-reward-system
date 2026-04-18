import { eq, desc } from "drizzle-orm";
import { db } from "@/config/db";
import { subscriptionPlans, subscriptions, billingEvents } from "@/config/schema";

export async function getActivePlans() {
  return await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.isActive, true))
    .orderBy(subscriptionPlans.price);
}

export async function getPlanBySlug(slug: string) {
  const result = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.slug, slug))
    .limit(1);
    
  return result[0] || null;
}

export async function getUserSubscription(userId: string) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  if (!result[0]) return null;

  // fetch the plan details as well
  const plan = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.id, result[0].planId))
    .limit(1);

  return {
    ...result[0],
    plan: plan[0] || null,
  };
}

export async function getUserBillingEvents(userId: string) {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return [];

  return await db
    .select()
    .from(billingEvents)
    .where(eq(billingEvents.subscriptionId, subscription.id))
    .orderBy(desc(billingEvents.createdAt));
}
