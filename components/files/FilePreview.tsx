import Image from "next/image";
import { getTitleByUrl, isImageFile, isPdfFile } from "@/utils/fn";
import { DropDownMenuOptions } from "@/types";
import { useDeleteFile } from "@/hooks/files/useDeleteFile";
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
}: {
  url: string;
  title?: string;
  author?: string;
  options?: DropDownMenuOptions;
  small?: boolean;
  deletable?: boolean;
  /** Takes over from the server delete when the parent owns removal. */
  onRemove?: () => void;
}) => {
  const { deleteFileFn, isPending } = useDeleteFile();

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
      options={options}
      small={small}
      removable={deletable}
      isPending={isPending}
      onDelete={onRemove ?? (() => deleteFileFn(url))}
    />
  );
};

export default FilePreview;
