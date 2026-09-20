import { useEffect, useMemo } from "react";
import { createLocalUrl, revokeLocalUrl } from "@/utils/fn";
import { DropDownMenuOptions } from "@/types";
import FilePreviewCard, {
  IMAGE_META,
  OTHER_META,
  PDF_META,
} from "./FilePreviewCard";

// A local file reports its own type, so nothing has to be read from the URL.
const getFileMetaByType = (type: string) => {
  if (type === "application/pdf") return PDF_META;
  if (type.startsWith("image/")) return IMAGE_META;
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
  const isImage = file.type.startsWith("image/");

  return (
    <FilePreviewCard
      src={localUrl}
      title={displayTitle}
      meta={getFileMetaByType(file.type)}
      isPdf={file.type === "application/pdf"}
      image={
        isImage ? (
          // next/image rejects blob: URLs, so a local preview stays an img.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={localUrl}
            alt={displayTitle}
            className="h-full w-full object-cover"
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
