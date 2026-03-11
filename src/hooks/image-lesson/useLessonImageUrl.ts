import { LessonData } from "@/types/lesson";

export function useLessonImageUrl(
  lessonData?: LessonData | null,
): string | undefined {
  if (!lessonData) return undefined;
  const imageFileName = lessonData.imageFileName;
  return imageFileName
    ? `/api/image-lesson/image-file?filename=${imageFileName}`
    : lessonData.imageUrl;
}
