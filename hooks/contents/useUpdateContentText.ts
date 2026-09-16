import { modifyContent } from "@/actions/contents/modifyContent";
import { useToast } from "@/providers/ToastProvider";
import { useTransition } from "react";

export const useUpdateContentText = (
  id: string,
  field: "content" | "ai_output",
) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const updateText = (value: string) => {
    startTransition(async () => {
      try {
        await modifyContent({ [field]: value }, id);
      } catch {
        toast({
          type: "error",
          title: "Failed to update content.",
        });
      }
    });
  };

  return { isPending, updateText };
};
