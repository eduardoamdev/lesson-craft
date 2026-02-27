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
    // Ignore if directory doesn't exist yet or other read errors during cleanup
    console.error("Cleanup error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const description = (formData.get("description") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Server-side generation of ID and timestamp
    const id = crypto.randomUUID();
    const timestamp = Date.now().toString();

    const buffer = Buffer.from(await file.arrayBuffer());

    // Construct the filename: {generated-id}-{original-title}-{timestamp}
    // and sanitize it
    const originalName = file.name;
    const extension = path.extname(originalName);
    const baseNameSanitized = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9]/g, "_");

    // We use the format requested: {id}-{original-title}-{timestamp}
    const baseFileName = `${id}-${baseNameSanitized}-${timestamp}`;
    const imageFileName = `${baseFileName}${extension}`;
    const jsonFileName = `${baseFileName}.json`;
    const uploadDir = path.join(process.cwd(), "tmp/image-lesson");

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Run cleanup for old files (older than 1 hour)
    await cleanupOldFiles(uploadDir);

    // Save Image
    const imagePath = path.join(uploadDir, imageFileName);
    await fs.writeFile(imagePath, buffer);

    // Save JSON metadata
    const metadata = {
      id,
      fileName: imageFileName,
      timestamp,
      description,
    };
    const jsonPath = path.join(uploadDir, jsonFileName);
    await fs.writeFile(jsonPath, JSON.stringify(metadata, null, 2));

    console.log(
      `Files saved to: ${uploadDir} (${imageFileName}, ${jsonFileName})`,
    );

    return NextResponse.json({
      success: true,
      message: "File and metadata uploaded successfully",
      fileName: imageFileName,
      jsonName: jsonFileName,
      path: imagePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
