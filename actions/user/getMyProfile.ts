"use server";

import { AppUser } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";

export const getMyProfile = async (): Promise<AppUser> => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error("Failed getting your profile.");

  // The profile row is created on first sign in (app/auth/callback/route.ts).
  // Fall back to the auth metadata so Settings still renders if it is missing.
  if (!data) {
    return {
      id: user.id,
      name:
        (user.user_metadata?.full_name as string) ||
        (user.user_metadata?.name as string) ||
        "",
      email: user.email ?? "",
      image_url: (user.user_metadata?.avatar_url as string) ?? "",
      created_at: new Date(user.created_at),
      updated_at: new Date(user.created_at),
      plan: "starter",
    };
  }

  return data as AppUser;
};
