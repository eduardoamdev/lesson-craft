import { NextRequest, NextResponse } from "next/server";
import { buildConversationLessonPrompt } from "@/prompts/conversation-lesson";
import { callLLM } from "@/api-clients/common/ai/llm";

/**
 * Handles POST requests for generating a conversation lesson activity.
 * Parses the request parameters (description, age, level),
 * builds an AI prompt, calls the LLM, and returns the response.
 *
 * @param {NextRequest} req - The incoming request containing the metadata.
 * @returns {Promise<NextResponse>} A JSON response with the generation status and activity data.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, age, level } = body;

    let activityData = {
      description: description || "",
      age: age || "",
      level: level || "",
    };

    if (!description) {
      return NextResponse.json(
        { success: false, error: "Missing description" },
        { status: 400 },
      );
    }

    const prompt = buildConversationLessonPrompt(activityData);

    const llmData = await callLLM(prompt, { temperature: 1.0 });

    activityData = {
      ...activityData,
      ...llmData,
    };

    return NextResponse.json({
      success: true,
      activityData,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { success: false, error: "Generation failed" },
      { status: 500 },
    );
  }
}
