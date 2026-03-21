import { TestQuestion } from "@/types/lesson";

interface GeneratePdfParams {
  imageFileName?: string;
  conversation?: Array<{
    speaker: string;
    text: string;
  }>;
  testQuestions: Array<TestQuestion>;
  openQuestion: string;
}

export async function generatePdf({
  imageFileName,
  conversation,
  testQuestions,
  openQuestion,
}: GeneratePdfParams) {
  const response = await fetch("/api/file-generators/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageFileName,
      conversation,
      testQuestions,
      openQuestion,
    }),
  });

  return response;
}
