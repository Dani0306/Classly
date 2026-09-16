"use server";

import { NewContent } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { client } from "@/ai/client";
import { correctGrammarPrompt } from "@/ai/prompts/correctGrammarPrompt";

export const createContent = async (note: NewContent) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const { output_text, error: AIerror } = await client.responses.create({
    input: correctGrammarPrompt(note.title, note.content),
    model: "gpt-5-mini",
  });

  if (AIerror) throw new Error("Failed correcting the content.");

  const response = JSON.parse(output_text);

  const { data, error } = await supabase.from("contents").insert({
    ...note,
    title: response.title ?? note.title,
    ai_output: response.description ?? note.content,
    user_id: user.id,
  });

  if (error) throw new Error("Failed creating note.");

  revalidatePath("/app/class/[id]");

  return data;
};
