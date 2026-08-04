import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { primaryCta, secondaryCta, siteConfig } from "../lib/siteConfig";
import { WalkthroughForm } from "./WalkthroughForm";

export const metadata: Metadata = {
  title: "Book a Free Walkthrough | ScheduleLoop",
  description:
    "Request a short ScheduleLoop walkthrough showing how expected demand can become a practical staffing plan.",
  alternates: {
    canonical: "/book-a-walkthrough",
  },
  openGraph: {
    title: "Book a Free Walkthrough | ScheduleLoop",
    description:
      "Tell us about your business and see how ScheduleLoop could support staffing decisions before the rota is built.",
    url: `${siteConfig.url}/book-a-walkthrough`,
  },
};

export default function BookWalkthroughPage() {
  return (
    <main className="site-shell walkthrough-shell">
      <SiteHeader />
      <section className="walkthrough-hero" aria-labelledby="walkthrough-title">
        <div className="walkthrough-copy">
          <p className="eyebrow">Guided early access</p>
          <h1 id="walkthrough-title">See how ScheduleLoop could work for your business</h1>
          <p>
            Tell us a little about your business and we&apos;ll arrange a short walkthrough
            showing how expected demand can become a practical staffing plan.
          </p>
          <div className="walkthrough-actions" aria-label="Alternative actions">
            <a className="button button-secondary" href={siteConfig.routes.demo}>
              {secondaryCta}
            </a>
            <a className="text-link" href={siteConfig.routes.signIn}>
              Sign In
            </a>
          </div>
        </div>
        <aside className="walkthrough-side">
          <h2>What we&apos;ll cover</h2>
          <ul>
            <li>Opening hours and trading rhythm</li>
            <li>Roles you need covered during the day</li>
            <li>How unusual days should be adjusted</li>
            <li>What data, if any, you already have</li>
          </ul>
        </aside>
      </section>

      <section className="walkthrough-panel" aria-labelledby="request-title">
        <div>
          <p className="eyebrow">Walkthrough request</p>
          <h2 id="request-title">{primaryCta}</h2>
          <p>
            Keep it brief. The walkthrough is about understanding whether ScheduleLoop can
            help with the staffing decisions you are already making.
          </p>
        </div>
        <WalkthroughForm />
      </section>
      <SiteFooter />
    </main>
  );
}
