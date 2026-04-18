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

    if (user.role !== "user") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const fullName = String(body.fullName || "").trim();

    if (fullName.length < 2) {
      return NextResponse.json({ success: false, message: "Full name is required" }, { status: 400 });
    }

    await db
      .update(onboardingProfiles)
      .set({
        fullName,
        status: "in_progress",
        currentStep: "user_charity_selection",
        updatedAt: new Date(),
      })
      .where(eq(onboardingProfiles.userId, user.id));

    return NextResponse.json({ success: true, nextStep: "/onboarding/user/charity-selection" });
  } catch (error) {
    console.error("User onboarding profile error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}