export function generateTemporalFilesMetadata() {
  const uuid = crypto.randomUUID();
  const timestamp = Date.now().toString();

  return {
    uuid,
    timestamp,
  };
}
