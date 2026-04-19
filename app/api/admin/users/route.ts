import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/config/db";
import { users, onboardingProfiles } from "@/config/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch users strictly ensuring we exclude administrators
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        fullName: onboardingProfiles.fullName,
        avatarUrl: onboardingProfiles.avatarUrl,
        charityId: onboardingProfiles.charityId,
        status: onboardingProfiles.status,
      })
      .from(users)
      .leftJoin(onboardingProfiles, eq(users.id, onboardingProfiles.userId))
      .where(eq(users.role, "user"))
      .orderBy(desc(users.createdAt));

    return NextResponse.json({
      success: true,
      users: allUsers,
    });
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
