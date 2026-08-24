import { getMyClasses } from "@/actions/classes/getMyClasses";
import MyClassesContent from "@/components/classes/MyClassesContent";
import ErrorScreen from "@/components/shared/ErrorScreen";
import { Class, SearchParamProps } from "@/types";
import { tryCatch } from "@/utils/tryCatch";

const page = async ({ searchParams }: SearchParamProps) => {
  const search = ((await searchParams)?.search as string) || "";

  const [classes, err] = await tryCatch<Class[], Error>(getMyClasses(search));

  if (err) return <ErrorScreen error={err} />;

  return <MyClassesContent classes={classes} />;
};

export default page;
