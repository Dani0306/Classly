import { uploadFile } from "@/actions/contents/uploadFile";
import { cn } from "@/lib/utils";
// Aliased: the lucide `File` icon would otherwise shadow the global File type.
import { File as FileIcon, Folder, Image } from "lucide-react";
import { useState, useTransition } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useToast } from "@/providers/ToastProvider";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Mirrors ALLOWED_MIME_TYPES in the uploadFile action, so the picker rejects
// what the server would reject anyway.
const ACCEPTED_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "application/pdf": [".pdf"],
};

function FileInput({
  setFile,
}: {
  setFile: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [fileName, setFileName] = useState<string>("");

  const handleDrop = (accepted: File[]) => {
    const selected = accepted[0];

    if (!selected) return;

    setFileName(selected.name);

    startTransition(async () => {
      try {
        const fileUrl = await uploadFile(selected);
        setFile(fileUrl);
      } catch (error) {
        setFileName("");
        setFile("");

        toast({
          title: "Something went wrong",
          description:
            error instanceof Error
              ? error.message
              : "Failed uploading the file. Please try again.",
          type: "error",
        });
      }
    });
  };

  const handleReject = (rejections: FileRejection[]) => {
    toast({
      title: "That file cannot be uploaded",
      description:
        rejections[0]?.errors[0]?.message ??
        "Only images and PDFs up to 5MB are supported.",
      type: "error",
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleReject,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    accept: ACCEPTED_TYPES,
  });

  return (
    <div className="flex flex-col">
      <div
        {...getRootProps({ className: "dropzone" })}
        className={cn(
          "flex-col border-2 border-dashed border-primary min-h-40 flex items-center justify-center",
          isDragActive && "opacity-50",
        )}
      >
        <input {...getInputProps()} />
        {isPending ? (
          <p className="text-gray-400 text-sm">Uploading file ...</p>
        ) : (
          <>
            <p className="text-gray-400 text-sm">
              {isDragActive
                ? "Drop the file here to upload it"
                : "Drag and drop a file here, or click to select one"}
            </p>
            <div className="flex mt-4">
              {/* eslint-disable-next-line */}
              <Image className="size-6 text-gray-400" />
              <FileIcon className="size-6 text-gray-400" />
              <Folder className="size-6 text-gray-400" />
            </div>
          </>
        )}
      </div>
      <aside>
        {fileName && !isPending && (
          <p className="mt-2 truncate text-xs text-foreground/60">
            Uploaded: <strong className="font-medium">{fileName}</strong>
          </p>
        )}
      </aside>
    </div>
  );
}

export default FileInput;
