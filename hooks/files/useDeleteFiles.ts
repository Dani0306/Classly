import { deleteFiles } from "@/actions/files/deleteFiles";
import { useToast } from "@/providers/ToastProvider";
import { useTransition } from "react";

/**
 * onDeleted runs after a successful delete, so a parent holding the file list
 * in local state (a modal, which revalidatePath can't reach) can drop the URL.
 */
export const useDeleteFiles = (onDeleted?: (url: string) => void) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const deleteFilesFn = (url: string) => {
    startTransition(async () => {
      try {
        await deleteFiles(url);
        onDeleted?.(url);

        toast({
          title: "File deleted successfully!",
          type: "success",
        });
      } catch (err) {
        console.log(err);

        toast({
          title: "Something went wrong",
          description:
            err instanceof Error ? err.message : "Failed to delete the file.",
          type: "error",
        });
      }
    });
  };

  return { isPending, deleteFilesFn };
};
