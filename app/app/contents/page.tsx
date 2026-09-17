import { getAllContents } from "@/actions/contents/getAllContents";
import { ContentsContainer } from "@/components/contentsPage/ContentsContainer";
import ErrorScreen from "@/components/shared/ErrorScreen";
import { Content, ContentType, SearchParamProps } from "@/types";
import { tryCatch } from "@/utils/tryCatch";

const page = async ({ searchParams }: SearchParamProps) => {
  const params = await searchParams;

  const search = typeof params.search === "string" ? params.search : "";
  const type =
    typeof params.type === "string" ? (params.type as ContentType) : undefined;
  const dueDate = typeof params.dueDate === "string" ? params.dueDate : "";

  const [contents, error] = await tryCatch<Content[], Error>(
    getAllContents(search, type, dueDate),
  );

  if (error) return <ErrorScreen error={error} />;

  return <ContentsContainer contents={contents} />;
};

export default page;
