import path from "path";
import fs from "fs/promises";
import { callLLM } from "@/services/ai/llm.service";
import { buildImageLessonPrompt } from "@/prompts/image-lesson";

interface GenerationParams {
  id: string;
}

/**
 * Generates lesson content using AI based on existing metadata.
 * Orchestrates the process: reads metadata, builds prompt, calls AI, and saves results.
 *
 * @param {GenerationParams} params - The object containing the activity ID.
 * @returns {Promise<any>} The final generated metadata object.
 * @throws {Error} If the activity is not found or the AI API call fails.
 */
export async function processImageLessonGeneration({ id }: GenerationParams) {
  const uploadDir = path.join(process.cwd(), "tmp/image-lesson");
  const jsonPath = path.join(uploadDir, `${id}.json`);

  // 1. Validate activity existence
  try {
    await fs.access(jsonPath);
  } catch {
    throw new Error("Activity not found");
  }

  // 2. Load metadata
  const fileContent = await fs.readFile(jsonPath, "utf-8");
  const metadata = JSON.parse(fileContent);

  // 3. Build prompt (Delegated to prompt service)
  const prompt = buildImageLessonPrompt(metadata);

  // 4. Call AI API (Delegated to LLM service)
  const llmData = await callLLM(prompt, { temperature: 1.3 });

  // 5. Update and save final metadata
  const finalMetadata = {
    ...metadata,
    ...llmData,
    status: "completed",
    generatedAt: new Date().toISOString(),
  };

  await fs.writeFile(jsonPath, JSON.stringify(finalMetadata, null, 2));

  return finalMetadata;
}
