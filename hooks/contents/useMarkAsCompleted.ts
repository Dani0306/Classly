import { modifyContent } from "@/actions/contents/modifyContent";
import { useModal } from "@/providers/AppModalProvider";
import { useToast } from "@/providers/ToastProvider";
import { useTransition } from "react";

export const useMarkAsCompleted = (isCompleted: boolean, id: string) => {
  const { closeModal } = useModal();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const markAsCompleted = () => {
    startTransition(async () => {
      try {
        await modifyContent({ is_completed: isCompleted ? false : true }, id);
        toast({
          type: "success",
          title: "Content status modified successfully",
        });
        closeModal();
      } catch {
        toast({
          type: "error",
          title: "Error marking modifying content status.",
        });
      }
    });
  };

  return { isPending, markAsCompleted };
};
