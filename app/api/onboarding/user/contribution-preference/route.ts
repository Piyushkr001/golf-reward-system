import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { onboardingProfiles } from "@/config/schema";
import { getCurrentDbUser } from "@/lib/current-user";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const contributionPercentage = Number(body.contributionPercentage);

    if (Number.isNaN(contributionPercentage) || contributionPercentage < 10 || contributionPercentage > 100) {
      return NextResponse.json(
        { success: false, message: "Contribution percentage must be between 10 and 100" },
        { status: 400 }
      );
    }

    await db
      .update(onboardingProfiles)
      .set({
        contributionPercentage,
        currentStep: "user_subscription_plan",
        updatedAt: new Date(),
      })
      .where(eq(onboardingProfiles.userId, user.id));

    return NextResponse.json({ success: true, nextStep: "/onboarding/user/subscription-plan" });
  } catch (error) {
    console.error("Contribution preference error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}