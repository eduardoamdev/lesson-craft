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

    console.log("Received video lesson generation request data:", formData);

    // In the future, this is where processing logic (upload, AI, etc.) would go
    // For now, we just acknowledge receipt of the data.

    return NextResponse.json({
      success: true,
      message: "Video lesson generation data received and logged",
      receivedData: formData, // Optional: echoing back for confirmation
    });
  } catch (error) {
    console.error("Video lesson generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process video lesson request" },
      { status: 500 },
    );
  }
}
