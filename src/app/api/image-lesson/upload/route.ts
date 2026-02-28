import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

async function cleanupOldFiles(dir: string) {
  try {
    const files = await fs.readdir(dir);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    for (const file of files) {
      if (file === ".gitignore") continue;
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      if (now - stats.mtimeMs > oneHour) {
        await fs.unlink(filePath);
      }
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const description = (formData.get("description") as string) || "";
    const age = (formData.get("age") as string) || "";
    const level = (formData.get("level") as string) || "";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Missing file" },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const timestamp = Date.now().toString();
    const buffer = Buffer.from(await file.arrayBuffer());

    const originalName = file.name;
    const extension = path.extname(originalName);
    const baseNameSanitized = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9]/g, "_");

    // Construct the filename: {id}-{original-title}-{timestamp}
    const baseFileName = `${id}-${baseNameSanitized}-${timestamp}`;
    const imageFileName = `${baseFileName}${extension}`;
    const jsonFileName = `${baseFileName}.json`;
    const uploadDir = path.join(process.cwd(), "tmp/image-lesson");

    await fs.mkdir(uploadDir, { recursive: true });
    await cleanupOldFiles(uploadDir);

    // Save Image
    const imagePath = path.join(uploadDir, imageFileName);
    await fs.writeFile(imagePath, buffer);

    // Save initial JSON metadata
    const metadata = {
      id: baseFileName, // Using the full base name as our handle
      uuid: id,
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
