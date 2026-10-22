"use client";

import { Content, ContentPriority, ViewType } from "@/types";
import { cn } from "@/lib/utils";
import { CONTENT_LABELS } from "@/lib/contenttypes";
import { typeColor } from "@/lib/contentoptions";
import { describeDue, parseDueDate } from "@/lib/dates";
import { useContentText } from "@/hooks/contents/useContentText";
import { useToggleComplete } from "@/hooks/contents/useToggleComplete";
import { useDeleteContent } from "@/hooks/contents/useDeleteContent";
import { useNow } from "@/hooks/shared/useNow";
import { useState, useTransition } from "react";
import { format, parseISO } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
  CalendarClock,
  Check,
  CircleCheck,
  PenLine,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import LoadingScreen from "../loading/LoadingScreen";
import PageButton from "../shared/PageButton";
import PriorityBadge from "../shared/PriorityBadge";
import ContentBadge from "./ContentBadge";
import SheetTabs from "./SheetTabs";
import Attachments from "./Attachments";
import DiagramPreview from "./DiagramPreview";
import StudyTools from "./StudyTools";
import { attachFiles } from "@/actions/contents/attachFiles";
import { useToast } from "@/providers/ToastProvider";

/** When a task is due, how urgent that is, and its priority. */
const DueLine = ({
  dueDate,
  priority,
  done,
}: {
  dueDate: string;
  priority?: ContentPriority;
  done: boolean;
}) => {
  const now = useNow();
  const due = now ? describeDue(dueDate, now) : null;
  const overdue = !done && due != null && due.days < 0;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span
        key={done ? "done" : "open"}
        className={cn(
          "inline-flex items-center gap-2 rounded-[3px] px-3 py-1.5 text-sm font-semibold",
          done
            ? "stamp bg-[#1f8a4c] text-white"
            : overdue
              ? "bg-red-600/10 text-red-700"
              : "bg-note-yellow text-ink",
        )}
      >
        {done ? (
          <CircleCheck className="size-4" strokeWidth={2.25} />
        ) : (
          <CalendarClock className="size-4" strokeWidth={2.25} />
        )}
        {done ? "Done" : (due?.label ?? "Due")}
      </span>
      <span className="text-sm text-ink/70">
        {format(parseDueDate(dueDate), "EEEE, MMMM d")}
      </span>
      {priority && <PriorityBadge priority={priority} />}
    </div>
  );
};

/** The text as a reader sees it. Summaries are markdown; the rest is plain. */
const ContentReader = ({
  content,
  text,
  onEdit,
}: {
  content: Content;
  text: string;
  onEdit: () => void;
}) => {
  if (!text.trim()) {
    return (
      <button
        type="button"
        onClick={onEdit}
        className="w-full cursor-pointer rounded-[3px] border-2 border-dashed border-ink/15 px-6 py-10 text-sm text-ink/60 transition-colors duration-150 hover:border-ink/30 hover:text-ink"
      >
        {content.type === "task"
          ? "No details yet. Add steps, pages or links for this task."
          : "Nothing written yet. Click to start."}
      </button>
    );
  }

  return (
    <div
      onDoubleClick={onEdit}
      className={cn("reading", content.type !== "summarize" && "whitespace-pre-wrap")}
    >
      {content.type === "summarize" ? (
        <ReactMarkdown>{text}</ReactMarkdown>
      ) : (
        text
      )}
    </div>
  );
};

/**
 * A content opened as a sheet of paper: what it is and where it belongs,
 * the title, the due line for tasks, then the text to read or edit, and for
 * notes the tools that turn it into study material.
 */
