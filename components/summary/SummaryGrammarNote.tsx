"use client";

import { Content } from "@/types";
import { contentTypes } from "@/data/colors/typeColors";
import DateBadge from "../shared/DateBadge";
import PriorityBadge from "../shared/PriorityBadge";
import { TypeBadge } from "../contents/ContentCard";
import { Trash2 } from "lucide-react";
import AIOutput from "../ai/AIOutput";
import { useModal } from "@/providers/AppModalProvider";
import { useDeleteContent } from "@/hooks/contents/useDeleteContent";
import LoadingScreen from "../loading/LoadingScreen";

const SummaryGrammarContent = ({ content }: { content: Content }) => {
  const { closeModal } = useModal();

  const { isPending, deleteContent } = useDeleteContent(content.id);

  const itemContent = contentTypes.find((item) => item.type === content.type)!;

  return (
    <>
      {isPending ? (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingScreen message="Deleting Note ..." />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className="relative flex items-center justify-between h-[25%] p-6 overflow-hidden">
            <div
              style={{
                background: `linear-gradient(to bottom, ${itemContent.color ?? "#CCC"}40, transparent)`,
              }}
              className="absolute inset-0"
            />

            <div className="relative z-10 flex items-center space-x-3">
              <itemContent.icon
                style={{ backgroundColor: itemContent?.color ?? "#CCC" }}
                className="size-12 text-white p-2 rounded-xl"
              />
              <div className="flex flex-col space-y-3">
                <h2 className="text-base md:text-xl max-w-[90%] font-semibold text-foreground">
                  {content.title}
                </h2>
                <div className="flex items-center space-x-2">
                  <TypeBadge filled type={content.type} />
                  <PriorityBadge
                    filled
                    priority={content.priority ?? "medium"}
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <DateBadge timestamp={content.due_date ?? content.created_at} />
            </div>
          </div>

          <div className="flex flex-1 p-6 overflow-y-auto">
            {content.ai_output ? (
              <AIOutput content={content.ai_output} />
            ) : (
              <p>{content.content}</p>
            )}
          </div>

          <div className="flex items-center justify-between p-6">
            <button
              onClick={deleteContent}
              className="cursor-pointer hover:bg-orange-50 transition-all duration-500 rounded-xl text-sm font-medium text-red-600 flex items-center space-x-3 justify-center h-full px-6 py-2 border border-red-600"
            >
              <Trash2 className="size-4" />
              <span>Delete</span>
            </button>
            <button
              onClick={closeModal}
              className="cursor-pointer rounded-xl text-sm font-medium text-foreground/80 h-full px-6 py-2 border border-black"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SummaryGrammarContent;
