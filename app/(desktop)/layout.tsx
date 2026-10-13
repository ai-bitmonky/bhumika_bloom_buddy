import { Responsive } from "@/components/shared/Responsive";
import { DesktopSite } from "@/components/desktop/Shell";

/* /visits, /dropoff, /plans, /care, /business: desktop pages >= 900px; the BloomBuddy app below 900px (same gate as "/"). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <Responsive desktop={<DesktopSite>{children}</DesktopSite>} />;
}
