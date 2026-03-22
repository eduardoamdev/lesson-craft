import { NextRequest, NextResponse } from "next/server";
import { ConversationTurn } from "@/types/lesson";

/**
 * Handles POST requests for generating audio for conversation turns.
 * Receives an array of ConversationTurn objects.
 *
 * @param {NextRequest} req - The incoming request containing conversational turns.
 * @returns {Promise<NextResponse>} A JSON response with the success status.
 */
export async function POST(req: NextRequest) {
  try {
    const body: Array<ConversationTurn> = await req.json();

    console.log(body);

    // For now, we only return success true as requested.
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Audio generation error:", error);
    return NextResponse.json(
      { success: false, error: "Audio generation failed" },
      { status: 500 },
    );
  }
}
