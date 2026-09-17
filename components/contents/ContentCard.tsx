"use client";

import { contentTypes } from "@/data/colors/typeColors";
import { useModal } from "@/providers/AppModalProvider";
import { Content } from "@/types";
import { cutText, formatDate } from "@/utils/fn";
import ModalContainer from "../modal/ModalContainer";
import AIOutputSmall from "../ai/AIOutputSmall";
import QuizComponent from "../quiz/QuizComponent";
import ShowContent from "./ShowContent";
import ContentBadge from "./ContentBadge";

const ContentCard = ({ content }: { content: Content }) => {
  const { openModal } = useModal();

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
        <span className="text-xs text-foreground">
          {formatDate(content.created_at)}
        </span>
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
