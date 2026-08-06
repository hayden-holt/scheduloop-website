import type { Metadata } from "next";
import { AuthShell } from "../components/AuthShell";
import { primaryCta, siteConfig } from "../lib/siteConfig";

export const metadata: Metadata = {
  title: "Guided Early Access | ScheduleLoop",
  description: "ScheduleLoop is currently available through guided early access.",
  alternates: {
    canonical: "/sign-up",
  },
};

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Guided early access"
      title="ScheduleLoop is currently available through guided early access."
      copy="Request a walkthrough and we will help configure ScheduleLoop around your opening hours, roles, demand patterns and rota."
    >
      <div className="early-access-card">
        <h2>What happens next</h2>
        <ul>
          <li>We learn how your business currently builds the rota.</li>
          <li>We help shape the initial roles, hours and demand assumptions.</li>
          <li>You can see whether ScheduleLoop fits your staffing decisions.</li>
        </ul>
        <div className="auth-action-row">
          <a className="button button-primary" href={siteConfig.routes.walkthrough}>
            {primaryCta}
          </a>
          <a className="button button-secondary" href={siteConfig.routes.signIn}>
            Sign In
          </a>
        </div>
      </div>
    </AuthShell>
  );
}
