import { AppUser, BillingSubscription } from "@/types";
import type { AiUsageSummary } from "@/actions/ai/getMyAiUsage";
import PageContainer from "../shared/PageContainer";
import ProfileSection from "./ProfileSection";
import PlanSection from "./PlanSection";
import AccountSection from "./AccountSection";

const SettingsContent = ({
  profile,
  subscription,
  usage,
}: {
  profile: AppUser;
  subscription: BillingSubscription | null;
  usage: AiUsageSummary | null;
}) => {
  return (
    <PageContainer
      title="Settings"
      description="Manage your profile, your plan and your Classly account."
    >
      <div className="flex w-full flex-col space-y-6">
        <ProfileSection profile={profile} />
        <PlanSection
          plan={profile.plan}
          subscription={subscription}
          userId={String(profile.id)}
          email={profile.email}
          usage={usage}
        />
        <AccountSection profile={profile} />
      </div>
    </PageContainer>
  );
};

export default SettingsContent;
