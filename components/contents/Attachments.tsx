import React from "react";
import { Loader2 } from "lucide-react";
import FilePreview from "../files/FilePreview";
import { getTitleByUrl } from "@/utils/fn";
import FileInput from "../files/FileInput";
import NoFilesContent from "../files/NoFilesContent";
import AddFilesButton from "../files/AddFilesButton";

const Attachments = ({
  files,
  isUploading,
  onFilesAdded,
}: {
  files: string[];
  isUploading?: boolean;
  onFilesAdded: (files: File[]) => void;
}) => {
  return (
    <>
      {isUploading && (
        <p className="mb-3 flex items-center gap-2 text-xs text-foreground/60">
          <Loader2 className="size-3.5 animate-spin" />
          Uploading files ...
        </p>
      )}
      {files.length === 0 ? (
        <FileInput onDrop={onFilesAdded}>
          <NoFilesContent />
        </FileInput>
      ) : (
        <div className="flex flex-wrap gap-2">
          {files.map((item) => (
            <FilePreview
              key={item}
              small
              url={item}
              title={getTitleByUrl(item)}
            />
          ))}
          <FileInput onDrop={onFilesAdded}>
            <AddFilesButton />
          </FileInput>
        </div>
      )}
    </>
  );
};

export default Attachments;
