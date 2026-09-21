"use server";

import { CONTENT_FILES_BUCKET, getStoragePath } from "@/lib/storage";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Deletes files from the content-files bucket. The URLs are first removed from
 * the files_urls of any content that lists them, so no row points at a missing
 * object.
 */
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

  // A URL from another bucket (a diagram) or an external link has no key
  // here, and every key must sit in the caller's own folder.
  const deletable = urls.flatMap((url) => {
    const path = getStoragePath(url);
    return path !== null && path.startsWith(`${user.id}/`)
      ? [{ url, path }]
      : [];
  });

  if (deletable.length === 0)
    throw new Error("None of those files can be deleted.");

  const paths = deletable.map(({ path }) => path);

  // Finds the owning contents by URL and removes in the database rather than
  // writing a filtered list from here, so a concurrent upload's append isn't
  // overwritten. Matching no row is fine: the files may not be attached yet.
  const { data: updatedCount, error: detachError } = await supabase.rpc(
    "remove_content_files",
    { p_urls: deletable.map(({ url }) => url) },
  );

  if (detachError) throw new Error("Failed removing the files.");

  if (updatedCount) revalidatePath("/app/class/[id]");

  const { error } = await supabase.storage
    .from(CONTENT_FILES_BUCKET)
    .remove(paths);

  if (error) {
    // The content no longer lists these files, so a leftover object is only
    // an orphan in the bucket — don't fail the delete over it.
    if (updatedCount) console.error("Failed deleting stored files:", error);
    else throw new Error("Failed deleting the files.");
  }

  return paths;
};
