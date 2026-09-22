import { NextResponse } from "next/server";
import {
  EventName,
  type SubscriptionCreatedNotification,
  type SubscriptionNotification,
} from "@paddle/paddle-node-sdk";
import { paddle } from "@/lib/paddle/server";
import { createAdminSupabase } from "@/utils/supabase/admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Receives Paddle notifications. The signature is verified against the raw
 * body before anything is trusted; subscription events are then cached in
 * paddle_subscriptions, whose trigger keeps users.plan in sync.
 *
 * Paddle retries anything that isn't a 2xx, so a 500 is returned only for
 * failures worth retrying (a database error), never for an event that can't
 * be linked to a user.
 */
export async function POST(request: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("PADDLE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const signature = request.headers.get("paddle-signature");

  if (!signature)
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  // The signature covers the exact bytes Paddle sent, so read the raw text
  // rather than parsed JSON.
  const rawBody = await request.text();

  let event;

  try {
    event = await paddle.webhooks.unmarshal(rawBody, secret, signature);
  } catch (error) {
    console.error("Invalid Paddle webhook signature:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
        await syncSubscription(event.data);
        break;

      // transaction.completed and anything else: subscription events already
      // carry the state the app needs.
      default:
        break;
    }
  } catch (error) {
    console.error(`Failed handling Paddle ${event.eventType}:`, error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

const syncSubscription = async (
  subscription: SubscriptionCreatedNotification | SubscriptionNotification,
) => {
  const supabase = createAdminSupabase();

  // The first event links a subscription to a user through the user_id the
  // checkout sent as customData; after that the stored owner is authoritative.
  const { data: existing, error: existingError } = await supabase
    .from("paddle_subscriptions")
    .select("user_id")
    .eq("subscription_id", subscription.id)
    .maybeSingle();

  if (existingError) throw existingError;

  let userId: string | null = existing?.user_id ?? null;

  if (!userId) {
    const candidate = subscription.customData?.user_id;

    if (typeof candidate !== "string" || !UUID_PATTERN.test(candidate)) {
      console.error(
        `Paddle subscription ${subscription.id} has no valid user_id in custom data.`,
      );
      return;
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", candidate)
      .maybeSingle();

    if (userError) throw userError;

    if (!user) {
      console.error(
        `Paddle subscription ${subscription.id} points to unknown user ${candidate}.`,
      );
      return;
    }

    userId = user.id;
  }

  const item = subscription.items[0];

  const { error } = await supabase.rpc("upsert_paddle_subscription", {
    p_subscription_id: subscription.id,
    p_user_id: userId,
    p_customer_id: subscription.customerId,
    p_status: subscription.status,
    p_price_id: item?.price?.id ?? null,
    p_product_id: item?.price?.productId ?? null,
    p_current_period_ends_at: subscription.currentBillingPeriod?.endsAt ?? null,
    p_scheduled_change_action: subscription.scheduledChange?.action ?? null,
    p_scheduled_change_at: subscription.scheduledChange?.effectiveAt ?? null,
    p_paddle_updated_at: subscription.updatedAt,
  });

  if (error) throw error;
};
