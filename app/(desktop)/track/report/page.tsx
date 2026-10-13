import type { Metadata } from "next";
import { TrackPage } from "@/components/desktop/TrackPage";

export const metadata: Metadata = { title: "Visit report" };

/* Small screens show the app's report card + rating screen; wide screens show tracking with a link to a report card. */
export default function Page() {
  return <TrackPage />;
}
