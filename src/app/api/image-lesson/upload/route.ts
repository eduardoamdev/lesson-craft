import { NextRequest, NextResponse } from "next/server";
import { processImageLessonUpload } from "@/services/image-lesson/upload.service";

/**
 * Controller for uploading an image lesson.
 * Handles the HTTP layer and delegates business logic to the UploadService.
 */
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

    // Delegate business logic to the service
    const { id } = await processImageLessonUpload({
      imageFile,
      description,
      age,
      level,
    });

    return NextResponse.json({
      success: true,
      id,
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
