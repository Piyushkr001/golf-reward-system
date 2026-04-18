import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/config/db";
import { onboardingProfiles, charities } from "@/config/schema";
import { getCurrentDbUser } from "@/lib/current-user";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const charityId = String(body.charityId || "").trim();

    if (!charityId) {
      return NextResponse.json({ success: false, message: "Please select a charity" }, { status: 400 });
    }

    const validCharity = await db.select().from(charities).where(and(eq(charities.id, charityId), eq(charities.isActive, true))).limit(1);

    if (!validCharity || validCharity.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid or inactive charity selected" }, { status: 400 });
    }

    await db
      .update(onboardingProfiles)
      .set({
        charityId,
        currentStep: "user_contribution_preference",
        updatedAt: new Date(),
      })
      .where(eq(onboardingProfiles.userId, user.id));

    return NextResponse.json({ success: true, nextStep: "/onboarding/user/contribution-preference" });
  } catch (error) {
    console.error("User charity selection error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}