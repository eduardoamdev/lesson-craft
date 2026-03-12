// services/api/imageLessonGeneration.ts

export async function generateImageLesson(activityId: string) {
  const response = await fetch("/api/image-lesson/generation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: activityId }),
  });
  return response;
}
