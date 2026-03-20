/**
 * Defines the structure for formatted test questions used across different
 * material generators (image-lesson, conversation-lesson, etc.).
 */
export interface TestQuestion {
  correct_option: number | string | null;
  sentence: string;
  options: Array<string>;
}

export interface ConversationQuestion {
  question: string;
  options: Array<string>;
  correctAnswer: number;
}
