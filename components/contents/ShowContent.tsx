"use client";

import { Content } from "@/types";
import Image from "next/image";
import { Check, RefreshCcw } from "lucide-react";
import { useMarkAsCompleted } from "@/hooks/contents/useMarkAsCompleted";
import LoadingScreen from "../loading/LoadingScreen";
import { cn } from "@/lib/utils";
import DateBadge from "../shared/DateBadge";
import ContentBadge from "../contents/ContentBadge";
import PriorityBadge from "../shared/PriorityBadge";
import { CONTENT_TYPE_COLORS } from "@/lib/contentcolors";
import TextToEdit from "./TextToEdit";
import { useUpdateContentText } from "@/hooks/contents/useUpdateContentText";
import { useTextChanged } from "@/hooks/contents/useTextChanged";
import { useState } from "react";

const ShowContent = ({ content }: { content: Content }) => {
  const type = content.type;

  const { markAsCompleted, isPending } = useMarkAsCompleted(
    content.is_completed ?? false,
    content.id,
  );

  const textField: "content" | "ai_output" =
    content.ai_output != null ? "ai_output" : "content";

  const originalText = content.ai_output ?? content.content ?? "";
  const { updateText } = useUpdateContentText(content.id, textField);
  const { isEditingText, setIsEditingText, textValue, setTextValue } =
    useTextChanged(originalText);

  // The modal keeps the content it was opened with, so `originalText` never
  // reflects a save. Track what we saved to know if the text really changed.
  const [savedText, setSavedText] = useState(originalText);

  const saveText = (value: string) => {
    setSavedText(value);
    updateText(value);
  };

  const completed = content.is_completed ?? false;

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingScreen message="Changing content status ..." />
      </div>
    );
  }

  const colors = CONTENT_TYPE_COLORS[type];

  return (
    <div
      className={cn(
        "w-full h-full mx-auto bg-white rounded-2xl border border-black/10 border-t-4 shadow-xl py-8 px-6 lg:px-10",
        colors.solid,
        completed && "opacity-75",
      )}
    >
      <div className="flex h-full flex-col space-y-6">
        {/* Header — fixed height, never grows or shrinks */}
        <div className="shrink-0 flex items-start justify-between gap-4">
          <h2 className="text-3xl font-bold text-black leading-tight">
            {content.title}
          </h2>
        </div>

        <div className="shrink-0 flex flex-wrap items-center gap-2 text-[13px]">
          <ContentBadge type={content.type} />
          {(type === "homework" || type === "reminder") && (
            <>
              <DateBadge timestamp={content.due_date!} />
              <PriorityBadge priority={content.priority ?? "medium"} />
            </>
          )}
        </div>

        {/* Content — fills remaining space, scrolls internally */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          {type === "diagram" && content.ai_output ? (
            <div className="relative w-full h-full min-h-75 rounded-xl overflow-hidden bg-black/5">
              <Image
                src={content.ai_output}
                alt={content.title}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <TextToEdit
              isEditingText={isEditingText}
              originalText={savedText}
              setIsEditingText={setIsEditingText}
              setTextValue={setTextValue}
              textValue={textValue}
              updateText={saveText}
            />
          )}
        </div>

        <div className="shrink-0 border-t border-black/10" />

        {/* Footer — fixed height, never grows or shrinks */}
        <div className="shrink-0 flex items-center gap-3">
          {(type === "homework" || type === "reminder") && (
            <>
              <>
                <button
                  onClick={markAsCompleted}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 rounded-xl text-[13px] font-semibold py-3 transition-colors cursor-pointer",
                    completed
                      ? "border border-emerald-600 text-green-900 bg-emerald-200 hover:bg-emerald-300"
                      : "bg-black/5 text-black/70 hover:bg-black/10",
                  )}
                >
                  {completed && <Check className="size-4" />}
                  {completed ? "Completed" : "Mark as complete"}
                </button>

                {completed && (
                  <button
                    onClick={markAsCompleted}
                    className="text-[13px] font-medium bg-black/5 hover:bg-black/10 rounded-lg px-4 py-3 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCcw className="size-3.5" />
                    Reopen
                  </button>
                )}
              </>
            </>
          )}
          <button
            onClick={() => {
              if (textValue === savedText) setIsEditingText(true);
            }}
            className={cn(
              "text-[13px] font-medium rounded-lg px-4 py-3 transition-colors cursor-pointer",
              textValue !== savedText
                ? "text-emerald-900 bg-emerald-100 hover:bg-emerald-200"
                : "text-black/80 bg-black/5 hover:bg-black/10",
            )}
          >
            {textValue !== savedText ? "Save" : "Edit"}
          </button>

          <button className="text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg px-3 py-3 transition-colors cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowContent;
