import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type TextToEditProps = {
  isEditingText: boolean;
  textValue: string;
  setTextValue: Dispatch<SetStateAction<string>>;
  setIsEditingText: Dispatch<SetStateAction<boolean>>;
  originalText: string;
  updateText: (value: string) => void;
};

const TextToEdit = ({
  isEditingText,
  textValue,
  setTextValue,
  setIsEditingText,
  originalText,
  updateText,
}: TextToEditProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditingText) {
      const el = textareaRef.current;
      el?.focus();
      el?.setSelectionRange(el.value.length, el.value.length);
    }
  }, [isEditingText]);

  const handleBlurText = () => {
    setIsEditingText(false);
    if (textValue !== originalText) {
      updateText(textValue);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      readOnly={!isEditingText}
      value={textValue}
      onChange={(e) => setTextValue(e.target.value)}
      onClick={() => setIsEditingText(true)}
      onBlur={handleBlurText}
      className={cn(
        "w-full h-full min-h-50 resize-none whitespace-pre-wrap text-sm leading-relaxed text-black bg-transparent outline-none rounded-md p-1 -m-1 transition-colors",
        isEditingText
          ? "cursor-text ring-1 ring-black/20"
          : "cursor-pointer hover:bg-black/5",
      )}
    />
  );
};

export default TextToEdit;
