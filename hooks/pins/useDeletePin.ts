import { deletePin } from "@/actions/pins/deletePin";
import { useToast } from "@/providers/ToastProvider";
import { useTransition } from "react";

export const useDeletePin = () => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const deletePinFn = (id: string) => {
    startTransition(async () => {
      try {
        await deletePin(id);
        toast({ title: "Unpinned", type: "success" });
      } catch (err) {
        console.log(err);

        toast({
          title: "Something went wrong",
          description: "Failed to unpin. Please try again.",
          type: "error",
        });
      }
    });
  };

  return { isPending, deletePinFn };
};
