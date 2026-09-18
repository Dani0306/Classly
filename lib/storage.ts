export const CONTENT_FILES_BUCKET = "content-files";

// Public URLs are shaped like:
//   https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
// Returns null when the URL does not point at the given bucket, so a diagram
// or an external link is never mistaken for a deletable object.
export const getStoragePath = (
  url: string,
  bucket: string = CONTENT_FILES_BUCKET,
) => {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);

  if (index === -1) return null;

  return decodeURIComponent(url.slice(index + marker.length)) || null;
};
