import { NextResponse } from "next/server";
import { generatePdf } from "@/services/file-generators/pdf.service";

/**
 * Handles POST requests to generate a PDF lesson file.
 * Receives lesson data (image file name, test questions, open question) in the request body,
 * calls the PDF generation service, and returns the PDF as a downloadable response.
 *
 * @param {Request} request - The incoming HTTP request containing lesson data.
 * @returns {Promise<NextResponse>} The response with the generated PDF or an error message.
 */
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
