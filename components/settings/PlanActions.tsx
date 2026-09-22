"use client";

import { format } from "date-fns";
import { CreditCard, Rocket } from "lucide-react";
import { BillingSubscription, Plan } from "@/types";
import { useUpgradeToPro } from "@/hooks/billing/useUpgradeToPro";
import { useBillingPortal } from "@/hooks/billing/useBillingPortal";
import PageButton from "../shared/PageButton";

const formatDate = (value: string | null) =>
  value ? format(new Date(value), "MMM d, yyyy") : null;

/** What the Pro card says about billing, from the cached subscription. */
const getStatusMessage = (subscription: BillingSubscription | null) => {
  if (!subscription) return null;

  if (subscription.status === "past_due")
    return "Your last payment failed. Update your payment method to keep Pro.";

  if (subscription.scheduled_change_action === "cancel") {
    const endsOn = formatDate(subscription.scheduled_change_at);
    return endsOn
      ? `Pro ends on ${endsOn}. You'll move to Starter after that.`
      : "Pro is set to cancel at the end of this billing period.";
  }

  const renewsOn = formatDate(subscription.current_period_ends_at);
  return renewsOn ? `Renews on ${renewsOn}.` : null;
};

/** Upgrade button for Starter users; billing status and portal for Pro. */
const PlanActions = ({
  plan,
  subscription,
  userId,
  email,
}: {
  plan: Plan;
  subscription: BillingSubscription | null;
  userId: string;
  email: string;
}) => {
  const { upgrade, isOpening, isActivating } = useUpgradeToPro({
    userId,
    email,
  });
  const { openPortal, isPending: isOpeningPortal } = useBillingPortal();

  if (plan === "pro") {
    const message = getStatusMessage(subscription);

    return (
      <div className="flex flex-col gap-3">
        {message && (
          <p
            className={
              subscription?.status === "past_due"
                ? "text-xs font-medium text-red-600"
                : "text-xs font-light text-foreground/60"
            }
          >
            {message}
          </p>
        )}
        <PageButton
          light
          text={isOpeningPortal ? "Opening ..." : "Manage subscription"}
          icon={CreditCard}
          onClick={openPortal}
          disabled={isOpeningPortal || !subscription}
        />
      </div>
    );
  }

  return (
    <PageButton
      text={
        isActivating
          ? "Activating Pro ..."
          : isOpening
            ? "Opening checkout ..."
            : "Upgrade to Pro"
      }
      icon={Rocket}
      onClick={upgrade}
      disabled={isOpening || isActivating}
    />
  );
};

export default PlanActions;
