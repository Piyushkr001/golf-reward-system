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
    const adminAccessCode = String(body.adminAccessCode || "").trim();

    if (!adminAccessCode || adminAccessCode.length < 4) {
      return NextResponse.json({ success: false, message: "Valid access code is required" }, { status: 400 });
    }

    await db
      .update(onboardingProfiles)
      .set({
        adminAccessCode,
        currentStep: "admin_organization_setup",
        updatedAt: new Date(),
      })
      .where(eq(onboardingProfiles.userId, user.id));

    return NextResponse.json({ success: true, nextStep: "/onboarding/admin/organization-setup" });
  } catch (error) {
    console.error("Admin access validation error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}