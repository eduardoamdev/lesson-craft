import { NextResponse } from "next/server";

// Expects: { imageFileName: string, testQuestions: TestQuestion[], openQuestion: string }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageFileName, testQuestions, openQuestion } = body;

    // Respond with the received data (simulate reading from tmp/image-lesson/)
    return NextResponse.json({ imageFileName, testQuestions, openQuestion });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
