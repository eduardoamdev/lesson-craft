/**
 * Utility function for processing video transcripts.
 */

interface TranscriptItem {
  text: string;
}

/**
 * Builds a single string from transcript items by joining their text components.
 * 
 * @param {TranscriptItem[]} transcriptItems - The array of transcript items from youtube-transcript.
 * @returns {string} The combined and cleaned transcript text.
 */
export function buildTranscript(transcriptItems: TranscriptItem[]): string {
  if (!Array.isArray(transcriptItems) || transcriptItems.length === 0) {
    return "";
  }

  return transcriptItems
    .map((item) => item.text)
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
