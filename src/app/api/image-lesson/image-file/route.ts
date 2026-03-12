import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

/**
 * API route to serve images from the temporary storage directory.
 * This is necessary because files in 'tmp/' are not accessible via standard public URLs.
 *
 * @param {NextRequest} req - The incoming request with the filename in the query string.
 * @returns {Promise<NextResponse>} The image file or a 404 error.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }

    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), "tmp/image-lesson", safeFilename);

    const fileBuffer = await fs.readFile(filePath);

    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".webp") contentType = "image/webp";
    if (ext === ".gif") contentType = "image/gif";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
