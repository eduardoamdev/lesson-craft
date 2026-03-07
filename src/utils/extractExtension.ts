import path from "path";

/**
 * Extracts the file extension from a given filename.
 *
 * @param {string} fileName - The full name of the file.
 * @returns {string} The normalized extension including the leading dot (e.g., '.png').
 */
export function extractExtension(fileName: string): string {
  return path.extname(fileName);
}
