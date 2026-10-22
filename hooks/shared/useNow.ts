import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  const timer = setInterval(onChange, 30_000);
  return () => clearInterval(timer);
};

// Minute precision keeps the snapshot stable between ticks.
const getSnapshot = () => {
  const now = new Date();
  now.setSeconds(0, 0);
  return now.getTime();
};

/**
 * The current minute in the browser's timezone, or null while rendering on
 * the server, where "today" would be UTC and wrong for the student.
 */
export const useNow = () => {
  const time = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return time === null ? null : new Date(time);
};
