import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { requireServerAuthUser } from "../lib/serverAuth";

export const metadata: Metadata = {
  title: "Settings | ScheduleLoop",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireServerAuthUser("/settings");

  return (
    <AppShell
      user={user}
      active="settings"
      title="Business settings"
      description="Manage planning assumptions, account details and public-page preferences."
    >
      <section className="settings-grid">
        <article className="app-card">
          <p className="eyebrow">Forecast tuning</p>
          <h2>Normal caution</h2>
          <p>Most businesses can leave this alone until more trading history is available.</p>
        </article>
        <article className="app-card">
          <p className="eyebrow">Account</p>
          <h2>Email and password</h2>
          <p>Authentication is handled through Firebase email-and-password sign-in.</p>
        </article>
      </section>
    </AppShell>
  );
}
