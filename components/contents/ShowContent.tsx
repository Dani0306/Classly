"use client";

import { Content } from "@/types";
import { cn } from "@/lib/utils";
import { CONTENT_TYPE_COLORS } from "@/lib/contentcolors";
import { useContentText } from "@/hooks/contents/useContentText";
import { useMarkAsCompleted } from "@/hooks/contents/useMarkAsCompleted";
import { useDeleteContent } from "@/hooks/contents/useDeleteContent";
import LoadingScreen from "../loading/LoadingScreen";
import ContentHeader from "./ContentHeader";
import ContentBody from "./ContentBody";
import ContentFooter from "./ContentFooter";
import { useState } from "react";
import Attachments from "./Attachments";

export type SectionType = "content" | "attachments";

const ShowContent = ({ content }: { content: Content }) => {
  const [section, setSection] = useState<SectionType>("content");

  const completed = content.is_completed ?? false;
  const editor = useContentText(content);

  const { isPending: loadingDelete, deleteContent } = useDeleteContent(
    content.id,
  );

  const { markAsCompleted, isPending: loadingMarkAsCompleted } =
    useMarkAsCompleted(completed, content.id);

  if (loadingMarkAsCompleted || loadingDelete) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingScreen
          message={
            loadingMarkAsCompleted
              ? "Changing content status ..."
              : "Deleting content ..."
          }
        />
      </div>
    );
  }

  const colors = CONTENT_TYPE_COLORS[content.type];

  return (
    <div
      className={cn(
        "w-full h-full mx-auto bg-white rounded-2xl border border-black/10 border-t-4 shadow-xl py-8 px-6 lg:px-10",
        colors.solid,
        completed && "opacity-75",
      )}
    >
      <div className="flex h-full flex-col space-y-6">
        <ContentHeader content={content} setSection={setSection} />

        {/* Content — fills remaining space, scrolls internally */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide!">
          {section === "content" ? (
            <ContentBody content={content} editor={editor} />
          ) : (
            <Attachments />
          )}
        </div>

        <div className="shrink-0 border-t border-black/10" />

        <ContentFooter
          content={content}
          editor={editor}
          completed={completed}
          markAsCompleted={markAsCompleted}
          deleteContent={deleteContent}
        />
      </div>
    </div>
  );
};

export default ShowContent;
