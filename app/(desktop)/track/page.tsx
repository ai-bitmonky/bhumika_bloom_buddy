import type { Metadata } from "next";
import { TrackPage } from "@/components/desktop/TrackPage";

export const metadata: Metadata = { title: "Track booking" };

export default function Page() {
  return <TrackPage />;
}
