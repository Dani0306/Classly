import { createContentByType } from "@/actions/contents/createContentByType";
import { useModal } from "@/providers/AppModalProvider";
import { useToast } from "@/providers/ToastProvider";
import { CreateContentInput } from "@/types";
import { CONTENT_LABELS } from "@/lib/contenttypes";
import { useTransition } from "react";

export const useCreateContent = () => {
  const [isPending, startTransition] = useTransition();
  const { closeModal } = useModal();
  const { toast } = useToast();

  const createContentFn = (input: CreateContentInput) => {
    const label = CONTENT_LABELS[input.type];

    startTransition(async () => {
      try {
        await createContentByType(input);

        toast({
          title: `${label} added`,
          type: "success",
        });
        closeModal();
      } catch (err) {
        // Plan limits explain themselves, so show the action's message when
        // there is one.
        toast({
          title: `Couldn't add the ${label.toLowerCase()}`,
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
