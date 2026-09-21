import { Content } from "@/types";
import { cn } from "@/lib/utils";
import { Check, RefreshCcw } from "lucide-react";
import { ContentTextEditor } from "@/hooks/contents/useContentText";

const ContentFooter = ({
  content,
  editor,
  completed,
  markAsCompleted,
  deleteContent,
}: {
  content: Content;
  editor: ContentTextEditor;
  completed: boolean;
  markAsCompleted: () => void;
  deleteContent: () => void;
}) => {
  const type = content.type;
  const isScheduled = type === "homework" || type === "reminder";

  return (
    <div className="shrink-0 flex items-center gap-3">
      {isScheduled && (
        <>
          <button
            onClick={markAsCompleted}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-xl text-[13px] font-semibold py-3 transition-colors cursor-pointer",
              completed
                ? "border border-emerald-600 text-green-900 bg-emerald-200 hover:bg-emerald-300"
                : "bg-black/5 text-black/70 hover:bg-black/10",
            )}
          >
            {completed && <Check className="size-4" />}
            {completed ? "Completed" : "Mark as complete"}
          </button>

          {completed && (
            <button
              onClick={markAsCompleted}
              className="text-[13px] font-medium bg-black/5 hover:bg-black/10 rounded-lg px-4 py-3 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCcw className="size-3.5" />
              Reopen
            </button>
          )}
        </>
      )}

      <button
        onClick={() => {
          if (!editor.isDirty) editor.startEditing();
        }}
        className={cn(
          "text-[13px] font-medium rounded-lg px-4 py-3 transition-colors cursor-pointer",
          editor.isDirty
            ? "text-emerald-900 bg-emerald-100 hover:bg-emerald-200"
            : "text-black/80 bg-black/5 hover:bg-black/10",
        )}
      >
        {editor.isDirty ? "Save" : "Edit"}
      </button>

      <button
        onClick={deleteContent}
        className="text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg px-3 py-3 transition-colors cursor-pointer"
      >
        Delete
      </button>
    </div>
  );
};

export default ContentFooter;
