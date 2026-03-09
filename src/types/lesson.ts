/**
 * Represents the data structure returned by lesson generators.
 * Shared across all material generator types (image-lesson, text-lesson, etc.).
 */
export interface LessonData {
  imageUrl?: string;
  image_url?: string;
  imageFileName?: string;
  topic?: string;
  grade?: string;
  language?: string;
  questions?: Array<{
    id: number;
    question: string;
    options: Array<{ id: string; text: string; isCorrect?: boolean }>;
  }>;
}
