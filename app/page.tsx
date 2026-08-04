import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export const metadata: Metadata = {
  title: "ScheduleLoop | Daily staffing plans shaped around demand",
  description:
    "ScheduleLoop helps managers turn demand patterns into practical staffing guidance before building a rota.",
};

const benefits = [
  {
    title: "See the shape of the day",
    body: "A clear demand curve shows where cover should lift, hold steady or ease back.",
  },
  {
    title: "Plan by role",
    body: "Separate front of house, kitchen, reception, checkout or stock needs without losing the overall picture.",
  },
  {
    title: "Smooth noisy spikes",
    body: "Hourly forecasts become staffing blocks a manager could actually schedule.",
  },
];

const workflow = [
  "Choose the business profile and opening hours.",
  "Upload trading history or start with demonstration demand.",
  "Review the busiest period, confidence and role coverage.",
  "Adjust unusual days before committing the rota.",
];

export default function Home() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <img
            src="/screens/planner-overview.png"
            alt=""
            className="hero-image"
          />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Demand-led rota planning</p>
          <h1 id="hero-title">
            Staffing plans shaped around the real rhythm of your day.
          </h1>
          <p className="hero-copy">
            ScheduleLoop turns expected demand, role coverage and local context
            into practical staffing guidance before you start building the rota.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="/try">
              Try ScheduleLoop
            </a>
            <a className="button button-secondary" href="/sign-up">
              Get Started
            </a>
          </div>
          <div className="hero-proof" aria-label="Product highlights">
            <span>Forecast-based guidance</span>
            <span>Role-level cover</span>
            <span>Manager adjustments</span>
          </div>
        </div>
      </section>

      <section className="metric-band" aria-label="ScheduleLoop highlights">
        <div>
          <strong>36</strong>
          <span>staff hours planned from one forecast day</span>
        </div>
        <div>
          <strong>11:00-14:00</strong>
          <span>busiest period surfaced for review</span>
        </div>
        <div>
          <strong>74/100</strong>
          <span>confidence shown before publishing decisions</span>
        </div>
      </section>

      <section className="section two-column" aria-labelledby="why-title">
        <div className="section-copy">
          <p className="eyebrow">Why it works</p>
          <h2 id="why-title">Demand is not the same as staffing.</h2>
          <p>
            Sales, bookings and check-ins move in waves. A rota has to be more
            grounded than that: stable enough for shifts, specific enough for
            roles and flexible enough for local events.
          </p>
          <a className="text-link" href="/try">
            See Your Staffing Plan
          </a>
        </div>
        <div className="product-collage" aria-label="ScheduleLoop screenshots">
          <figure className="shot shot-large">
            <img src="/screens/shape-of-day.png" alt="ScheduleLoop shape of the day chart" />
          </figure>
          <figure className="shot shot-small shot-float">
            <img src="/screens/planner-overview.png" alt="ScheduleLoop staffing recommendation cards" />
          </figure>
        </div>
      </section>

      <section className="section" aria-labelledby="benefits-title">
        <div className="section-heading">
          <p className="eyebrow">Built for daily decisions</p>
          <h2 id="benefits-title">Everything a manager checks before the rota.</h2>
        </div>
        <div className="feature-grid">
          {benefits.map((benefit) => (
            <article className="feature-card" key={benefit.title}>
              <span className="feature-marker" aria-hidden="true" />
              <h3>{benefit.title}</h3>
              <p>{benefit.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-proof" aria-labelledby="workflow-title">
        <div className="setup-slice">
          <img src="/screens/setup-view.png" alt="ScheduleLoop business setup and role assumptions" />
        </div>
        <div className="section-copy">
          <p className="eyebrow">From forecast to rota guidance</p>
          <h2 id="workflow-title">Keep the plan close to the business context.</h2>
          <ol className="workflow-list">
            {workflow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <div className="inline-actions">
            <a className="button button-primary" href="/try">
              Start Planning
            </a>
            <a className="button button-light" href="/sign-up">
              Join Early Access
            </a>
          </div>
        </div>
      </section>

      <section className="cta-band" aria-labelledby="cta-title">
        <div>
          <p className="eyebrow">No spreadsheet gymnastics</p>
          <h2 id="cta-title">Ready to plan staffing around your own day?</h2>
          <p>
            Try the interactive demo first, then create an account when you are
            ready to configure roles, opening hours and demand patterns.
          </p>
        </div>
        <div className="cta-actions">
          <a className="button button-primary" href="/try">
            Try ScheduleLoop
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
