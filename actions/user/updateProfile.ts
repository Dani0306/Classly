"use server";

import { AppUser, UpdateProfile } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const updateProfile = async (profile: UpdateProfile) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const name = profile.name?.trim();

  if (!name) throw new Error("Your name cannot be empty.");

  const { data, error } = await supabase
    .from("users")
    .update({
      name,
      image_url: profile.image_url?.trim() ?? "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw new Error("Failed updating your profile.");

  revalidatePath("/app/settings");

  return data as AppUser;
};
