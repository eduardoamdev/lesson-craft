/**
 * Generates metadata for temporary files, including a UUID and a current timestamp.
 *
 * @returns {object} An object containing the generated UUID and timestamp string.
 */
export function generateTemporalFilesMetadata() {
  const uuid = crypto.randomUUID();
  const timestamp = Date.now().toString();

  return {
    uuid,
    timestamp,
  };
}
