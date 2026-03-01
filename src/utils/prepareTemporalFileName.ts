import path from "path";

/**
 * Prepares a temporal file name and maintains file identity (UUID/Timestamp).
 *
 * @param originalName Optional original filename. If provided, returns an image filename.
 * @param existingId Optional UUID to reuse for matching files.
 * @param existingTimestamp Optional timestamp string to reuse for matching files.
 * @returns An object with the generated fileName, uuid, and timestamp.
 */
export function prepareTemporalFileName(
  originalName?: string,
  existingId?: string,
  existingTimestamp?: string,
) {
  const uuid = existingId || crypto.randomUUID();
  const timestamp = existingTimestamp || Date.now().toString();

  let fileName = "";

  if (originalName) {
    const extension = path.extname(originalName);
    const sanitizedBase = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9]/g, "_");

    fileName = `${uuid}-${sanitizedBase}-${timestamp}${extension}`;
  } else {
    fileName = `${uuid}-${timestamp}.json`;
  }

  return {
    fileName,
    uuid,
    timestamp,
  };
}
