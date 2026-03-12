export async function generateImageLesson(formData: FormData) {
  const response = await fetch("/api/image-lesson/generation", {
    method: "POST",
    body: formData,
  });

  return response;
}
