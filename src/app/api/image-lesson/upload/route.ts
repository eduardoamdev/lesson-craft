import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { cleanupOldFiles } from "@/utils/cleanupOldFiles";
import { prepareTemporalFileName } from "@/utils/prepareTemporalFileName";
import { extractExtension } from "@/utils/extractExtension";
import { generateTemporalFilesMetadata } from "@/utils/generateTemporalFilesMetadata";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("file") as File;
    const description = (formData.get("description") as string) || "";
    const age = (formData.get("age") as string) || "";
    const level = (formData.get("level") as string) || "";

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "Missing file" },
        { status: 400 },
      );
    }

    const originalName = imageFile.name;

    const fileExtension = extractExtension(originalName);

    const { uuid, timestamp } = generateTemporalFilesMetadata();

    const imageFileName = prepareTemporalFileName(
      fileExtension,
      uuid,
      timestamp,
    );
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

    return NextResponse.json({
      success: true,
      id: baseFileName,
      message: "File uploaded and metadata saved",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 },
    );
  }
}
