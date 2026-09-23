import "server-only";

import { AI_KIND_LABELS, AiKind } from "@/lib/ai/kinds";
import { createServerSupabase } from "@/utils/supabase/server";

const messageFor = (kind: AiKind, reason: string) => {
  const label = AI_KIND_LABELS[kind];

  if (reason.includes("feature_not_in_plan"))
    return `${label[0].toUpperCase()}${label.slice(1)} are only available on Pro. Upgrade in Settings to use them.`;

  if (reason.includes("monthly_limit_reached"))
    return `You've used all your ${label} for this month. Upgrade to Pro in Settings for more.`;

  if (reason.includes("daily_limit_reached"))
    return "You've reached today's generation limit. Please try again tomorrow.";

  return "Couldn't check your plan's limits. Please try again.";
};

/**
 * Records one generation against the user's allowance before the AI call, so
 * concurrent requests can't overshoot it. Returns the usage id to hand to
 * refundAiCredit if the generation then fails.
 */
export const consumeAiCredit = async (kind: AiKind): Promise<string> => {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.rpc("consume_ai_credit", {
    p_kind: kind,
  });

  if (error) throw new Error(messageFor(kind, error.message));

  return data as string;
};

/** Returns a credit after a failed generation; never throws. */
export const refundAiCredit = async (usageId: string) => {
  try {
    const supabase = await createServerSupabase();

    const { error } = await supabase.rpc("refund_ai_credit", {
      p_usage_id: usageId,
    });

    if (error) console.error("Failed refunding AI credit:", error);
  } catch (error) {
    console.error("Failed refunding AI credit:", error);
  }
};
