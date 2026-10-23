"use client";

import { typeColor } from "@/lib/contentoptions";
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

const ContentCard = ({
  content,
  classLabel = content.classes?.name,
}: {
  content: Content;
  /** The class name; defaults to the joined class when the list has one. */
  classLabel?: string;
}) => {
  const { openModal } = useModal();

  const attachments = content.files_urls ?? [];

  const handleClick = () => {
    openModal(
      <ModalContainer defaultPadding={false}>
        <>
          {content.type === "quiz" ? (
            <QuizComponent content={content} />
          ) : (
            <ShowContent content={content} classLabel={classLabel} />
          )}
        </>
      </ModalContainer>,
    );
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      style={
        {
          "--tape": `${typeColor(content.type)}d9`,
        } as React.CSSProperties
      }
      className="note tape tilt relative flex w-85 cursor-pointer flex-col gap-5 p-5 pt-7 md:p-6 md:pt-7"
    >

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
        <strong
          className={`text-base font-bold tracking-tight ${content.type === "task" && content.is_completed ? "text-ink/50 line-through decoration-1" : ""}`}
        >
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
