import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | ScheduleLoop",
};

export default function PrivacyPage() {
  return (
    <main className="site-shell text-page">
      <SiteHeader compact />
      <section className="legal-page">
        <p className="eyebrow">Privacy</p>
        <h1>Privacy Policy</h1>
        <p>
          ScheduleLoop should only collect the account and business information
          needed to provide staffing guidance. Connect your production privacy
          policy before launch.
        </p>
        <p>
          Authentication is designed to run through Firebase Authentication. Live
          trading-history storage still needs the production backend and data
          retention settings.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
