import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { getAdminAnalyticsSummary } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  try {
    const adminUser = await getCurrentDbUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const summary = await getAdminAnalyticsSummary();

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("GET /api/admin/reports/summary error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
