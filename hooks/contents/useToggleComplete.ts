import { modifyContent } from "@/actions/contents/modifyContent";
import { useToast } from "@/providers/ToastProvider";
import { useState, useTransition } from "react";

/**
 * Ticks tasks off in place. The checkbox flips at once and flips back with a
 * toast if the save fails, so ticking never waits on the network.
 */
export const useToggleComplete = () => {
  const { toast } = useToast();
  const [, startTransition] = useTransition();
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const isDone = (id: string, saved?: boolean | null) =>
    overrides[id] ?? saved ?? false;

  const toggle = (id: string, saved?: boolean | null) => {
    const next = !isDone(id, saved);
    setOverrides((prev) => ({ ...prev, [id]: next }));

    startTransition(async () => {
      try {
        await modifyContent({ is_completed: next }, id);
      } catch {
        setOverrides((prev) => ({ ...prev, [id]: !next }));
        toast({
          type: "error",
          title: "Couldn't update the task",
          description: "Check your connection and try again.",
        });
      }
    });
  };

  /** Ticked or unticked in this session, so it can stay where it was. */
  const touched = (id: string) => id in overrides;

  return { isDone, toggle, touched };
};
