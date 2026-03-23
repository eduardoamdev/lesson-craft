import { ConversationTurn } from "@/types/lesson";

/**
 * Triggers the audio generation for a conversation.
 * 
 * @param {ConversationTurn[]} conversation - The conversational turns to synthesize.
 * @returns {Promise<Response>} The fetch API response which should contain the audio file.
 */
export async function generateAudio(conversation: ConversationTurn[]) {
  const response = await fetch("/api/conversation-lesson/audio/generation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversation),
  });

  return response;
}
