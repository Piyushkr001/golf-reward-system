import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { getUserSubscription } from "@/lib/subscriptions";
import { db } from "@/config/db";
import { subscriptions } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const currentSub = await getUserSubscription(user.id);
    if (!currentSub || currentSub.status !== "active") {
      return NextResponse.json({ success: false, message: "No active subscription to cancel" }, { status: 400 });
    }

    const now = new Date();

    await db
      .update(subscriptions)
      .set({
        status: "canceled",
        canceledAt: now,
        updatedAt: now,
      })
      .where(eq(subscriptions.id, currentSub.id));

    return NextResponse.json({ success: true, message: "Subscription canceled" });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
