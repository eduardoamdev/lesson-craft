import { extractVideoId } from "@/utils/video/extractVideoId";
import { NextRequest, NextResponse } from "next/server";

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

    console.log("Received video lesson generation request data:", {
      youtubeUrl,
      videoId,
      age: formData.get("age"),
      level: formData.get("level"),
    });

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "Invalid YouTube URL" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Video lesson generation data received and processed",
      videoId,
    });
  } catch (error) {
    console.error("Video lesson generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process video lesson request" },
      { status: 500 },
    );
  }
}
