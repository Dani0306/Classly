import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckoutEventNames } from "@paddle/paddle-js";
import { getMySubscription } from "@/actions/billing";
import { loadPaddle } from "@/lib/paddle/client";
import { useToast } from "@/providers/ToastProvider";

const POLL_INTERVAL_MS = 2000;
const POLL_ATTEMPTS = 15;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Opens Paddle Checkout for Pro. The plan itself changes only when Paddle's
 * webhook arrives, so after payment this polls until the subscription shows
 * up, then refreshes the page.
 */
export const useUpgradeToPro = ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpening, startOpening] = useTransition();
  const [isActivating, setIsActivating] = useState(false);

  // Fetch Paddle.js ahead of the click so the checkout opens quickly.
  useEffect(() => {
    loadPaddle().catch(() => {});
  }, []);

  const waitForActivation = async () => {
    setIsActivating(true);

    for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
      await wait(POLL_INTERVAL_MS);

      const subscription = await getMySubscription().catch(() => null);

      if (
        subscription &&
        ["active", "trialing", "past_due"].includes(subscription.status)
      ) {
        setIsActivating(false);
        toast({ type: "success", title: "Welcome to Pro!" });
        router.refresh();
        return;
      }
    }

    setIsActivating(false);
    toast({
      type: "success",
      title: "Payment received",
      description: "Your plan will switch to Pro in a moment.",
    });
    router.refresh();
  };

  const upgrade = () => {
    startOpening(async () => {
      const priceId = process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID;
      const paddle = await loadPaddle().catch(() => undefined);

      if (!paddle || !priceId) {
        toast({
          type: "error",
          title: "Payments aren't available right now",
          description: "Please try again later.",
        });
        return;
      }

      paddle.Update({
        eventCallback: (event) => {
          if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED)
            void waitForActivation();

          // Paddle's own modal only says "Something went wrong"; the event
          // carries the actual reason (bad price id, no default payment
          // link, sandbox/live mismatch, ...).
          if (
            event.name === CheckoutEventNames.CHECKOUT_ERROR ||
            event.type === "checkout.warning"
          ) {
            console.error("Paddle checkout error:", event);

            if (event.name === CheckoutEventNames.CHECKOUT_ERROR)
              toast({
                type: "error",
                title: "Checkout couldn't open",
                description: event.detail ?? event.code ?? "Unknown error",
              });
          }
        },
      });

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        // Links the subscription to this account in the webhook.
        customData: { user_id: userId },
        customer: { email },
        settings: {
          displayMode: "overlay",
          theme: "light",
          allowLogout: false,
        },
      });
    });
  };

  return { upgrade, isOpening, isActivating };
};
