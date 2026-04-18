import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { onboardingProfiles } from "@/config/schema";
import { getCurrentDbUser } from "@/lib/current-user";
import { getPlanBySlug } from "@/lib/subscriptions";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const selectedPlan = String(body.selectedPlan || "").trim();

    const plan = await getPlanBySlug(selectedPlan);
    if (!plan) {
      return NextResponse.json({ success: false, message: "Please select a valid plan" }, { status: 400 });
    }

    await db
      .update(onboardingProfiles)
      .set({
        selectedPlan,
        currentStep: "user_complete",
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(onboardingProfiles.userId, user.id));

    return NextResponse.json({ success: true, nextStep: "/onboarding/user/complete" });
  } catch (error) {
    console.error("User subscription plan error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}