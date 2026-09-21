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
  children,
  setFiles,
  onDrop,
}: {
  /** Collects dropped files into a list the parent holds. */
  setFiles?: React.Dispatch<React.SetStateAction<Array<File>>>;
  /** Receives only the files from this drop — use it to act on each drop. */
  onDrop?: (files: File[]) => void;
  children: React.ReactNode;
}) {
  const { toast } = useToast();

  const handleDrop = (accepted: File[]) => {
    if (!accepted.length) return;

    onDrop?.(accepted);

    setFiles?.((prev) => [
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleReject,
    maxSize: MAX_FILE_SIZE,
    accept: ACCEPTED_TYPES,
  });

  return (
    <div
      {...getRootProps({ className: "dropzone" })}
      className="flex flex-col space-y-4"
    >
      <input {...getInputProps()} />
      {children}
    </div>
  );
}

export default FileInput;
