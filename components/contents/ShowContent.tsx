"use client";

import { Content, ViewType } from "@/types";
import { cn } from "@/lib/utils";
import { CONTENT_TYPE_COLORS } from "@/lib/contentcolors";
import { useContentText } from "@/hooks/contents/useContentText";
import { useMarkAsCompleted } from "@/hooks/contents/useMarkAsCompleted";
import { useDeleteContent } from "@/hooks/contents/useDeleteContent";
import LoadingScreen from "../loading/LoadingScreen";
import ContentHeader from "./ContentHeader";
import ContentBody from "./ContentBody";
import ContentFooter from "./ContentFooter";
import { useState, useTransition } from "react";
import Attachments from "./Attachments";
import { attachFiles } from "@/actions/contents/attachFiles";
import { useToast } from "@/providers/ToastProvider";

const ShowContent = ({ content }: { content: Content }) => {
  const [section, setSection] = useState<ViewType>("content");

  const { toast } = useToast();

  // The content prop is fixed when the modal opens, so newly attached files
  // are tracked here rather than waiting on a refetch that never reaches it.
  const [fileUrls, setFileUrls] = useState<string[]>(content.files_urls ?? []);
  const [isUploading, startUpload] = useTransition();

  const handleFilesAdded = (files: File[]) => {
    startUpload(async () => {
      try {
        const saved = await attachFiles(content.id, files);

        // Merge rather than replace: a slower, earlier drop can resolve after
        // a later one and carry a shorter list.
        setFileUrls((prev) => Array.from(new Set([...prev, ...saved])));
      } catch (error) {
        toast({
          title: "Failed to add files",
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
          type: "error",
        });
      }
    });
  };

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
            <Attachments
              files={fileUrls}
              isUploading={isUploading}
              onFilesAdded={handleFilesAdded}
            />
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
