import { ConversationTurn } from "@/types/lesson";
import { synthesizeSpeech } from "./synthesizeSpeech";

/**
 * Synthesizes speech for an entire conversation by concatenating audio buffers.
 * Iterates through each turn, generates its audio, and joins them in order.
 *
 * @param {ConversationTurn[]} turns - The array of conversation turns to synthesize.
 * @returns {Promise<Buffer>} A single audio buffer containing the entire conversation.
 */
export async function synthesizeConversation(
  turns: ConversationTurn[],
): Promise<Buffer> {
  let combinedBuffer = Buffer.alloc(0);

  for (const turn of turns) {
    const voiceGenre =
      turn.gender.toLowerCase() === "female" ? "female" : "male";

    console.log(`Synthesizing turn: [${turn.speaker}] ${turn.text}`);

    try {
      const audioBuffer = await synthesizeSpeech(turn.text, voiceGenre);
      combinedBuffer = Buffer.concat([combinedBuffer, audioBuffer]);
    } catch (error) {
      console.error(
        `Error synthesizing turn for ${turn.speaker}:`,
        (error as Error).message,
      );

      throw error;
    }
  }

  return combinedBuffer;
}
