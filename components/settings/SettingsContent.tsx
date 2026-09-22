import { AppUser, BillingSubscription } from "@/types";
import PageContainer from "../shared/PageContainer";
import ProfileSection from "./ProfileSection";
import PlanSection from "./PlanSection";
import AccountSection from "./AccountSection";

const SettingsContent = ({
  profile,
  subscription,
}: {
  profile: AppUser;
  subscription: BillingSubscription | null;
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
        />
        <AccountSection profile={profile} />
      </div>
    </PageContainer>
  );
};

export default SettingsContent;
