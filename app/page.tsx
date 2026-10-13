import { Responsive } from "@/components/shared/Responsive";
import { DesktopSite } from "@/components/desktop/Shell";
import { HomePage } from "@/components/desktop/HomePage";

/* "/" — the desktop home page on screens >= 900px, the BloomBuddy mobile app below 900px. */
export default function Page() {
  return (
    <Responsive
      desktop={
        <DesktopSite>
          <HomePage />
        </DesktopSite>
      }
    />
  );
}
