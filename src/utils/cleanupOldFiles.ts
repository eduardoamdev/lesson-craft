import fs from "fs/promises";
import path from "path";

/**
 * Cleans up files in a directory that are older than a certain age.
 * @param dir The directory to clean up
 * @param maxAgeMs The maximum age of files in milliseconds (defaults to 1 hour)
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
