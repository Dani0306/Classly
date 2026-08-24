import { deleteContent } from "@/actions/contents/deleteContent";
import { useModal } from "@/providers/AppModalProvider";
import { useToast } from "@/providers/ToastProvider";
import { useTransition } from "react";

export const useDeleteContent = (id: string) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const { closeModal } = useModal();

  const deleteContentFn = () => {
    startTransition(async () => {
      try {
        await deleteContent(id);
        closeModal();

        toast({
          title: "Content deleted successfully!",
          type: "success",
        });
      } catch (err) {
        console.log(err);

        toast({
          title: "Something went wrong",
          description: "Failed to delete content.",
          type: "error",
        });
      }
    });
  };

  return { isPending, deleteContent: deleteContentFn };
};
