import { cn } from "@/lib/utils";
import { File as FileIcon, Folder, Image } from "lucide-react";
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
  setFiles,
}: {
  setFiles: React.Dispatch<React.SetStateAction<Array<File>>>;
}) {
  const { toast } = useToast();

  const handleDrop = (accepted: File[]) => {
    if (!accepted.length) return;

    setFiles((prev) => [
      ...prev,
      ...accepted.filter(
        (file) => !prev.find((item) => item.name === file.name),
      ),
    ]);
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
    maxSize: MAX_FILE_SIZE,
    accept: ACCEPTED_TYPES,
  });

  return (
    <div className="flex flex-col">
      <div
        {...getRootProps({ className: "dropzone" })}
        className={cn(
          "flex-col border-2 border-dashed border-primary min-h-50 flex items-center justify-center",
          isDragActive && "opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <p className="text-gray-400 text-sm">
          {isDragActive
            ? "Drop the files here to upload them"
            : "Drag and drop the files here, or click to select them ."}
        </p>
        <div className="flex mt-4">
          {/* eslint-disable-next-line */}
          <Image className="size-6 text-gray-400" />
          <FileIcon className="size-6 text-gray-400" />
          <Folder className="size-6 text-gray-400" />
        </div>
      </div>
      <aside></aside>
    </div>
  );
}

export default FileInput;