const ShowContent = ({
  content,
  classLabel,
}: {
  content: Content;
  /** The class name, when the opener knows it (Today does). */
  classLabel?: string;
}) => {
  const [section, setSection] = useState<ViewType>("content");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

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

  const handleFileDeleted = (url: string) => {
    setFileUrls((prev) => prev.filter((item) => item !== url));
  };

  const editor = useContentText(content);
  const { isDone, toggle } = useToggleComplete();
  const { isPending: deleting, deleteContent } = useDeleteContent(content.id);

  if (deleting) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingScreen message="Deleting ..." />
      </div>
    );
  }

  const type = content.type;
  const isTask = type === "task";
  const isDiagram = type === "diagram" && content.ai_output != null;
  const done = isDone(content.id, content.is_completed);
  const label = CONTENT_LABELS[type].toLowerCase();

  // On a long note the tools sit below the fold; the footer brings them up.
  const showStudyTools = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById("study-tools")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const handleEditorKeys =(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      editor.save();
    }
    // Escape would close the whole modal and lose the draft, so it only
    // leaves edit mode, and only when there is nothing to lose.
    if (e.key === "Escape") {
      e.stopPropagation();
      if (!editor.isDirty) editor.cancel();
    }
  };

  return (
    <article className="relative flex min-h-full flex-col">
      <span
        aria-hidden
        className="sheet-tape"
        style={{ "--tape": `${typeColor(type)}d9` } as React.CSSProperties}
      />

      <header className="flex flex-col gap-4 px-6 pt-12 md:px-12 md:pt-14">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pr-8 text-xs text-ink/65">
          <ContentBadge type={type} />
          {classLabel && (
            <span className="font-semibold text-ink/80">{classLabel}</span>
          )}
          <span>Added {format(parseISO(content.created_at), "MMM d, yyyy")}</span>
        </div>

        <h2
          className={cn(
            "text-balance text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] md:text-[2.25rem]",
            done && "text-ink/55",
          )}
        >
          {content.title}
        </h2>

        {isTask && content.due_date && (
          <DueLine
            dueDate={content.due_date}
            priority={content.priority}
            done={done}
          />
        )}
      </header>

      <div className="mt-8 px-6 md:px-12">
        <SheetTabs
          value={section}
          onChange={setSection}
          contentLabel={isTask ? "Details" : CONTENT_LABELS[type]}
          attachments={fileUrls.length}
        />
      </div>

      <div role="tabpanel" className="flex-1 px-6 py-7 md:px-12">
        {section === "content" ? (
          <>
            {isDiagram ? (
              <DiagramPreview url={content.ai_output!} title={content.title} />
            ) : editor.isEditing ? (
              <textarea
                autoFocus
                aria-label={`Edit ${label}`}
                value={editor.draft}
                onChange={(e) => editor.setDraft(e.target.value)}
                onKeyDown={handleEditorKeys}
                className="reading block min-h-72 w-full resize-none rounded-[3px] border border-ink/20 bg-surface-muted/50 p-4 outline-none transition-[border-color,box-shadow] duration-150 [field-sizing:content] focus:border-ink/45 focus:ring-4 focus:ring-ring/15"
              />
            ) : (
              <ContentReader
                content={content}
                text={editor.savedText}
                onEdit={editor.startEditing}
              />
            )}

            {type === "note" && !editor.isEditing && (
              <StudyTools content={content} text={editor.savedText} />
            )}
          </>
        ) : (
          <Attachments
            files={fileUrls}
            isUploading={isUploading}
            onFilesAdded={handleFilesAdded}
            onFileDeleted={handleFileDeleted}
          />
        )}
      </div>

      <footer className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t border-ink/15 bg-surface px-6 py-4 md:px-12">
        {editor.isEditing ? (
          <>
            <span className="mr-auto hidden text-xs text-ink/60 sm:block">
              Ctrl or ⌘ + Enter saves
            </span>
            <PageButton light text="Cancel" onClick={editor.cancel} />
            <PageButton text="Save" icon={Check} onClick={editor.save} />
          </>
        ) : confirmingDelete ? (
          <>
            <p className="mr-auto text-sm font-semibold text-ink">
              Delete this {label}? This can&apos;t be undone.
            </p>
            <PageButton
              light
              text="Keep it"
              onClick={() => setConfirmingDelete(false)}
            />
            <button
              type="button"
              onClick={deleteContent}
              className="press cursor-pointer rounded-[3px] bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="press mr-auto inline-flex cursor-pointer items-center gap-1.5 rounded-[3px] px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-600/10"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>

            {section === "content" && !isDiagram && (
              <PageButton
                light
                text="Edit"
                icon={PenLine}
                onClick={editor.startEditing}
              />
            )}

            {type === "note" && section === "content" && (
              <PageButton
                text="Study tools"
                icon={Sparkles}
                onClick={showStudyTools}
              />
            )}

            {isTask && (
              <PageButton
                light={done}
                text={done ? "Reopen" : "Mark as done"}
                icon={done ? RotateCcw : Check}
                onClick={() => toggle(content.id, content.is_completed)}
              />
            )}
          </>
        )}
      </footer>
    </article>
  );
};

export default ShowContent;
