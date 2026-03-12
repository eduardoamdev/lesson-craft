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
 * Processes and saves an image lesson file and its associated metadata.
 * Manages directory creation, file cleanup, and storage of both image and JSON metadata.
 *
 * @param {UploadParams} params - The upload data including the image file, description, target age, and level.
 * @returns {Promise<{id: string}>} An object containing the generated base ID for the uploaded lesson.
 */
export async function processImageUpload(imageFile: File) {
  const originalName = imageFile.name;

  const fileExtension = extractExtension(originalName);

  const { uuid, timestamp } = generateTemporalFilesMetadata();

  const imageFileName = prepareTemporalFileName(fileExtension, uuid, timestamp);

  const uploadDir = path.join(process.cwd(), "tmp/image-lesson");

  await fs.mkdir(uploadDir, { recursive: true });

  await cleanupOldFiles(uploadDir);

  const buffer = Buffer.from(await imageFile.arrayBuffer());

  const imagePath = path.join(uploadDir, imageFileName);

  await fs.writeFile(imagePath, buffer);

  return imageFileName;
}
