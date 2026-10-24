import { getClass } from "@/actions/classes/getClass";
import ClassContent from "@/components/class/ClassContent";
import ErrorScreen from "@/components/shared/ErrorScreen";
import { tryCatch } from "@/utils/tryCatch";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ params, searchParams }: PageProps) => {
  const { id } = await params;
  const { type } = await searchParams;

  const [data, error] = await tryCatch(
    getClass(id, typeof type === "string" ? type : undefined),
  );

  if (error) return <ErrorScreen error={error} />;

  return (
    <ClassContent
      contents={data.contents}
      classItem={data.classItem}
      pins={data.pins}
    />
  );
};

export default page;
