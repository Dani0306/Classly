import { useEffect, useMemo } from "react";
import { createLocalUrl, revokeLocalUrl } from "@/utils/fn";
import { DOC_MIME_TYPE, DOCX_MIME_TYPE, resolveMimeType } from "@/lib/storage";
import { DropDownMenuOptions } from "@/types";
import FilePreviewCard, {
  IMAGE_META,
  OTHER_META,
  PDF_META,
  WORD_META,
} from "./FilePreviewCard";
import WordThumbnail from "./WordThumbnail";

// A local file reports its own type, so nothing has to be read from the URL.
const getFileMetaByType = (type: string) => {
  if (type === "application/pdf") return PDF_META;
  if (type.startsWith("image/")) return IMAGE_META;
  if (type === DOCX_MIME_TYPE || type === DOC_MIME_TYPE) return WORD_META;
  return OTHER_META;
};

/** Preview for a file picked but not uploaded yet, shown from an object URL. */
const LocalFilePreview = ({
  file,
  title,
  author,
  options,
  small,
  deletable,
  onRemove,
}: {
  file: File;
  title?: string;
  author?: string;
  options?: DropDownMenuOptions;
  small?: boolean;
  deletable?: boolean;
  /** Nothing is stored yet, so removal is always the parent's to handle. */
  onRemove?: () => void;
}) => {
  const localUrl = useMemo(() => createLocalUrl(file), [file]);

  // Frees the blob as soon as this preview is replaced or unmounted.
  useEffect(() => {
    return () => revokeLocalUrl(localUrl);
  }, [localUrl]);

  const displayTitle = title?.trim() || file.name;
  // Word files often arrive with an empty type, so fall back to the name.
  const type = resolveMimeType(file);
  const isImage = type.startsWith("image/");
  const isWord = type === DOCX_MIME_TYPE || type === DOC_MIME_TYPE;

  return (
    <FilePreviewCard
      src={localUrl}
      title={displayTitle}
      meta={getFileMetaByType(type)}
      isPdf={type === "application/pdf"}
      preview={
        isImage ? (
          // next/image rejects blob: URLs, so a local preview stays an img.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={localUrl}
            alt={displayTitle}
            className="h-full w-full object-cover"
          />
        ) : isWord ? (
          <WordThumbnail
            src={localUrl}
            renderable={type === DOCX_MIME_TYPE}
          />
        ) : undefined
      }
      author={author}
      options={options}
      small={small}
      removable={deletable && Boolean(onRemove)}
      onDelete={onRemove}
    />
  );
};

export default LocalFilePreview;
