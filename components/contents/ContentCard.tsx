"use client";

import { contentTypes } from "@/data/colors/typeColors";
import { useModal } from "@/providers/AppModalProvider";
import { Content } from "@/types";
import { cutText } from "@/utils/fn";
import ModalContainer from "../modal/ModalContainer";
import AIOutputSmall from "../ai/AIOutputSmall";
import QuizComponent from "../quiz/QuizComponent";
import ShowContent from "./ShowContent";
import ContentBadge from "./ContentBadge";
import { Paperclip } from "lucide-react";
import DateBadge from "../shared/DateBadge";

const ContentCard = ({ content }: { content: Content }) => {
  const { openModal } = useModal();

  const attachments = content.files_urls ?? [];

  const handleClick = () => {
    openModal(
      <ModalContainer defaultPadding={false}>
        <>
          {content.type === "quiz" ? (
            <QuizComponent content={content} />
          ) : (
            <ShowContent content={content} />
          )}
        </>
      </ModalContainer>,
    );
  };

  return (
    <div
      onClick={handleClick}
      style={{
        borderColor:
          contentTypes.find((item) => item.type === content.type)?.color ??
          "#ccc",
      }}
      className="border-t-3 rounded-xl flex flex-col space-y-6 p-5 md:p-6 w-85 shadow-xl hover:scale-[1.03] transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <ContentBadge type={content.type} />
        <div className="flex">
          {attachments.length > 0 && (
            <div className="flex space-x-1 items-center justify-center text-blue-800">
              <Paperclip className="size-4" />
              <span>{attachments.length}</span>
            </div>
          )}
          <DateBadge timestamp={content.due_date ?? content.created_at} />
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <strong className="text-base font-semibold text-foreground">
          {content.title}
        </strong>
        {content.type === "quiz" || content.type === "diagram" ? (
          <p className="text-foreground/60 text-xs font-light">
            {cutText(content.content)}
          </p>
        ) : (
          <AIOutputSmall content={content.ai_output ?? content.content} />
        )}
      </div>
    </div>
  );
};

export default ContentCard;
