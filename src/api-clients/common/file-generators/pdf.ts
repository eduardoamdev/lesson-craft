import { TestQuestion } from "@/types/testQuestions";

interface GeneratePdfParams {
  imageFileName: string | undefined;
  testQuestions: Array<TestQuestion>;
  openQuestion: string;
}

export async function generatePdf({
  imageFileName,
  testQuestions,
  openQuestion,
}: GeneratePdfParams) {
  const response = await fetch("/api/file-generators/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageFileName,
      testQuestions,
      openQuestion,
    }),
  });

  return response;
}
