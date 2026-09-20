import Image from "next/image";
import {
  FileText,
  Image as ImageGlyph,
  Paperclip,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react";
import { getTitleByUrl, isImageFile, isPdfFile } from "@/utils/fn";
import { cn } from "@/lib/utils";
import DropDownMenu from "../shared/DropDownMenu";
import { DropDownMenuOptions } from "@/types";
import { useState } from "react";
import { useDeleteFile } from "@/hooks/files/useDeleteFile";

const getFileMeta = (url: string) => {
  if (isPdfFile(url))
    return { label: "PDF", Icon: FileText, color: "text-red-500" };

  if (isImageFile(url))
    return { label: "Image", Icon: ImageGlyph, color: "text-blue-500" };

  return { label: "File", Icon: Paperclip, color: "text-black/40" };
};

const FilePreview = ({
  url,
  title,
  author,
  options,
  small,
  deletable,
}: {
  url: string;
  title: string;
  author?: string;
  options?: DropDownMenuOptions;
  small?: boolean;
  deletable?: boolean;
}) => {
  const { label, Icon, color } = getFileMeta(url);

  const displayTitle = title?.trim() || getTitleByUrl(url);
  const [showDeleteX, setShowDeleteX] = useState(false);

  const { deleteFileFn, isPending } = useDeleteFile();

  const menuOptions: DropDownMenuOptions = options ?? [
    {
      label: "Open file",
      icon: ExternalLink,
      fn: () => window.open(url, "_blank", "noopener,noreferrer"),
    },
  ];

  const handleDeleteFile = () => {
    deleteFileFn(url);
  };

  return (
    <div
      onMouseOver={() => {
        if (deletable) setShowDeleteX(true);
      }}
      onMouseLeave={() => {
        if (deletable) setShowDeleteX(false);
      }}
      className={cn(
        "overflow-hidden relative border border-black/10 bg-white shadow-sm",
        small ? "w-40 rounded-xl" : "w-full rounded-2xl",
      )}
    >
      {/* Preview — the document sits on a white sheet inside a soft tray */}

      {isPending && (
        <div className="absolute inset-0 z-50 grid place-items-center rounded-[inherit] bg-white/70 backdrop-blur-[1px]">
          <Loader2
            className={cn(
              "animate-spin text-black/40",
              small ? "size-4" : "size-6",
            )}
          />
        </div>
      )}

      {showDeleteX && !isPending && (
        <X
          onClick={handleDeleteFile}
          className="size-6 cursor-pointer bg-black/50 z-50 text-white p-1 rounded-full flex items-center justify-center absolute right-0 top-0"
        />
      )}

      <div className={cn("bg-black/2", small ? "p-1.5" : "p-4")}>
        <div
          className={cn(
            "relative w-full overflow-hidden bg-white shadow-sm",
            small ? "h-20 rounded-lg" : "h-60 rounded-xl",
          )}
        >
          {isImageFile(url) ? (
            <Image src={url} alt={displayTitle} fill className="object-cover" />
          ) : isPdfFile(url) ? (
            <object
              // Hides the native viewer chrome so the embed reads as a thumbnail.
              data={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              type="application/pdf"
              className="pointer-events-none h-full w-full"
            >
              <div className="grid h-full w-full place-items-center">
                <FileText className="size-8 text-black/20" />
              </div>
            </object>
          ) : (
            <div className="grid h-full w-full place-items-center">
              <Paperclip className="size-8 text-black/20" />
            </div>
          )}
        </div>
      </div>

      {/* Info row */}
      <div
        className={cn(
          "flex items-center",
          small ? "gap-1.5 px-2 py-1.5" : "gap-3 px-4 py-3.5",
        )}
      >
        <Icon className={cn("shrink-0", color, small ? "size-4" : "size-8")} />

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate font-semibold text-foreground",
              small ? "text-[11px] leading-tight" : "text-[15px]",
            )}
          >
            {displayTitle}
          </p>
          <p
            className={cn(
              "truncate font-light text-muted-foreground",
              small ? "text-[9px] leading-tight" : "text-xs",
            )}
          >
            {author ? `${label} • ${author}` : label}
          </p>
        </div>

        <DropDownMenu options={menuOptions} />
      </div>
    </div>
  );
};

export default FilePreview;
