import { getMyProfile } from "@/actions/user";
import { getMySubscription } from "@/actions/billing";
import SettingsContent from "@/components/settings/SettingsContent";
import ErrorScreen from "@/components/shared/ErrorScreen";
import { AppUser } from "@/types";
import { tryCatch } from "@/utils/tryCatch";

const page = async () => {
  const [[profile, error], [subscription]] = await Promise.all([
    tryCatch<AppUser, Error>(getMyProfile()),
    // Billing details are secondary; Settings still renders without them.
    tryCatch(getMySubscription()),
  ]);

  if (error) return <ErrorScreen error={error} />;

  return <SettingsContent profile={profile} subscription={subscription} />;
};

export default page;
