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
    const age = (formData.get("age") as string) || "";
    const level = (formData.get("level") as string) || "";

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
      age,
      level,
    };
    const jsonPath = path.join(uploadDir, jsonFileName);
    await fs.writeFile(jsonPath, JSON.stringify(metadata, null, 2));

    console.log(
      `Files saved to: ${uploadDir} (${imageFileName}, ${jsonFileName})`,
    );

    // Pre-built prompt template with placeholder for image description
    const levelInfo = level
      ? `Target level: ${level}`
      : "Between B1 and B2 level";
    const ageInfo = age ? `Target age: ${age}` : "";

    const promptTemplate = `We are in the context of a particular English lesson. The activity is "Commenting on the image". ${levelInfo}. ${ageInfo}

The description of the image is: "${description}"

I want you to provide the texts for the activity:
1. Sentences with blanks where words can be filled in, with multiple choice options below each sentence. IMPORTANT: Randomize the position of the correct answer in each multiple choice question - do NOT always place it first.
2. One open question about describing the image with student's own words.

You MUST respond with ONLY valid JSON following this exact structure (no additional properties):
{
  "multiple_choice_sentences": [
    {
      "sentence": "The sentence with a __________ blank.",
      "options": ["option1", "option2", "option3", "option4"],
      "correct_option": 0
    }
  ],
  "open_question": "Your open-ended question here."
}

Important: 
- Use "multiple_choice_sentences" (not multiple_choice_blanks or any other name)
- Use "open_question" as a string (not an object)
- "correct_option" must be a number (0 for first option, 1 for second, etc.)
- Do not add any extra properties or wrap this in any other object`;

    const apiUrl = "https://api.deepseek.com/v1/chat/completions";
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const abortController = new AbortController();

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: promptTemplate,
          },
        ],
        temperature: 1.3,
      }),
      signal: abortController.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Deepseek API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content;

    // More robust JSON extraction
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    const deepseekData = JSON.parse(jsonString);

    // Save updated JSON metadata
    const finalMetadata = {
      ...metadata,
      ...deepseekData,
    };

    await fs.writeFile(jsonPath, JSON.stringify(finalMetadata, null, 2));

    console.log(
      `Files saved to: ${uploadDir} (${imageFileName}, ${jsonFileName})`,
    );

    return NextResponse.json({
      success: true,
      ...finalMetadata,
    });
  } catch (error) {
    console.error("Upload/Generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Process failed",
      },
      { status: 500 },
    );
  }
}
