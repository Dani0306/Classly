import {
  FileText,
  FileType,
  Image as ImageGlyph,
  Paperclip,
  ExternalLink,
  X,
  Loader2,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DropDownMenu from "../shared/DropDownMenu";
import { DropDownMenuOptions } from "@/types";
import { useState } from "react";

export type FileMeta = { label: string; Icon: LucideIcon; color: string };

export const PDF_META: FileMeta = {
  label: "PDF",
  Icon: FileText,
  color: "text-red-500",
};

export const IMAGE_META: FileMeta = {
  label: "Image",
  Icon: ImageGlyph,
  color: "text-blue-500",
};

export const WORD_META: FileMeta = {
  label: "Word",
  Icon: FileType,
  color: "text-blue-700",
};

export const OTHER_META: FileMeta = {
  label: "File",
  Icon: Paperclip,
  color: "text-black/40",
};

/**
 * The card chrome shared by FilePreview and LocalFilePreview: tray, sheet,
 * info row, delete affordance and menu. It takes an already-resolved preview,
 * so neither variant has to repeat the layout.
 */
const FilePreviewCard = ({
  src,
  title,
  meta,
  preview,
  isPdf,
  author,
  options,
  small,
  removable,
  isPending,
  onDelete,
}: {
  src: string;
  title: string;
  meta: FileMeta;
  /** A rendered thumbnail (an image, a Word page). Without one, a PDF gets
   *  its embed and anything else a glyph. */
  preview?: React.ReactNode;
  isPdf?: boolean;
  author?: string;
  options?: DropDownMenuOptions;
  small?: boolean;
  removable?: boolean;
  isPending?: boolean;
  onDelete?: () => void;
}) => {
  const [showDeleteX, setShowDeleteX] = useState(false);

  const { label, Icon, color } = meta;

  const menuOptions: DropDownMenuOptions = options
    ? [
        {
          label: "Open file",
          icon: ExternalLink,
          fn: () => window.open(src, "_blank", "noopener,noreferrer"),
        },
        ...options,
      ]
    : [
        {
          label: "Open file",
          icon: ExternalLink,
          fn: () => window.open(src, "_blank", "noopener,noreferrer"),
        },
      ];

  return (
    <div
      onMouseOver={() => {
        if (removable) setShowDeleteX(true);
      }}
      onMouseLeave={() => {
        if (removable) setShowDeleteX(false);
      }}
      className={cn(
        "relative border border-black/10 bg-white shadow-sm",
        small ? "w-40 rounded-xl" : "w-full rounded-2xl",
      )}
    >
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
          onClick={onDelete}
          className="size-6 cursor-pointer bg-black/50 z-50 text-white p-1 rounded-full flex items-center justify-center absolute right-0 top-0"
        />
      )}

      {/* Preview — the document sits on a white sheet inside a soft tray */}
      <div
        className={cn(
          "rounded-t-[inherit] bg-black/2",
          small ? "p-1.5" : "p-4",
        )}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden bg-white shadow-sm",
            small ? "h-20 rounded-lg" : "h-60 rounded-xl",
          )}
        >
          {preview ? (
            preview
          ) : isPdf ? (
            <object
              // Hides the native viewer chrome so the embed reads as a thumbnail.
              data={`${src}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
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
            {title}
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

export default FilePreviewCard;
