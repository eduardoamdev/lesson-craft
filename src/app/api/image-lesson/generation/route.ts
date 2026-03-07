import { NextRequest, NextResponse } from "next/server";
import { processImageLessonGeneration } from "@/services/image-lesson/generation.service";

/**
 * Controller for generating lesson content using AI.
 * Coordinates with the GenerationService to process metadata and call the AI API.
 *
 * @param {NextRequest} req - The incoming request containing the activity ID.
 * @returns {Promise<NextResponse>} A JSON response with the final generated metadata or an error message.
 */
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing activity ID" },
        { status: 400 },
      );
    }

    const finalMetadata = await processImageLessonGeneration({ id });

    return NextResponse.json({
      success: true,
      ...finalMetadata,
    });
  } catch (error) {
    console.error("Generation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Generation failed";
    const status = errorMessage === "Activity not found" ? 404 : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status },
    );
  }
}
