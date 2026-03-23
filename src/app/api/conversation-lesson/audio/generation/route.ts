import { NextRequest, NextResponse } from "next/server";
import { ConversationTurn } from "@/types/lesson";
import { synthesizeConversation } from "@/services/conversation-lesson/audio/synthesizeConversation";

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

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { success: false, error: "No conversation turns provided" },
        { status: 400 },
      );
    }

    console.log("Starting conversation synthesis for turns:", body.length);

    const fullAudioBuffer = await synthesizeConversation(body);

    console.log("Total synthesized audio length:", fullAudioBuffer.length);

    return NextResponse.json({
      success: true,
      audioLength: fullAudioBuffer.length,
    });
  } catch (error) {
    console.error("Audio generation error:", error);
    return NextResponse.json(
      { success: false, error: "Audio generation failed" },
      { status: 500 },
    );
  }
}
