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

    const { status, reason } = await req.json();

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Explicit status parameter is required (approved/rejected)" }, { status: 400 });
    }

    const [winnerBlock] = await db.select().from(winners).where(eq(winners.id, id)).limit(1);

    if (!winnerBlock) {
      return NextResponse.json({ error: "Winner record not found." }, { status: 404 });
    }
    
    if (winnerBlock.reviewStatus !== "submitted" && winnerBlock.reviewStatus !== "rejected") {
      // Allow moving submitted -> approved, submitted -> rejected, rejected -> approved
      if (!(winnerBlock.reviewStatus === "approved" && status === "rejected")) {
          // You shouldn't normally revert an approved back, but keeping logic simple. Let's block not_submitted.
          if (winnerBlock.reviewStatus === "not_submitted") {
              return NextResponse.json({ error: "Review status cannot be updated without a prior submission." }, { status: 400 });
          }
      }
    }

    // Apply strict transition constraints
    let newPayoutStatus = winnerBlock.payoutStatus;
    if (status === "approved") {
        newPayoutStatus = "approved_for_payment";
    }

    // Execute Native Mutation tracking reason explicitly if rejected natively
    await db.update(winners)
       .set({ 
         reviewStatus: status, 
         payoutStatus: newPayoutStatus,
         rejectionReason: status === "rejected" ? (reason || "Invalid proof") : null,
         updatedAt: new Date() 
       })
       .where(eq(winners.id, id));

    return NextResponse.json({ success: true, newReviewStatus: status }, { status: 200 });
    } catch (error: any) {
    console.error(`POST /api/admin/winners/${id}/review error:`, error);
    return NextResponse.json({ error: "Failed to process review." }, { status: 500 });
  }
}
