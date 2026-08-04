import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Try ScheduleLoop | Staffing Planning Preview",
  description:
    "See how ScheduleLoop turns demand patterns into practical staffing guidance.",
};

export default function TryPage() {
  return (
    <main className="site-shell try-shell">
      <SiteHeader />
      <section className="try-intro" aria-labelledby="try-title">
        <div>
          <p className="eyebrow">Product preview</p>
          <h1 id="try-title">See how ScheduleLoop plans a working day</h1>
          <p>
            Get a clearer feel for the planner before creating an account. The
            product starts with demand, turns it into staffing guidance, and
            leaves room for manager judgement.
          </p>
        </div>
        <p className="demo-note">Preview only. Create an account to configure your own business.</p>
      </section>
      <section className="try-product-preview" aria-label="ScheduleLoop product preview">
        <div className="preview-copy-panel">
          <p className="eyebrow">What the app shows</p>
          <h2>Forecasts become practical cover blocks.</h2>
          <p>
            ScheduleLoop is designed to show the shape of the day, the busiest
            period, confidence, role requirements and rota guidance in one place.
          </p>
          <div className="preview-points">
            <span>Staff hours</span>
            <span>Role peaks</span>
            <span>Busiest window</span>
            <span>Manager context</span>
          </div>
        </div>
        <figure className="preview-product-shot">
          <img src="/screens/shape-of-day.png" alt="ScheduleLoop planner with staffing chart and day controls" />
        </figure>
      </section>
      <section className="try-preview-grid" aria-label="ScheduleLoop planning flow">
        <article>
          <span>1</span>
          <h3>Start with demand</h3>
          <p>Use trading history, day type and local context to understand where pressure rises and falls.</p>
        </article>
        <article>
          <span>2</span>
          <h3>Review cover</h3>
          <p>Translate demand into steady staffing requirements instead of noisy one-hour spikes.</p>
        </article>
        <article>
          <span>3</span>
          <h3>Plan roles</h3>
          <p>Check front of house, kitchen, reception, checkout or stock requirements separately.</p>
        </article>
      </section>
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
