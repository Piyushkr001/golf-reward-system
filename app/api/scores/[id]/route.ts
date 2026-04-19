import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { updateUserScore, deleteUserScore } from "@/lib/scores";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { score, scoreDate } = body;

    // Validation
    if (typeof score !== "number" || score < 1 || score > 45) {
      return NextResponse.json({ error: "Score must be an integer between 1 and 45" }, { status: 400 });
    }

    if (!scoreDate || typeof scoreDate !== "string") {
      return NextResponse.json({ error: "Valid scoreDate is required (YYYY-MM-DD)" }, { status: 400 });
    }

    const updatedScore = await updateUserScore(user.id, id, score, scoreDate);
    return NextResponse.json({ score: updatedScore }, { status: 200 });
  } catch (error: any) {
    console.error(`PATCH /api/scores/${id} error:`, error);
    
    // Catch duplication violation when updating to a conflicting date
    if (error.code === "23505") {
        return NextResponse.json({ error: "Another score for this date already exists." }, { status: 400 });
    }

    return NextResponse.json({ error: error.message || "Failed to update score" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteUserScore(user.id, id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`DELETE /api/scores/${id} error:`, error);
    return NextResponse.json({ error: error.message || "Failed to delete score" }, { status: 500 });
  }
}
