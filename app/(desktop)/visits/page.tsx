import { VisitsPage } from "@/components/desktop/VisitsPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Home Visits" };

export default function Page() {
  return <VisitsPage />;
}
