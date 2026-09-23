import { tryCatch } from "@/utils/tryCatch";
import { FullCalendar } from "../../../components/calendar/full-calendar";
import { getMyEvents } from "@/actions/calendar/getEvents";
import { EventData, EventKind, SearchParamProps } from "@/types";
import ErrorScreen from "@/components/shared/ErrorScreen";

export default async function CalendarPage({ searchParams }: SearchParamProps) {
  const { type } = await searchParams;

  const [events, error] = await tryCatch<EventData[], Error>(
    getMyEvents(type as EventKind | "all"),
  );
  if (error) return <ErrorScreen error={error} />;

  return <FullCalendar events={events} />;
}
