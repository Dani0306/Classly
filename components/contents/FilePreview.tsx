import Image from "next/image";
import { Paperclip, ExternalLink } from "lucide-react";
import { getFileName, isImageFile, isPdfFile } from "@/utils/fn";

const FileLink = ({ url }: { url: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/5 p-4 transition-colors hover:bg-black/10"
  >
    <Paperclip className="size-5 shrink-0 text-black/50" />
    <span className="flex-1 truncate text-sm font-medium text-black/80">
      {getFileName(url)}
    </span>
    <ExternalLink className="size-4 shrink-0 text-black/50" />
  </a>
);

const FilePreview = ({ url, title }: { url: string; title: string }) => {
  if (isImageFile(url))
    return (
      <div className="relative w-full h-full min-h-75 overflow-hidden rounded-xl bg-black/5">
        <Image src={url} alt={title} fill className="object-contain" />
      </div>
    );

  if (isPdfFile(url))
    return (
      <object
        data={url}
        type="application/pdf"
        className="w-full h-full min-h-75 rounded-xl bg-black/5"
      >
        {/* Shown when the browser will not render the PDF inline. */}
        <FileLink url={url} />
      </object>
    );

  return <FileLink url={url} />;
};

export default FilePreview;
