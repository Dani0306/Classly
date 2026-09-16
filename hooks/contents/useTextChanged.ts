import { useEffect, useState } from "react";

export const useTextChanged = (text: string) => {
  const originalText = text;

  const [isEditingText, setIsEditingText] = useState(false);
  const [textValue, setTextValue] = useState(originalText);

  useEffect(() => {
    setTextValue(originalText);
  }, [originalText]);

  return { isEditingText, setIsEditingText, textValue, setTextValue };
};
