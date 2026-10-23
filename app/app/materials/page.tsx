import { getAllContents } from "@/actions/contents/getAllContents";
import { ContentsContainer } from "@/components/contentsPage/ContentsContainer";
import ErrorScreen from "@/components/shared/ErrorScreen";
import { getMyClasses } from "@/actions/classes/getMyClasses";
import { Class, Content, SearchParamProps } from "@/types";
import { tryCatch } from "@/utils/tryCatch";

const page = async ({ searchParams }: SearchParamProps) => {
  const params = await searchParams;

  const search = typeof params.search === "string" ? params.search : "";
  const type = typeof params.type === "string" ? params.type : undefined;
  const dueDate = typeof params.dueDate === "string" ? params.dueDate : "";

  const [[contents, error], [classes]] = await Promise.all([
    tryCatch<Content[], Error>(getAllContents(search, type, dueDate)),
    tryCatch<Class[], Error>(getMyClasses()),
  ]);

  if (error) return <ErrorScreen error={error} />;

  return (
    <ContentsContainer
      contents={contents}
      classes={(classes ?? []).map(({ id, name }) => ({ id, name }))}
    />
  );
};

export default page;
