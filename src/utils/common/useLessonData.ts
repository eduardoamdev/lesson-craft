import { LessonData } from "@/types/lesson";

export function useLessonData(dataParam?: string): LessonData | null {
  if (!dataParam) return null;
  try {
    return JSON.parse(decodeURIComponent(dataParam));
  } catch (error) {
    if (error) console.error("Failed to parse lesson data from URL:", error);
    return null;
  }
}
