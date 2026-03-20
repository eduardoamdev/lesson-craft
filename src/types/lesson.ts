/**
 * Represents the data structure returned by lesson generators.
 * Shared across all material generator types (image-lesson, text-lesson, etc.).
 */
export interface LessonData {
  imageUrl?: string;
  imageFileName?: string;
  multipleChoiceSentences?: Array<TestQuestion>;
  openQuestion?: string;
}

export interface TestQuestion {
  correctAnswer: number | string | null;
  question: string;
  options: Array<string>;
}
