import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/config/db";
import { users, onboardingProfiles } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
    const [profile] = await db.select().from(onboardingProfiles).where(eq(onboardingProfiles.userId, session.userId)).limit(1);

    if (!user || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        email: user.email,
        fullName: profile.fullName || "",
        avatarUrl: profile.avatarUrl || "",
        charityId: profile.charityId || "",
        contributionPercentage: profile.contributionPercentage || 0,
        selectedPlan: profile.selectedPlan || "",
      }
    });
  } catch (error: any) {
    console.error("Fetch profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, avatarUrl } = body;

    if (typeof fullName !== "string") {
      return NextResponse.json({ error: "Invalid parameters formatting." }, { status: 400 });
    }

    const [updatedProfile] = await db
      .update(onboardingProfiles)
      .set({ 
        fullName, 
        avatarUrl: typeof avatarUrl === "string" ? avatarUrl : undefined 
      })
      .where(eq(onboardingProfiles.userId, session.userId))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Profile updated safely.",
      profile: updatedProfile
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
