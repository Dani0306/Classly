import { createContentByType } from "@/actions/contents/createContentByType";
import { useModal } from "@/providers/AppModalProvider";
import { useToast } from "@/providers/ToastProvider";
import { CreateContentInput } from "@/types";
import { formatText } from "@/utils/fn";
import { useTransition } from "react";

export const useCreateContent = () => {
  const [isPending, startTransition] = useTransition();
  const { closeModal } = useModal();
  const { toast } = useToast();

  const createContentFn = (input: CreateContentInput) => {
    startTransition(async () => {
      try {
        await createContentByType(input);

        toast({
          title: `${formatText(input.type)} created successfully!`,
          type: "success",
        });
        closeModal();
      } catch (err) {
        // Plan limits explain themselves, so show the action's message when
        // there is one.
        toast({
          title: `Failed creating ${formatText(input.type)}`,
          description:
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.",
          type: "error",
        });
      }
    });
  };

  return { isPending, createContentFn };
};
