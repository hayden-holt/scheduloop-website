import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { primaryCta, siteConfig } from "../lib/siteConfig";
import { TryExperience } from "./TryExperience";

export const metadata: Metadata = {
  title: "Try the Demo | ScheduleLoop",
  description:
    "Try a ScheduleLoop demonstration and see how expected demand becomes staffing guidance and a rota plan.",
  alternates: {
    canonical: "/try",
  },
};

export default function TryPage() {
  return (
    <main className="site-shell try-shell">
      <SiteHeader />
      <section className="try-intro" aria-labelledby="try-title">
        <div>
          <p className="eyebrow">Interactive demonstration</p>
          <h1 id="try-title">Try ScheduleLoop with example business data</h1>
          <p>
            Select a business type, adjust the kind of day, change an example hourly
            rate and see how expected demand becomes practical staffing guidance before
            moving into the rota.
          </p>
        </div>
        <p className="demo-note">
          This demonstration uses example data and does not create or save a real business forecast.
        </p>
      </section>
      <TryExperience />
      <section className="try-preview-grid demo-explainer" aria-label="ScheduleLoop planning flow">
        <article>
          <span>1</span>
          <h3>Demand is a signal</h3>
          <p>Expected demand shows pressure across the day, but it is not identical to required staffing.</p>
        </article>
        <article>
          <span>2</span>
          <h3>Cover needs smoothing</h3>
          <p>Translate demand into steady staffing requirements instead of noisy one-hour spikes.</p>
        </article>
        <article>
          <span>3</span>
          <h3>Build the rota</h3>
          <p>Use the staffing requirement as the basis for employee shifts in the real ScheduleLoop rota workspace.</p>
        </article>
      </section>
      <section className="cta-band" aria-labelledby="try-cta-title">
        <div>
          <p className="eyebrow">Guided early access</p>
          <h2 id="try-cta-title">Want to see this using your own business setup?</h2>
          <p>
            Request a walkthrough and we&apos;ll show how your opening hours, roles and
            demand patterns can become practical cover and a working rota.
          </p>
        </div>
        <div className="cta-actions">
          <a className="button button-primary" href={siteConfig.routes.walkthrough}>
            {primaryCta}
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
