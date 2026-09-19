"use server";

import { CONTENT_FILES_BUCKET } from "@/lib/storage";
import { sanitizeFileName } from "@/utils/fn";
import { createServerSupabase } from "@/utils/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export const uploadFiles = async (
  input: File[] | readonly File[],
): Promise<string[]> => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  if (input.length === 0) throw new Error("No files were selected");

  for (const file of input) {
    if (!file || file.size === 0) throw new Error("No file was selected.");

    if (file.size > MAX_FILE_SIZE)
      throw new Error(`"${file.name}" is larger than the 5MB limit.`);

    if (!ALLOWED_MIME_TYPES.includes(file.type))
      throw new Error(`"${file.name}" is not a supported file type.`);
  }

  const paths: string[] = [];
  const publicUrls: string[] = [];

  for (const file of input) {
    // The storage policy requires the first folder to be the user's id. The
    // random segment keeps two files dropped in the same millisecond apart.
    const path = `${user.id}/${Date.now()}-${crypto
      .randomUUID()
      .slice(0, 8)}-${sanitizeFileName(file.name)}`;

    const { error } = await supabase.storage
      .from(CONTENT_FILES_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      // Roll the batch back so a partial upload leaves no orphaned objects.
      if (paths.length > 0)
        await supabase.storage.from(CONTENT_FILES_BUCKET).remove(paths);

      throw new Error(`Failed uploading "${file.name}".`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(CONTENT_FILES_BUCKET).getPublicUrl(path);

    paths.push(path);
    publicUrls.push(publicUrl);
  }

  return publicUrls;
};
