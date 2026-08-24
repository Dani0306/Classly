"use client";

import { contentTypes } from "@/data/colors/typeColors";
import { useModal } from "@/providers/AppModalProvider";
import { Content, ContentType } from "@/types";
import { cutText, formatDate, formatText } from "@/utils/fn";
import ModalContainer from "../modal/ModalContainer";
import ContentModal from "./ContentModal";
import AIOutputSmall from "../ai/AIOutputSmall";

export const TypeBadge = ({
  type,
  filled = false,
}: {
  type: ContentType;
  filled?: boolean;
}) => {
  const typeData = contentTypes.find((item) => item.type === type);
  const color = typeData?.color ?? "#ccc";
  const Icon = typeData?.icon;

  return (
    <span
      style={{
        color: filled ? "#fff" : color,
        backgroundColor: filled ? color : `${color}30`,
      }}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-xl"
    >
      {Icon && <Icon style={{ width: 12, height: 12 }} />}
      {formatText(type)}
    </span>
  );
};

const ContentCard = ({ content }: { content: Content }) => {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal(
      <ModalContainer defaultPadding={false}>
        <ContentModal content={content} />
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
        <TypeBadge type={content.type} />
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
