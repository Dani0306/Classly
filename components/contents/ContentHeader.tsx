import { Content, ViewType } from "@/types";
import ContentBadge from "./ContentBadge";
import DateBadge from "../shared/DateBadge";
import PriorityBadge from "../shared/PriorityBadge";
import { Paperclip } from "lucide-react";

export const AttachmentsBadge = ({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3.5 py-1 text-black bg-black/5 border-black"
      }
    >
      <Paperclip className="size-3.5 shrink-0" />
      <span className="text-[12px] font-semibold whitespace-nowrap">
        {text}
      </span>
    </div>
  );
};

const ContentHeader = ({
  content,
  setSection,
}: {
  content: Content;
  setSection: React.Dispatch<React.SetStateAction<ViewType>>;
}) => {
  const type = content.type;
  const isScheduled = type === "homework" || type === "reminder";

  return (
    <>
      <div className="shrink-0 flex items-start justify-between gap-4">
        <h2 className="text-3xl font-bold text-black leading-tight">
          {content.title}
        </h2>
      </div>

      <div className="shrink-0 flex flex-wrap items-center gap-2 text-[13px]">
        <ContentBadge onClick={() => setSection("content")} type={type} />
        <AttachmentsBadge
          text="See attachments"
          onClick={() => setSection("attachments")}
        />
        {isScheduled && (
          <>
            {content.due_date && <DateBadge timestamp={content.due_date} />}
            <PriorityBadge priority={content.priority ?? "medium"} />
          </>
        )}
      </div>
    </>
  );
};

export default ContentHeader;
