import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { TryExperience } from "./TryExperience";

export const metadata: Metadata = {
  title: "Try ScheduleLoop | Interactive Staffing Demo",
  description:
    "Choose a business, adjust the day and see how expected demand becomes a practical staffing plan.",
};

export default function TryPage() {
  return (
    <main className="site-shell try-shell">
      <SiteHeader />
      <section className="try-intro" aria-labelledby="try-title">
        <div>
          <p className="eyebrow">Interactive demo</p>
          <h1 id="try-title">See how ScheduleLoop plans a working day</h1>
          <p>
            Choose a business, adjust the day and see how expected demand becomes
            a practical staffing plan.
          </p>
        </div>
        <p className="demo-note">No account required. This example uses demonstration data.</p>
      </section>
      <TryExperience />
      <section className="cta-band" aria-labelledby="try-cta-title">
        <div>
          <p className="eyebrow">Ready for your own data?</p>
          <h2 id="try-cta-title">Ready to plan your own business?</h2>
          <p>
            Create an account to configure your opening hours, roles, demand
            patterns and staffing assumptions.
          </p>
        </div>
        <div className="cta-actions">
          <a className="button button-primary" href="/sign-up">
            Create Free Account
          </a>
          <a className="button button-secondary" href="/sign-in">
            Sign In
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
