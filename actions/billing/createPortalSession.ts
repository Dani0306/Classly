"use server";

import { getMySubscription } from "./getMySubscription";
import { paddle } from "@/lib/paddle/server";

/**
 * An authenticated link to Paddle's customer portal, where the user can
 * cancel, update their card and download invoices. Links expire, so one is
 * created per click and never stored.
 */
export const createPortalSession = async (): Promise<string> => {
  // Reads through the user's own session, so RLS scopes it to their rows.
  const subscription = await getMySubscription();

  if (!subscription) throw new Error("You don't have a subscription yet.");

  try {
    const session = await paddle.customerPortalSessions.create(
      subscription.customer_id,
      [subscription.subscription_id],
    );

    return session.urls.general.overview;
  } catch (error) {
    console.error("Failed creating Paddle portal session:", error);
    throw new Error("Couldn't open the billing portal. Please try again.");
  }
};
