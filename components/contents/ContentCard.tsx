"use client";

import { contentTypes } from "@/data/colors/typeColors";
import { useModal } from "@/providers/AppModalProvider";
import { Content } from "@/types";
import {
  cutText,
  formatDate,
  getFileName,
  getFileUrl,
  isImageFile,
} from "@/utils/fn";
import ModalContainer from "../modal/ModalContainer";
import AIOutputSmall from "../ai/AIOutputSmall";
import QuizComponent from "../quiz/QuizComponent";
import ShowContent from "./ShowContent";
import ContentBadge from "./ContentBadge";
import Image from "next/image";
import { Paperclip } from "lucide-react";
import DateBadge from "../shared/DateBadge";

const FileCardPreview = ({ content }: { content: Content }) => {
  const url = getFileUrl(content);

  if (!url)
    return (
      <p className="text-foreground/60 text-xs font-light">No file attached.</p>
    );

  if (isImageFile(url))
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-black/5">
        <Image
          src={url}
          alt={content.title}
          fill
          sizes="340px"
          className="object-cover"
        />
      </div>
    );

  return (
    <div className="flex items-center gap-2 rounded-xl bg-black/5 p-3">
      <Paperclip className="size-4 shrink-0 text-black/40" />
      <span className="truncate text-xs font-medium text-black/70">
        {getFileName(url)}
      </span>
    </div>
  );
};

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
        {content.type === "file" ? (
          <FileCardPreview content={content} />
        ) : content.type === "quiz" || content.type === "diagram" ? (
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
