/**
 * Prompt generation for conversation-based lessons.
 * This file keeps the logic for constructing prompts centralized in a prompts folder.
 */

import { PromptMetadata } from '../types/prompts';

/**
 * Builds the prompt template for the LLM to generate Conversation activities.
 *
 * @param {PromptMetadata} metadata - Basic information about the activity.
 * @returns {string} The formatted prompt string.
 */
export function buildConversationLessonPrompt(metadata: PromptMetadata): string {
  const levelText = metadata.level ? metadata.level : "B1-B2";
  const ageText = metadata.age ? `\nTarget student age: ${metadata.age}` : "";

  return `You are an English conversation generator for language learners (${levelText} level).

User's request: "${metadata.description}"${ageText}

Generate a natural conversation based on this description. The conversation should:
1. Have 6-10 exchanges (back and forth between two speakers)
2. Be appropriate for ${levelText} English level
3. Use natural, conversational language
4. Include realistic context and phrasing

Also generate 4 comprehension questions about the conversation, each with 4 possible answers (only one correct).

You MUST respond with ONLY valid JSON in this EXACT structure (no other text):

{
  "conversation": [
    { "speaker": "Person A", "gender": "male", "text": "Hello, how are you?" },
    { "speaker": "Person B", "gender": "female", "text": "I'm fine, thank you!" }
  ],
  "questions": [
    {
      "question": "What did Person A ask?",
      "options": ["How are you?", "Where are you?", "Who are you?", "What are you?"],
      "correctAnswer": 0
    }
  ]
}

Important rules:
- "speaker" should be descriptive role names (e.g., "Customer", "Waiter", "Teacher", "Student")
- "gender" must be either "male" or "female"
- Do NOT use voice field - we will assign voices automatically
- Generate exactly 4 questions
- "correctAnswer" is the index (0-3) of the correct option
- Do NOT add any explanation or text outside the JSON`;
}
