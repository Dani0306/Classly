import { redirect } from "next/navigation";

/** Today is the app's home. */
export default function AppHome() {
  redirect("/app/today");
}
