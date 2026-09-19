import { Content } from "@/types";
import { useState } from "react";
import { useUpdateContentText } from "./useUpdateContentText";
import { useTextChanged } from "./useTextChanged";

export type ContentTextEditor = ReturnType<typeof useContentText>;

export const useContentText = (content: Content) => {
  const textField: "content" | "ai_output" =
    content.ai_output != null ? "ai_output" : "content";

  const originalText = content.ai_output ?? content.content ?? "";

  const { updateText } = useUpdateContentText(content.id, textField);
  const { isEditingText, setIsEditingText, textValue, setTextValue } =
    useTextChanged(originalText);

  const [savedText, setSavedText] = useState(originalText);

  const isDirty = textValue !== savedText;

  const save = (value: string = textValue) => {
    if (value === savedText) return;

    setSavedText(value);
    updateText(value);
  };

  return {
    isEditing: isEditingText,
    setIsEditing: setIsEditingText,
    startEditing: () => setIsEditingText(true),
    textValue,
    setTextValue,
    savedText,
    isDirty,
    save,
  };
};
