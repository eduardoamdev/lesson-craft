/**
 * Sends a POST request to the image lesson generation API endpoint with the provided form data.
 * Used to trigger the generation of image-based lesson content on the server.
 *
 * @param {FormData} formData - The form data containing lesson parameters and files.
 * @returns {Promise<Response>} The fetch API response from the server.
 */
export async function generateImageLesson(formData: FormData) {
  const response = await fetch("/api/image-lesson/generation", {
    method: "POST",
    body: formData,
  });

  return response;
}
