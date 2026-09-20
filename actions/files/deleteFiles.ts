"use server";

import { CONTENT_FILES_BUCKET, getStoragePath } from "@/lib/storage";
import { createServerSupabase } from "@/utils/supabase/server";

export const deleteFiles = async (
  input: string | readonly string[],
): Promise<string[]> => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const urls = typeof input === "string" ? [input] : input;

  if (urls.length === 0) throw new Error("No files were selected.");

  const paths = urls
    .map((url) => getStoragePath(url))
    // A URL from another bucket (a diagram) or an external link has no key
    // here, and every key must sit in the caller's own folder.
    .filter(
      (path): path is string => path !== null && path.startsWith(`${user.id}/`),
    );

  if (paths.length === 0)
    throw new Error("None of those files can be deleted.");

  const { error } = await supabase.storage
    .from(CONTENT_FILES_BUCKET)
    .remove(paths);

  if (error) throw new Error("Failed deleting the files.");

  return paths;
};
