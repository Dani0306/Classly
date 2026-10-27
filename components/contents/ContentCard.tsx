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
import { CircleAlert, Paperclip } from "lucide-react";
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
  const isPending = content.type === "task" && !content.is_completed;

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
      className={`note tape tilt relative flex w-85 cursor-pointer flex-col gap-5 p-5 pt-7 md:p-6 md:pt-7 ${isPending ? "ring-2 ring-amber-400" : ""}`}
    >
      {isPending && (
        <span className="absolute -top-3 right-4 z-10 inline-flex items-center gap-1 rounded-full border border-amber-500 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900 shadow-sm">
          <CircleAlert className="size-3.5" />
          Pending
        </span>
      )}

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
