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

    if (user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const organizationName = String(body.organizationName || "").trim();
    const organizationSlug = String(body.organizationSlug || "").trim();

    if (organizationName.length < 2) {
      return NextResponse.json({ success: false, message: "Organization name is required" }, { status: 400 });
    }

    if (organizationSlug.length < 2) {
      return NextResponse.json({ success: false, message: "Organization slug is required" }, { status: 400 });
    }

    await db
      .update(onboardingProfiles)
      .set({
        organizationName,
        organizationSlug,
        currentStep: "admin_complete",
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(onboardingProfiles.userId, user.id));

    return NextResponse.json({ success: true, nextStep: "/onboarding/admin/complete" });
  } catch (error) {
    console.error("Admin organization setup error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}