/**
 * Extracts the video ID from a YouTube URL.
 * Supports standard, short (youtu.be), and embed URLs.
 *
 * @param {string} url - The YouTube URL.
 * @returns {string | null} The extracted video ID or null if not found.
 */
export function extractVideoId(url: string): string | null {
  const videoUrlRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(videoUrlRegex);

  return match ? match[1] : null;
}
