export async function uploadImageLessonData(formData: FormData) {
  const uploadResponse = await fetch("/api/image-lesson/upload", {
    method: "POST",
    body: formData,
  });

  return uploadResponse;
}
