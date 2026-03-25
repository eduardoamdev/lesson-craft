/**
 * Constructs a standardized temporary filename using a UUID and timestamp.
 *
 * @param {string} fileExtension - The extension to append to the filename.
 * @param {string} uuid - A unique identifier for the file.
 * @param {string} timestamp - The current timestamp for version tracking.
 * @returns {string} The constructed filename (e.g., 'uuid-timestamp.ext').
 */
export function prepareTemporalFileName(
  fileExtension: string,
  uuid: string,
  timestamp: string,
) {
  return `${uuid}-${timestamp}${fileExtension}`;
}
