import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { siteConfig } from "../lib/siteConfig";

export const metadata: Metadata = {
  title: "Terms | ScheduleLoop",
  description: "Terms for using ScheduleLoop early-access staffing guidance.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="site-shell text-page">
      <SiteHeader compact />
      <section className="legal-page">
        <p className="eyebrow">Terms</p>
        <h1>Terms</h1>
        <p className="legal-updated">Last updated: 4 August 2026</p>

        <h2>Who provides ScheduleLoop</h2>
        <p>
          ScheduleLoop is an early-stage product operated by {siteConfig.founderNames}.
          Contact: {siteConfig.contactEmail}.
        </p>

        <h2>What ScheduleLoop does</h2>
        <p>
          ScheduleLoop provides demand-led staffing guidance and a rota workspace. It
          helps managers estimate the cover a day may need, then manually assign
          employees and create shifts around that plan.
        </p>

        <h2>Manager responsibility</h2>
        <p>
          Forecasts are estimates, not guarantees. Managers remain responsible for final
          staffing, rota, safety, compliance, employee and business decisions.
        </p>

        <h2>Current product boundaries</h2>
        <p>
          ScheduleLoop does not generate rotas or choose employee assignments
          automatically. It does not currently provide payroll processing, time tracking,
          employee availability, holiday management, shift swapping, staff notifications
          or legal compliance guarantees.
        </p>

        <h2>Uploaded information</h2>
        <p>
          Users must have permission to upload any business data they provide. Uploaded
          information should be accurate enough for the staffing guidance the user wants
          to generate.
        </p>

        <h2>Early-access changes</h2>
        <p>
          ScheduleLoop is an early-access product, so functionality may change as the
          product is tested and improved. We will try to avoid unnecessary disruption,
          but features may be adjusted, added or removed.
        </p>

        <h2>No formal advice</h2>
        <p>
          ScheduleLoop supports operational planning. It is not legal, financial, payroll
          or HR advice.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms should be sent to {siteConfig.contactEmail}.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
