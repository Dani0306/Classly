"use server";

import { AppUser } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";

export async function createUser(user: AppUser) {
  const supabase = await createServerSupabase();

  // 1. Check if user already exists
  const { data: existingUser, error: selectError } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  if (selectError) {
    console.error(selectError);
    throw new Error("Failed to check if user exists.");
  }

  if (existingUser) return existingUser;

  // 2. Insert new user
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single();

  if (insertError) {
    console.error(insertError);
    throw new Error("Failed to create user.");
  }

  return newUser;
}
