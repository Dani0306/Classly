import { getToday } from "@/actions/today/getToday";
import ErrorScreen from "@/components/shared/ErrorScreen";
import TodayContent from "@/components/today/TodayContent";
import { TodayData } from "@/types";
import { tryCatch } from "@/utils/tryCatch";

const page = async () => {
  const [data, error] = await tryCatch<TodayData, Error>(getToday());

  if (error) return <ErrorScreen error={error} />;

  return <TodayContent data={data} />;
};

export default page;
