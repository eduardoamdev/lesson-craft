import fs from "fs/promises";
import path from "path";

/**
 * Cleans up files in a specified directory that exceed a maximum age.
 *
 * @param {string} dir - The directory path to clean up.
 * @param {number} [maxAgeMs=3600000] - The maximum file age in milliseconds (defaults to 1 hour).
 * @returns {Promise<void>}
 */
export async function cleanupOldFiles(
  dir: string,
  maxAgeMs: number = 60 * 60 * 1000,
) {
  try {
    const files = await fs.readdir(dir);
    const now = Date.now();

    for (const file of files) {
      if (file === ".gitignore") continue;

      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > maxAgeMs) {
        await fs.unlink(filePath);
      }
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}
