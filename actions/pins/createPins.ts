"use server";

import { uploadFiles } from "@/actions/files/uploadFiles";
import { CONTENT_FILES_BUCKET, getStoragePath } from "@/lib/storage";
import { MAX_PIN_TITLE, fileTitle, linkHost, normalizeLink } from "@/lib/pins";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const pinLink = async (classId: string, url: string, title?: string) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const link = normalizeLink(url);
  if (!link) throw new Error("That doesn't look like a web address.");

  const { error } = await supabase.from("class_pins").insert({
    user_id: user.id,
    class_id: classId,
    kind: "link",
    title: (title?.trim() || linkHost(link)).slice(0, MAX_PIN_TITLE),
    url: link,
  });

  if (error) throw new Error("Failed pinning the link.");

  revalidatePath("/app/class/[id]", "page");
};

export const pinFiles = async (classId: string, files: File[]) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const urls = await uploadFiles(files);

  const { error } = await supabase.from("class_pins").insert(
    urls.map((url, i) => ({
      user_id: user.id,
      class_id: classId,
      kind: "file",
      title: fileTitle(files[i].name),
      url,
    })),
  );

  if (error) {
    // Nothing points at the uploads, so don't leave them in the bucket.
    const paths = urls
      .map((url) => getStoragePath(url))
      .filter((path): path is string => path !== null);
    await supabase.storage.from(CONTENT_FILES_BUCKET).remove(paths);

    throw new Error("Failed pinning the files.");
  }

  revalidatePath("/app/class/[id]", "page");
};
