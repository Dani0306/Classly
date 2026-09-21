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

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const DOC_MIME_TYPE = "application/msword";

// What content-files accepts, keyed by MIME type. FileInput hands this to the
// dropzone and uploadFiles validates against it; the bucket's
// allowed_mime_types must list the same types.
export const ACCEPTED_FILE_TYPES: Record<string, string[]> = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "application/pdf": [".pdf"],
  [DOC_MIME_TYPE]: [".doc"],
  [DOCX_MIME_TYPE]: [".docx"],
};

/**
 * The file's MIME type, falling back to its extension. Browsers without Office
 * installed often report Word files with an empty type.
 */
export const resolveMimeType = (file: Pick<File, "name" | "type">) => {
  if (file.type && file.type !== "application/octet-stream") return file.type;

  const name = file.name.toLowerCase();

  const match = Object.entries(ACCEPTED_FILE_TYPES).find(([, extensions]) =>
    extensions.some((extension) => name.endsWith(extension)),
  );

  return match?.[0] ?? file.type;
};
