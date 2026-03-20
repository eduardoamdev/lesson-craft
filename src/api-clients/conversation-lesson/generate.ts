/**
 * Sends a POST request to the conversation lesson generation API endpoint.
 * Used to trigger the generation of conversation-based lesson content on the server.
 *
 * @param {object} payload - The parameters for the conversation (description, age, level).
 * @returns {Promise<Response>} The fetch API response from the server.
 */
export async function generateConversationLesson(payload: {
  description: string;
  age?: string;
  level?: string;
}) {
  const response = await fetch("/api/conversation-lesson/generation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response;
}
