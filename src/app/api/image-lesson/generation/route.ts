import { NextRequest, NextResponse } from "next/server";
import { processImageUpload } from "@/services/image-lesson/upload.service";
import { buildImageLessonPrompt } from "@/prompts/image-lesson";
import { callLLM } from "@/api-clients/common/ai/llm";

/**
 * Handles POST requests for generating an image lesson activity.
 * Processes multipart form data to extract the image file and metadata (description, age, level),
 * uploads the image, builds an AI prompt, calls the LLM for lesson content generation,
 * and returns the combined activity data as a JSON response.
 *
 * @param {NextRequest} req - The incoming request containing the image file and metadata.
 * @returns {Promise<NextResponse>} A JSON response with the generation status and activity data.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("file") as File;
    const description = (formData.get("description") as string) || "";
    const age = (formData.get("age") as string) || "";
    const level = (formData.get("level") as string) || "";

    let activityData = {
      description,
      age,
      level,
    };

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "Missing file" },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        { success: false, error: "Missing description" },
        { status: 400 },
      );
    }

    const imageFileName = await processImageUpload(imageFile);

    const prompt = buildImageLessonPrompt(activityData);

    const llmData = await callLLM(prompt, { temperature: 1.3 });

    activityData = {
      ...activityData,
      ...llmData,
      imageFileName,
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
