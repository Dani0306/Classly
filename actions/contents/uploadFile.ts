"use server";

import { CONTENT_FILES_BUCKET } from "@/lib/storage";
import { sanitizeFileName } from "@/utils/fn";
import { createServerSupabase } from "@/utils/supabase/server";

// Server action bodies are capped at 5mb in next.config.ts, so anything
// bigger is rejected by Next before it ever reaches this action.
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export const uploadFile = async (
  input: File | readonly File[],
): Promise<string> => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  // react-dropzone hands back a `readonly FileWithPath[]` — FileWithPath
  // already extends File, so only the array needs unwrapping here.
  const file = Array.isArray(input) ? input[0] : input;

  if (!file || file.size === 0) throw new Error("No file was selected.");

  if (file.size > MAX_FILE_SIZE)
    throw new Error(`"${file.name}" is larger than the 5MB limit.`);

  if (!ALLOWED_MIME_TYPES.includes(file.type))
    throw new Error(`"${file.name}" is not a supported file type.`);

  // The storage policy requires the first folder to be the user's id.
  const path = `${user.id}/${Date.now()}-${crypto
    .randomUUID()
    .slice(0, 8)}-${sanitizeFileName(file.name)}`;

  const { error } = await supabase.storage
    .from(CONTENT_FILES_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Failed uploading "${file.name}".`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(CONTENT_FILES_BUCKET).getPublicUrl(path);

  return publicUrl;
};
