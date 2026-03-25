/**
 * Sends a POST request to the video lesson generation API endpoint with the provided form data.
 * Used to trigger the generation of video-based lesson content on the server.
 *
 * @param {FormData} formData - The form data containing lesson parameters (e.g., youtubeUrl).
 * @returns {Promise<Response>} The fetch API response from the server.
 */
export async function generateVideoLesson(formData: FormData) {
  const response = await fetch("/api/video-lesson/generation", {
    method: "POST",
    body: formData,
  });

  return response;
}
