import { extractVideoId } from "@/utils/video/extractVideoId";
import { buildTranscript } from "@/utils/video/transcriptProcessor";
import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { buildVideoLessonPrompt } from "@/prompts/video-lesson";
import { callLLM } from "@/api-clients/common/ai/llm";

/**
 * Handles POST requests for generating a video lesson activity.
 * Receives form data from the client, logs the information,
 * and returns a successful response.
 *
 * @param {NextRequest} req - The incoming request containing form data.
 * @returns {Promise<NextResponse>} A JSON response with the status.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const youtubeUrl = formData.get("youtubeUrl") as string;
    const videoId = extractVideoId(youtubeUrl || "");
    const age = formData.get("age") as string;
    const level = formData.get("level") as string;

    console.log("Received video lesson generation request data:", {
      youtubeUrl,
      videoId,
      age,
      level: formData.get("level"),
    });

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "Invalid YouTube URL" },
        { status: 400 },
      );
    }

    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

    console.log("transcriptItems", transcriptItems);

    const builtTranscript = buildTranscript(transcriptItems);

    if (!builtTranscript) {
      return NextResponse.json(
        { success: false, error: "Failed to build transcript" },
        { status: 500 },
      );
    }

    const prompt = buildVideoLessonPrompt(builtTranscript, {
      age,
      level,
    });

    const llmData = await callLLM(prompt, { temperature: 1.0 });

    return NextResponse.json({
      success: true,
      activityData: {
        videoId,
        age,
        level,
        ...llmData,
      },
    });
  } catch (error) {
    console.error("Video lesson generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process video lesson request" },
      { status: 500 },
    );
  }
}
