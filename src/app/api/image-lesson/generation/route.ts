import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing activity ID" },
        { status: 400 },
      );
    }

    const uploadDir = path.join(process.cwd(), "tmp/image-lesson");

    const jsonPath = path.join(uploadDir, `${id}.json`);

    try {
      await fs.access(jsonPath);
    } catch {
      return NextResponse.json(
        { success: false, error: "Activity not found" },
        { status: 404 },
      );
    }

    const fileContent = await fs.readFile(jsonPath, "utf-8");

    const metadata = JSON.parse(fileContent);

    const levelInfo = metadata.level
      ? `Target level: ${metadata.level}`
      : "Between B1 and B2 level";

    const ageInfo = metadata.age ? `Target age: ${metadata.age}` : "";

    const promptTemplate = `We are in the context of a particular English lesson. The activity is "Commenting on the image". ${levelInfo}. ${ageInfo}

The description of the image is: "${metadata.description}"

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
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Deepseek API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    const deepseekData = JSON.parse(jsonString);

    const finalMetadata = {
      ...metadata,
      ...deepseekData,
      status: "completed",
      generatedAt: new Date().toISOString(),
    };

    await fs.writeFile(jsonPath, JSON.stringify(finalMetadata, null, 2));

    return NextResponse.json({
      success: true,
      ...finalMetadata,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 },
    );
  }
}
