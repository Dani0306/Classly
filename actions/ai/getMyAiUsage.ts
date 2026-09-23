"use server";

import { AI_KINDS, AiKind } from "@/lib/ai/kinds";
import { Plan } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";

export type AiAllowance = {
  used: number;
  /** null is unlimited; 0 means the plan doesn't include it. */
  limit: number | null;
};

export type AiUsageSummary = {
  plan: Plan;
  allowances: Record<AiKind, AiAllowance>;
  /** First day of next month, when the counters reset. */
  resetsOn: string;
};

const startOfThisMonth = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
};

const startOfNextMonth = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
};

/** This month's AI usage and what the user's plan allows. */
export const getMyAiUsage = async (): Promise<AiUsageSummary> => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const [{ data: profile }, { data: limits }, { data: usage }] =
    await Promise.all([
      supabase.from("users").select("plan").eq("id", user.id).maybeSingle(),
      supabase.from("plan_limits").select("plan, kind, monthly_limit"),
      supabase
        .from("ai_usage")
        .select("kind")
        .eq("user_id", user.id)
        .gte("created_at", startOfThisMonth().toISOString()),
    ]);

  const plan = (profile?.plan as Plan) ?? "starter";

  const allowances = Object.fromEntries(
    AI_KINDS.map((kind) => [
      kind,
      {
        used: (usage ?? []).filter((row) => row.kind === kind).length,
        limit:
          (limits ?? []).find(
            (row) => row.plan === plan && row.kind === kind,
          )?.monthly_limit ?? null,
      },
    ]),
  ) as Record<AiKind, AiAllowance>;

  return {
    plan,
    allowances,
    resetsOn: startOfNextMonth().toISOString(),
  };
};
