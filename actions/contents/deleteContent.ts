"use server";

import { CONTENT_FILES_BUCKET, getStoragePath } from "@/lib/storage";
import { getFileUrl } from "@/utils/fn";
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
    .select("type, ai_output")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = await supabase
    .from("contents")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error("Error deleting content.");

  if (content?.type === "file") {
    const path = getStoragePath(getFileUrl(content));

    if (path) {
      const { error: storageError } = await supabase.storage
        .from(CONTENT_FILES_BUCKET)
        .remove([path]);
      if (storageError) console.error(storageError);
    }
  }

  revalidatePath("/app/class/[id]");

  return true;
};
