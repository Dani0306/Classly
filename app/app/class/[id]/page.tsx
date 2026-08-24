import { getClass } from "@/actions/classes/getClass";
import ClassContent from "@/components/class/ClassContent";
import ErrorScreen from "@/components/shared/ErrorScreen";
import { ContentType } from "@/types";
import { tryCatch } from "@/utils/tryCatch";
import React from "react";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ params, searchParams }: PageProps) => {
  const { id } = await params;
  const { type } = await searchParams;

  const [data, error] = await tryCatch(getClass(id, type as ContentType));

  if (error) return <ErrorScreen error={error} />;

  return <ClassContent contents={data.contents} classItem={data.classItem} />;
};

export default page;
