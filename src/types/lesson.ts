import { TestQuestion } from "@/components/ui/TestQuestions";

/**
 * Represents the data structure returned by lesson generators.
 * Shared across all material generator types (image-lesson, text-lesson, etc.).
 */
export interface LessonData {
  imageUrl?: string;
  imageFileName?: string;
  topic?: string;
  grade?: string;
  language?: string;
  multiple_choice_sentences?: Array<TestQuestion>;
  open_question?: string;
}
