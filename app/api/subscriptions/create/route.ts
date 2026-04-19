import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { getPlanBySlug, getUserSubscription } from "@/lib/subscriptions";
import { db } from "@/config/db";
import { subscriptions, billingEvents } from "@/config/schema";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Create Sub Payload:", body);
    const planSlug = String(body.planSlug || "").trim();

    const plan = await getPlanBySlug(planSlug);
    if (!plan) {
      console.log("Invalid plan slug:", planSlug);
      return NextResponse.json({ success: false, message: "Invalid plan selected" }, { status: 400 });
    }

    const currentSub = await getUserSubscription(user.id);
    if (currentSub && currentSub.status === "active") {
      // Return 200 so fetch() doesn't throw a browser console 400 error when handling duplicate requests gracefully
      return NextResponse.json({ success: false, message: "User already has an active subscription" }, { status: 200 });
    }

    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();
    
    // next renewal date based on interval
    const renewalDate = new Date();
    if (plan.interval === "monthly") {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    await db.transaction(async (tx) => {
        // Insert mock subscription
        await tx.insert(subscriptions).values({
          id: subscriptionId,
          userId: user.id,
          planId: plan.id,
          status: "active",
          provider: "internal",
          providerSubscriptionId: `internal_sub_${Date.now()}`,
          startedAt: now,
          renewalDate,
          createdAt: now,
          updatedAt: now,
        });

        const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Insert billing event
        await tx.insert(billingEvents).values({
          id: eventId,
          subscriptionId,
          eventType: "charge",
          amount: plan.price,
          currency: plan.currency,
          providerEventId: `internal_ch_${Date.now()}`,
          createdAt: now,
        });
    });

    return NextResponse.json({ success: true, message: "Subscription created" });
  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
