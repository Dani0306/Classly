import { CloudUpload } from "lucide-react";

const NoFilesContent = () => {
  return (
    <div className="w-full min-h-60 flex flex-col space-y-6 items-center justify-center">
      <p className="text-sm text-foreground font-extralight">
        No files yet, drop your files or click here to add one.
      </p>
      <CloudUpload className="text-gray-400 size-12" />
    </div>
  );
};

export default NoFilesContent;
