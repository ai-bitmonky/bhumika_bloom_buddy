import { redirect } from "next/navigation";
import { Responsive } from "@/components/shared/Responsive";
import { DesktopSite } from "@/components/desktop/Shell";
import { HomePage } from "@/components/desktop/HomePage";
import { DesktopRedirect } from "@/components/desktop/DesktopRedirect";

/* /m/... — deep links to app screens (e.g. /m/plants, /m/book/service, /m/track). Small screens render that
   screen of the app; on a large screen the closest website page is shown instead. */
const DESKTOP_EQUIV: [RegExp, string][] = [
  [/^book/, "/visits"],
  [/^track/, "/track"],
  [/^care/, "/care"],
  [/^hubs/, "/dropoff"],
];

export default async function Page({ params }: { params: Promise<{ screen?: string[] }> }) {
  const { screen = [] } = await params;
  if (!screen.length) redirect("/");
  const p = screen.join("/");
  const eq = DESKTOP_EQUIV.find(([re]) => re.test(p));
  return <Responsive desktop={<DesktopSite>{eq ? <DesktopRedirect to={eq[1]} /> : <HomePage />}</DesktopSite>} />;
}
