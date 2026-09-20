import { deleteFiles } from "@/actions/files/deleteFiles";
import { useTransition } from "react";

export const useDeleteFile = () => {
  const [isPending, startTransition] = useTransition();

  const deleteFileFn = (input: string) => {
    startTransition(async () => {
      try {
        await deleteFiles(input);
      } catch (err) {
        console.log(err);
      }
    });
  };

  return { isPending, deleteFileFn };
};
