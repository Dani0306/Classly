"use server";

import { BillingSubscription } from "@/types";
import { createServerSupabase } from "@/utils/supabase/server";

const ACTIVE_STATUSES = ["active", "trialing", "past_due"];

/**
 * The user's current subscription: an active one if there is any, otherwise
 * the most recently updated. null for users who never subscribed.
 */
export const getMySubscription =
  async (): Promise<BillingSubscription | null> => {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not found.");

    const { data, error } = await supabase
      .from("paddle_subscriptions")
      .select(
        "subscription_id, customer_id, status, current_period_ends_at, scheduled_change_action, scheduled_change_at",
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw new Error("Failed getting your subscription.");

    const rows = (data ?? []) as BillingSubscription[];

    return (
      rows.find((row) => ACTIVE_STATUSES.includes(row.status)) ??
      rows[0] ??
      null
    );
  };
