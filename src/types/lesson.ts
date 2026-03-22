/**
 * Represents the data structure returned by lesson generators.
 * Shared across all material generator types (image-lesson, text-lesson, etc.).
 */
export interface ConversationTurn {
  speaker: string;
  text: string;
  gender: string;
}

export interface LessonData {
  imageUrl?: string;
  imageFileName?: string;
  conversation?: Array<ConversationTurn>;
  multipleChoiceSentences?: Array<TestQuestion>;
  openQuestion?: string;
}

export interface TestQuestion {
  correctAnswer: number | string | null;
  question: string;
  options: Array<string>;
}
