import path from "path";

/**
 * Extracts the extension from a filename.
 *
 * @param fileName The name of the file
 * @returns The extension including the dot (e.g., '.png')
 */
export function extractExtension(fileName: string): string {
  return path.extname(fileName);
}
