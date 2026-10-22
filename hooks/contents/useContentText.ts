import { Content } from "@/types";
import { useState } from "react";
import { useUpdateContentText } from "./useUpdateContentText";

export type ContentTextEditor = ReturnType<typeof useContentText>;

/**
 * Read/edit state for a content's text. `ai_output` wins over `content`, so
 * the edit is written back to whichever column is shown.
 */
export const useContentText = (content: Content) => {
  const textField: "content" | "ai_output" =
    content.ai_output != null ? "ai_output" : "content";

  const originalText = content.ai_output ?? content.content ?? "";

  const { updateText, isPending } = useUpdateContentText(content.id, textField);

  const [savedText, setSavedText] = useState(originalText);
  const [draft, setDraft] = useState(originalText);
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    setDraft(savedText);
    setIsEditing(true);
  };

  const cancel = () => {
    setDraft(savedText);
    setIsEditing(false);
  };

  const save = () => {
    if (draft !== savedText) {
      setSavedText(draft);
      updateText(draft);
    }
    setIsEditing(false);
  };

  return {
    isEditing,
    isSaving: isPending,
    savedText,
    draft,
    setDraft,
    isDirty: draft !== savedText,
    startEditing,
    cancel,
    save,
  };
};
