export function prepareTemporalFileName(
  fileExtension: string,
  uuid: string,
  timestamp: string,
) {
  return `${uuid}-${timestamp}${fileExtension}`;
}
