/**
 * Prompt generation for video-based lessons.
 * This file keeps the logic for constructing prompts centralized in a prompts folder.
 */

import { PromptMetadata } from "../types/prompts";

/**
 * Builds the prompt template for the LLM to generate Video Lesson activities.
 *
 * @param {string} transcriptText - The transcript text from the YouTube video.
 * @param {PromptMetadata} metadata - Basic information about the activity (age, level).
 * @returns {string} The formatted prompt string.
 */
export function buildVideoLessonPrompt(
  transcriptText: string,
  metadata: PromptMetadata,
): string {
  const levelText = metadata.level ? metadata.level : "B1-B2";
  const ageText = metadata.age ? `\nTarget student age: ${metadata.age}` : "";

  return `We are creating an English lesson activity for ${levelText} learners.${ageText}

The following text is a transcript of a YouTube video:
"""
${transcriptText}
"""

Based on this transcript, generate an activity with:
1. 5 multiple-choice fill-in-the-blank sentences based on the transcript content.
2. 1 open question that asks for reflection or summary of the video.

You MUST respond with ONLY valid JSON in this exact structure:
{
  "multipleChoiceSentences": [
    {
      "question": "The sentence with a __________ blank.",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0
    }
  ],
  "openQuestion": "Your open-ended question here."
}

Important:
- Generate exactly 5 items in multipleChoiceSentences.
- Randomize the correct option position.
- correctAnswer must be a number from 0 to 3.
- Return only JSON with no markdown or extra text.`;
}
