import { pinFiles, pinLink } from "@/actions/pins/createPins";
import { useModal } from "@/providers/AppModalProvider";
import { useToast } from "@/providers/ToastProvider";
import { useTransition } from "react";

export const useCreatePin = (classId: string) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const { closeModal } = useModal();

  const run = (save: () => Promise<void>, success: string) => {
    startTransition(async () => {
      try {
        await save();
        closeModal();

        toast({ title: success, type: "success" });
      } catch (err) {
        console.log(err);

        toast({
          title: "Couldn't pin that",
          description:
            err instanceof Error ? err.message : "Please try again.",
          type: "error",
        });
      }
    });
  };

  const pinLinkFn = (url: string, title: string) =>
    run(() => pinLink(classId, url, title), "Link pinned");

  const pinFilesFn = (files: File[]) =>
    run(
      () => pinFiles(classId, files),
      files.length === 1 ? "File pinned" : `${files.length} files pinned`,
    );

  return { isPending, pinLinkFn, pinFilesFn };
};
