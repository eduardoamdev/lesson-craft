import { NextResponse } from "next/server";
import { generatePdf } from "@/services/file-generators/pdf.service";

// Expects: { imageFileName: string, testQuestions: TestQuestion[], openQuestion: string }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageFileName, testQuestions, openQuestion } = body;

    const pdfBuffer = await generatePdf({
      imageFileName,
      testQuestions,
      openQuestion,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=lesson.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
