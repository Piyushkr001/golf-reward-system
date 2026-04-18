import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { getOrCreateOnboardingProfile } from "@/lib/onboarding";

export async function GET() {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const profile = await getOrCreateOnboardingProfile(user.id);

    return NextResponse.json({
      success: true,
      role: user.role,
      onboarding: profile,
    });
  } catch (error) {
    console.error("Onboarding status error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}