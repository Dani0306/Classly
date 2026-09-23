import { useEffect, useState } from "react";
import { getMyAiUsage, type AiUsageSummary } from "@/actions/ai/getMyAiUsage";

/** Loads the user's AI allowances once, for showing limits before they hit one. */
export const useAiUsage = () => {
  const [usage, setUsage] = useState<AiUsageSummary | null>(null);

  useEffect(() => {
    let active = true;

    getMyAiUsage()
      .then((data) => {
        if (active) setUsage(data);
      })
      .catch(() => {
        // Limits are still enforced on the server; the hint is optional.
      });

    return () => {
      active = false;
    };
  }, []);

  return usage;
};
