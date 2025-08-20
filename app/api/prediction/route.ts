import { NextRequest, NextResponse } from "next/server";
import { predictServiceCompletionTime } from "@/lib/prediction-service";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.date || !body.time || !body.task_id) {
      return NextResponse.json(
        { error: "Missing required fields: date, time, or task_id" },
        { status: 400 }
      );
    }

    // Call prediction service
    const predictedTime = await predictServiceCompletionTime(
      body.date,
      body.time,
      body.task_id
    );

    if (predictedTime === null) {
      return NextResponse.json(
        { error: "Failed to predict completion time" },
        { status: 500 }
      );
    }

    // Return prediction
    return NextResponse.json({
      expected_completion_time_minutes: predictedTime,
    });
  } catch (error) {
    console.error("Error in prediction API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// For health check
export async function GET() {
  return NextResponse.json({ status: "healthy" });
}
