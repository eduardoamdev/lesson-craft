/**
 * Prompt generation for image-based lessons.
 * This file keeps the logic for constructing prompts centralized in a prompts folder.
 */

import { PromptMetadata } from '../types/prompts';

/**
 * Builds the prompt template for the LLM to generate Lesson activities.
 *
 * @param {PromptMetadata} metadata - Basic information about the activity.
 * @returns {string} The formatted prompt string.
 */
export function buildImageLessonPrompt(metadata: PromptMetadata): string {
  const levelInfo = metadata.level
    ? `Target level: ${metadata.level}`
    : "Between B1 and B2 level";

  const ageInfo = metadata.age ? `Target age: ${metadata.age}` : "";

  return `We are in the context of a particular English lesson. The activity is "Commenting on the image". ${levelInfo}. ${ageInfo}

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
}
