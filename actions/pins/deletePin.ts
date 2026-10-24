"use server";

import { CONTENT_FILES_BUCKET, getStoragePath } from "@/lib/storage";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/** Unpins an item. A pinned file is deleted from storage along with it. */
export const deletePin = async (id: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const { data: pin, error } = await supabase
    .from("class_pins")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("kind, url")
    .maybeSingle();

  if (error) throw new Error("Failed unpinning.");

  const path = pin?.kind === "file" ? getStoragePath(pin.url) : null;

  if (path && path.startsWith(`${user.id}/`)) {
    const { error: storageError } = await supabase.storage
      .from(CONTENT_FILES_BUCKET)
      .remove([path]);
    // The pin is gone either way; a leftover object is only an orphan.
    if (storageError) console.error(storageError);
  }

  revalidatePath("/app/class/[id]", "page");
};
