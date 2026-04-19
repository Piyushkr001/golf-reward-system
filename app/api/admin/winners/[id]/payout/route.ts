import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { db } from "@/config/db";
import { winners } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const adminUser = await getCurrentDbUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [winnerBlock] = await db.select().from(winners).where(eq(winners.id, id)).limit(1);

    if (!winnerBlock) {
      return NextResponse.json({ error: "Winner mapping not found physically matching your bounds." }, { status: 404 });
    }

    // Check bounds! Admins cannot trigger paid statuses safely natively unless physically approved inside previous states
    if (winnerBlock.payoutStatus !== "approved_for_payment") {
       return NextResponse.json({ error: "Validation constraints explicitly block mappings on pending loops." }, { status: 400 });
    }

    // Execute Native Mutation mapping absolute state
    await db.update(winners)
       .set({ 
         payoutStatus: "paid",
         updatedAt: new Date() 
       })
       .where(eq(winners.id, id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`POST /api/admin/winners/${id}/payout error:`, error);
    return NextResponse.json({ error: "Failed to persist validation boundaries natively" }, { status: 500 });
  }
}
