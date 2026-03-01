/**
 * Prepares a temporal file name and maintains file identity (UUID/Timestamp).
 *
 * @param fileExtension The extension for the file (e.g., '.png', '.json').
 * @param existingId Optional UUID to reuse for matching files.
 * @param existingTimestamp Optional timestamp string to reuse for matching files.
 * @returns An object with the generated fileName, uuid, and timestamp.
 */
export function prepareTemporalFileName(
  fileExtension: string = ".json",
  existingId?: string,
  existingTimestamp?: string,
) {
  const uuid = existingId || crypto.randomUUID();
  const timestamp = existingTimestamp || Date.now().toString();

  const fileName = `${uuid}-${timestamp}${fileExtension}`;

  return {
    fileName,
    uuid,
    timestamp,
  };
}
