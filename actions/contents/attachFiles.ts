"use server";

import { uploadFiles } from "@/actions/files/uploadFiles";
import { deleteFiles } from "@/actions/files/deleteFiles";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Uploads files and attaches them to a content in one step. Returns the
 * content's full files_urls list after the append.
 */
export const attachFiles = async (
  contentId: string,
  files: readonly File[],
): Promise<string[]> => {
  const urls = await uploadFiles(files);

  const supabase = await createServerSupabase();

  // Appends in the database rather than overwriting from here, so two uploads
  // finishing together can't drop each other's files.
  const { data, error } = await supabase.rpc("append_content_files", {
    p_content_id: contentId,
    p_urls: urls,
  });

  if (error || !data) {
    // The files are stored but nothing points at them — remove them rather
    // than leave orphans in the bucket.
    await deleteFiles(urls).catch(console.error);

    throw new Error("Failed attaching the files.");
  }

  revalidatePath("/app/class/[id]");

  return data as string[];
};
