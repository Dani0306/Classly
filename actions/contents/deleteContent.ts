"use server";

import { CONTENT_FILES_BUCKET, getStoragePath } from "@/lib/storage";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const deleteContent = async (id: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user found.");

  const { data: content } = await supabase
    .from("contents")
    .select("type, ai_output, files_urls")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = await supabase
    .from("contents")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error("Error deleting content.");

  // Attachments can sit on any content type in files_urls; a legacy "file"
  // content kept its single URL in ai_output instead.
  const urls: string[] = [...(content?.files_urls ?? [])];

  const paths = urls
    .map((url) => getStoragePath(url))
    .filter((path): path is string => path !== null);

  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(CONTENT_FILES_BUCKET)
      .remove(paths);
    if (storageError) console.error(storageError);
  }

  revalidatePath("/app/class/[id]");

  return true;
};
