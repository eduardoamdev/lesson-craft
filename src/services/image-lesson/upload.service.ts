import { cleanupOldFiles } from "@/utils/cleanupOldFiles";
import { prepareTemporalFileName } from "@/utils/prepareTemporalFileName";
import { extractExtension } from "@/utils/extractExtension";
import { generateTemporalFilesMetadata } from "@/utils/generateTemporalFilesMetadata";
import path from "path";
import fs from "fs/promises";

interface UploadParams {
  imageFile: File;
  description: string;
  age: string;
  level: string;
}

/**
 * Handles the logic for processing and saving an image lesson file and its metadata.
 */
export async function processImageLessonUpload({
  imageFile,
  description,
  age,
  level,
}: UploadParams) {
  const originalName = imageFile.name;
  const fileExtension = extractExtension(originalName);

  const { uuid, timestamp } = generateTemporalFilesMetadata();

  const imageFileName = prepareTemporalFileName(fileExtension, uuid, timestamp);

  const jsonFileName = prepareTemporalFileName(".json", uuid, timestamp);

  const baseFileName = path.basename(jsonFileName, ".json");

  const uploadDir = path.join(process.cwd(), "tmp/image-lesson");

  await fs.mkdir(uploadDir, { recursive: true });

  await cleanupOldFiles(uploadDir);

  const buffer = Buffer.from(await imageFile.arrayBuffer());

  const imagePath = path.join(uploadDir, imageFileName);

  await fs.writeFile(imagePath, buffer);

  const metadata = {
    id: baseFileName,
    uuid: uuid,
    imageFileName,
    originalName,
    timestamp,
    description,
    age,
    level,
    status: "pending",
  };

  const jsonPath = path.join(uploadDir, jsonFileName);

  await fs.writeFile(jsonPath, JSON.stringify(metadata, null, 2));

  return {
    id: baseFileName,
  };
}
