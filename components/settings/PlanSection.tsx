import { PLANS } from "@/data/settings/plans";
import { BillingSubscription, Plan } from "@/types";
import { cn } from "@/lib/utils";
import SettingsSection from "./SettingsSection";
import { Sparkles, Check } from "lucide-react";
import PlanActions from "./PlanActions";

const PlanSection = ({
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
  return (
    <SettingsSection
      title="Plan"
      description="Your current subscription and what each plan includes."
      icon={Sparkles}
    >
      <div className="flex flex-col gap-4 md:flex-row">
        {PLANS.map(
          ({
            plan: value,
            label,
            price,
            billing,
            description,
            icon: Icon,
            features,
          }) => {
            const current = value === plan;

            return (
              <div
                key={value}
                className={cn(
                  "flex flex-1 flex-col space-y-4 rounded-2xl border p-5 transition-all duration-200",
                  current
                    ? "border-primary/50 bg-surface-green/50 ring-4 ring-primary/10"
                    : "border-border bg-surface-muted",
                )}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={cn(
                      "size-5",
                      current ? "text-green-700" : "text-muted-foreground/60",
                    )}
                  />
                  {current && (
                    <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <strong className="text-sm font-semibold text-foreground">
                    {label}
                  </strong>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-foreground">
                      {price}
                    </span>
                    <span className="text-[11px] font-light text-foreground/50">
                      {billing}
                    </span>
                  </div>
                  <p className="text-xs font-light text-foreground/60">
                    {description}
                  </p>
                </div>

                <ul className="flex flex-col gap-2">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs font-light text-foreground/70"
                    >
                      <Check className="mt-0.5 size-3 shrink-0 text-green-700" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Billing lives on the Pro card: upgrade into it, or manage
                    it (cancel returns the account to Starter). */}
                {value === "pro" && (
                  <div className="mt-auto pt-2">
                    <PlanActions
                      plan={plan}
                      subscription={subscription}
                      userId={userId}
                      email={email}
                    />
                  </div>
                )}
              </div>
            );
          },
        )}
      </div>

      <p className="text-[11px] font-light text-foreground/50">
        Payments are processed securely by Paddle. To switch back to Starter,
        cancel Pro from Manage subscription.
      </p>
    </SettingsSection>
  );
};

export default PlanSection;
