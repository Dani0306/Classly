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
      className="lift sheet relative flex w-85 cursor-pointer flex-col gap-5 overflow-hidden p-5 md:p-6"
    >
      <span
        aria-hidden
        style={{
          backgroundColor:
            contentTypes.find((item) => item.type === content.type)?.color ??
            "#c9d3c6",
        }}
        className="absolute inset-x-0 top-0 h-1.5"
      />
      <div className="flex items-center justify-between">
        <ContentBadge type={content.type} />
        <div className="flex">
          {attachments.length > 0 && (
            <div className="flex space-x-1 items-center justify-center text-muted-foreground">
              <Paperclip className="size-4" />
              <span>{attachments.length}</span>
            </div>
          )}
          <DateBadge timestamp={content.due_date ?? content.created_at} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
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
