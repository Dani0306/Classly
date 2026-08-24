"use server";

import { client } from "@/ai/client";
import { generateDiagramPrompt } from "@/ai/prompts/generateDiagramPrompt";
import { DiagramType } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";

export const generateDiagram = async (
  title: string,
  content: string,
  diagramType: DiagramType,
  constraints?: string,
) => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found.");

  const prompt = generateDiagramPrompt(
    title,
    content,
    diagramType,
    constraints,
  );

  const { output, error } = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    tools: [{ type: "image_generation" }],
  });

  if (error) throw new Error(`Error: ${error.message}`);

  const imageData = output
    .filter((o) => o.type === "image_generation_call")
    .map((o) => o.result);

  if (imageData.length === 0) throw new Error("No image generated.");

  // Convert base64 to buffer and upload to Supabase Storage
  const buffer = Buffer.from(imageData[0]!, "base64");
  const fileName = `${user.id}/${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage
    .from("diagrams")
    .upload(fileName, buffer, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  // Return just the public URL — tiny string instead of massive base64
  const {
    data: { publicUrl },
  } = supabase.storage.from("diagrams").getPublicUrl(fileName);

  return publicUrl;
};
