import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import LoadingScreen from "../loading/LoadingScreen";
import Input from "../shared/Input";
import ModalTitle from "../modal/ModalTitle";
import DatePicker from "../shared/DatePicker";
import SelectOptions from "../shared/SelectOptions";
import { ContentPriority, ViewType } from "@/types";
import { useCreateContent } from "@/hooks/contents/useCreateContent";
import { cn } from "@/lib/utils";
import { CONTENT_DESCRIPTIONS } from "@/lib/contentdescriptions";
import { CONTENT_LABELS, NewContentType } from "@/lib/contenttypes";
import { CONTENT_FORMS, ContentFormField, PRIORITIES } from "@/lib/contentforms";
import FileInput from "../files/FileInput";
import LocalFilePreview from "../files/LocalFilePreview";
import AllowanceNote from "./AllowanceNote";
import SheetTabs from "./SheetTabs";
import type { AiUsageSummary } from "@/actions/ai/getMyAiUsage";
import { useModal } from "@/providers/AppModalProvider";
import AddFilesButton from "../files/AddFilesButton";
import NoFilesContent from "../files/NoFilesContent";

const CreateContent = ({
  classId,
  contentType: type,
  usage,
}: {
  classId: string;
  contentType: NewContentType;
  usage: AiUsageSummary | null;
}) => {
  const { createContentFn, isPending } = useCreateContent();
  const { closeModal } = useModal();

  const [currentView, setCurrentView] = useState<ViewType>("content");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [polish, setPolish] = useState(true);
  const [files, setFiles] = useState<Array<File>>([]);

  const form = CONTENT_FORMS[type];
  const label = CONTENT_LABELS[type];

  // Only a note can spend an AI credit, and only when it is polished.
  const allowance = usage?.allowances.grammar;
  const outOfCredits =
    allowance?.limit != null && allowance.used >= allowance.limit;
  const spendsCredit = type === "note" && polish && !outOfCredits;

  const values: Record<ContentFormField, string> = {
    description: text,
    dueDate,
    priority,
  };

  const shows = (field: ContentFormField) => form.fields.includes(field);

  const canSubmit =
    title.trim() !== "" && form.required.every((field) => values[field] !== "");

  const handleCreate = () => {
    if (!canSubmit) return;

    createContentFn({
      files,
      type,
      classId,
      title,
      text,
      ...(type === "note" && { polish: spendsCredit }),
      ...(shows("dueDate") && { dueDate }),
      ...(shows("priority") && { priority: priority as ContentPriority }),
    });
  };

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingScreen
          message={spendsCredit ? "Polishing your note ..." : form.loadingMessage}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ModalTitle title={`New ${label}`} description={CONTENT_DESCRIPTIONS[type]} />

      <SheetTabs
        value={currentView}
        onChange={setCurrentView}
        contentLabel={label}
        attachments={files.length}
      />

      {currentView === "content" ? (
        <div className="flex flex-1 flex-col gap-4">
          <Input
            value={title}
            setValue={setTitle}
            label="Title"
            placeholder={type === "task" ? "e.g. Lab report" : "Title ..."}
            name="title"
          />

          {shows("dueDate") && shows("priority") && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <DatePicker
                value={dueDate}
                setValue={setDueDate}
                placeholder="Pick a day"
                label="Due date"
              />
              <SelectOptions
                name="priority"
                placeholder="Select priority"
                options={PRIORITIES}
                label="Priority"
                value={priority}
                setValue={setPriority}
              />
            </div>
          )}

          {shows("description") && (
            <Input
              value={text}
              setValue={setText}
              label={form.textLabel}
              placeholder={
                type === "task"
                  ? "Pages, steps, links ..."
                  : "Write or paste your note ..."
              }
              name="text"
              textarea
              rows={type === "task" ? 4 : 8}
            />
          )}

          {type === "note" && (
            <div className="flex flex-col gap-1.5">
              <label
                className={cn(
                  "flex w-fit items-center gap-2.5 text-sm font-medium text-foreground",
                  outOfCredits ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                )}
              >
                <input
                  type="checkbox"
                  checked={spendsCredit}
                  disabled={outOfCredits}
                  onChange={(e) => setPolish(e.target.checked)}
                  className="size-4 accent-ink"
                />
                <Sparkles className="size-3.5" />
                Fix spelling and grammar with AI
              </label>
              {(polish || outOfCredits) && (
                <div className="pl-6.5">
                  <AllowanceNote
                    kind="grammar"
                    allowance={allowance}
                    onNavigate={closeModal}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : files.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <LocalFilePreview
              onRemove={() => setFiles(files.filter((_, i) => i !== index))}
              key={index}
              deletable
              small
              file={file}
            />
          ))}
          <FileInput setFiles={setFiles}>
            <AddFilesButton />
          </FileInput>
        </div>
      ) : (
        <FileInput setFiles={setFiles}>
          <NoFilesContent />
        </FileInput>
      )}

      <button
        type="button"
        onClick={handleCreate}
        disabled={!canSubmit}
        className="press mb-8 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[3px] bg-note-lime py-3 text-sm font-semibold text-ink shadow-[0_1px_0_rgba(0,0,0,0.14),0_10px_18px_-10px_rgba(0,0,0,0.5)] hover:bg-[#b8f774] disabled:cursor-not-allowed disabled:bg-note-paper/60 disabled:text-ink/50 disabled:shadow-none lg:mb-0"
      >
        <Plus className="size-4" />
        <span>Add {label.toLowerCase()}</span>
      </button>
    </div>
  );
};

export default CreateContent;
