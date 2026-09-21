import { useState } from "react";
import { CloudUpload, Plus } from "lucide-react";
import LoadingScreen from "../loading/LoadingScreen";
import Input from "../shared/Input";
import ModalTitle from "../modal/ModalTitle";
import DatePicker from "../shared/DatePicker";
import SelectOptions from "../shared/SelectOptions";
import ContentBadge from "./ContentBadge";
import { ContentPriority, ContentType, DiagramType, ViewType } from "@/types";
import { useCreateContent } from "@/hooks/contents/useCreateContent";
import { formatText } from "@/utils/fn";
import { cn } from "@/lib/utils";
import { CONTENT_TYPE_COLORS } from "@/lib/contentcolors";
import { CONTENT_DESCRIPTIONS } from "@/lib/contentdescriptions";
import {
  CONTENT_FORMS,
  ContentFormField,
  PRIORITIES,
  SUMMARY_SIZES,
} from "@/lib/contentforms";
import { diagramTypes } from "@/data/diagram/diagramTypes";
import FileInput from "../files/FileInput";
import { AttachmentsBadge } from "./ContentHeader";
import LocalFilePreview from "../files/LocalFilePreview";
import PageButton from "../shared/PageButton";
import AddFilesButton from "../files/AddFilesButton";
import NoFilesContent from "../files/NoFilesContent";

const CreateContent = ({
  classId,
  contentType,
}: {
  classId: string;
  contentType: ContentType;
}) => {
  const { createContentFn, isPending } = useCreateContent();

  const [currentView, setCurrentView] = useState<ViewType>("content");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [size, setSize] = useState("");
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");
  const [constraints, setConstraints] = useState("");
  const [files, setFiles] = useState<Array<File>>([]);

  if (contentType === "class") return null;

  const type = contentType;
  const form = CONTENT_FORMS[type];
  const colors = CONTENT_TYPE_COLORS[type];

  const values: Record<ContentFormField, string> = {
    description: text,
    dueDate,
    priority,
    size,
    diagramType,
    constraints,
  };

  const shows = (field: ContentFormField) => form.fields.includes(field);

  const canSubmit =
    title.trim() !== "" &&
    text.trim() !== "" &&
    form.required.every((field) => values[field] !== "");

  const handleCreate = () => {
    if (!canSubmit) return;

    createContentFn({
      files,
      type,
      classId,
      title,
      text,
      // * files_urls: files, --> todo
      ...(shows("dueDate") && { dueDate }),
      ...(shows("priority") && { priority: priority as ContentPriority }),
      ...(shows("size") && { size }),
      ...(shows("diagramType") && { diagramType }),
      ...(shows("constraints") && { constraints }),
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingScreen message={form.loadingMessage} />
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl flex flex-col space-y-6">
      <div className="flex flex-col space-y-3">
        <ModalTitle
          title={`New ${formatText(type)}`}
          description={CONTENT_DESCRIPTIONS[type]}
        />

        <div className="flex space-x-3">
          <ContentBadge onClick={() => setCurrentView("content")} type={type} />
          <AttachmentsBadge
            onClick={() => setCurrentView("attachments")}
            text="Add Atachments"
          />
        </div>
      </div>

      {currentView === "content" ? (
        <div className="flex flex-1 flex-col space-y-4 px-0">
          <Input
            value={title}
            setValue={setTitle}
            label="Title"
            placeholder="Title ..."
            name="title"
          />

          {shows("description") && (
            <Input
              value={text}
              setValue={setText}
              label={form.textLabel}
              placeholder={`${form.textLabel} ...`}
              name="text"
              textarea
              rows={shows("constraints") ? 4 : 8}
            />
          )}

          {shows("dueDate") && shows("priority") && (
            <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row items-center space-x-4">
              <DatePicker
                value={dueDate}
                setValue={setDueDate}
                placeholder={type === "homework" ? "Due date" : "Reminder date"}
                label={type === "homework" ? "Due date" : "Reminder date"}
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

          {shows("size") && (
            <SelectOptions
              name="size"
              placeholder="Medium (150-250 words)"
              options={SUMMARY_SIZES}
              label="Summary size"
              value={size}
              setValue={setSize}
            />
          )}

          {shows("constraints") && (
            <Input
              value={constraints}
              setValue={setConstraints}
              label="Instructions (optional)"
              placeholder="e.g. focus only on the main steps ..."
              name="constraints"
              textarea
              rows={3}
            />
          )}

          {shows("diagramType") && (
            <div className="flex flex-wrap gap-2">
              {diagramTypes.map((item) => {
                const selected = diagramType === item.type;

                return (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setDiagramType(item.type)}
                    className={cn(
                      "cursor-pointer px-4 py-1.5 text-xs font-medium rounded-xl border",
                      colors.border,
                      selected ? cn(colors.dark, "text-white") : colors.text,
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1 space-y-3">
          <div className="flex flex-col space-y-3">
            {files.length > 0 ? (
              <>
                <strong>Files uploaded: </strong>
                <div className="flex flex-wrap gap-2">
                  {files.map((file, index) => (
                    <LocalFilePreview
                      onRemove={() =>
                        setFiles(files.filter((_, i) => i !== index))
                      }
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
              </>
            ) : (
              <FileInput setFiles={setFiles}>
                <NoFilesContent />
              </FileInput>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleCreate}
        disabled={!canSubmit}
        className={cn(
          "w-full disabled:opacity-50 lg:mb-0 mb-8 py-2.5 text-white font-medium text-sm rounded-full flex space-x-1.5 items-center justify-center hover:opacity-80 transition-all duration-300 cursor-pointer",
          colors.dark,
        )}
      >
        <Plus className="size-4 text-white" />
        <span>Create {formatText(type)}</span>
      </button>
    </div>
  );
};

export default CreateContent;
