import Image from "next/image";
import { getTitleByUrl, isImageFile, isPdfFile } from "@/utils/fn";
import { DropDownMenuOptions } from "@/types";
import { Trash2 } from "lucide-react";
import { useDeleteFiles } from "@/hooks/files/useDeleteFiles";
import FilePreviewCard, {
  IMAGE_META,
  OTHER_META,
  PDF_META,
} from "./FilePreviewCard";

const getFileMeta = (url: string) => {
  if (isPdfFile(url)) return PDF_META;
  if (isImageFile(url)) return IMAGE_META;
  return OTHER_META;
};

/** Preview for a file already stored in the bucket, addressed by public URL. */
const FilePreview = ({
  url,
  title,
  author,
  options,
  small,
  deletable,
  onRemove,
  onDeleted,
}: {
  url: string;
  title?: string;
  author?: string;
  options?: DropDownMenuOptions;
  small?: boolean;
  deletable?: boolean;
  /** Takes over from the server delete when the parent owns removal. */
  onRemove?: () => void;
  /** Called after the server delete succeeds, to drop the URL from the list. */
  onDeleted?: (url: string) => void;
}) => {
  const { deleteFilesFn, isPending } = useDeleteFiles(onDeleted);

  const handleDelete = onRemove ?? (() => deleteFilesFn(url));

  const menuOptions: DropDownMenuOptions | undefined = deletable
    ? [
        ...(options ?? []),
        { label: "Delete file", icon: Trash2, fn: handleDelete },
      ]
    : options;

  const displayTitle = title?.trim() || getTitleByUrl(url);

  return (
    <FilePreviewCard
      src={url}
      title={displayTitle}
      meta={getFileMeta(url)}
      isPdf={isPdfFile(url)}
      image={
        isImageFile(url) ? (
          <Image src={url} alt={displayTitle} fill className="object-cover" />
        ) : undefined
      }
      author={author}
      options={menuOptions}
      small={small}
      removable={deletable}
      isPending={isPending}
      onDelete={handleDelete}
    />
  );
};

export default FilePreview;
