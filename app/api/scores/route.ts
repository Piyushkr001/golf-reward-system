import { NextRequest, NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";
import { getUserScores, createUserScore } from "@/lib/scores";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scores = await getUserScores(user.id);
    return NextResponse.json({ scores });
  } catch (error: any) {
    console.error("GET /api/scores error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const newScore = await createUserScore(user.id, score, scoreDate);
    return NextResponse.json({ score: newScore }, { status: 201 });
  } catch (error: any) {
    // Postgres unique constraint violation is classically 23505, but Neon wraps it in cause
    if (error.code === "23505" || error.cause?.code === "23505" || error.message?.includes("duplicate key")) {
      return NextResponse.json({ error: "A score for this date already exists." }, { status: 400 });
    }

    // Only log actual unexpected failures
    console.error("POST /api/scores error:", error);
    return NextResponse.json({ error: error.message || "Failed to create score" }, { status: 500 });
  }
}
