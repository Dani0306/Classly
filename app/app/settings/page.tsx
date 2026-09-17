import { getMyProfile } from "@/actions/user";
import SettingsContent from "@/components/settings/SettingsContent";
import ErrorScreen from "@/components/shared/ErrorScreen";
import { AppUser } from "@/types";
import { tryCatch } from "@/utils/tryCatch";

const page = async () => {
  const [profile, error] = await tryCatch<AppUser, Error>(getMyProfile());

  if (error) return <ErrorScreen error={error} />;

  return <SettingsContent profile={profile} />;
};

export default page;
