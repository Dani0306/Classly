"use server";

import { client } from "@/ai/client";
import { generateSummaryPrompt } from "@/ai/prompts/generateSummaryPrompt";
import { createServerSupabase } from "@/utils/supabase/server";

export const generateSummary = async (
  title: string,
  text: string,
  size: string,
) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user found");

  const { output_text, error } = await client.responses.create({
    input: generateSummaryPrompt(title, text, size),
    model: "gpt-5-mini",
  });

  if (error) throw new Error("Error generating summary.");

  return output_text;
};
