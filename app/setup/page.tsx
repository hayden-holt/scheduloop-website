import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { requireServerAuthUser } from "../lib/serverAuth";

export const metadata: Metadata = {
  title: "Business Setup | ScheduleLoop",
};

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const user = await requireServerAuthUser("/setup");

  return (
    <AppShell
      user={user}
      active="setup"
      title="Business setup"
      description="Keep the profile, trading data and role assumptions current before each staffing plan starts."
    >
      <section className="settings-grid">
        <article className="app-card">
          <p className="eyebrow">Business profile</p>
          <label className="field-label" htmlFor="business-type">
            Business type
          </label>
          <select id="business-type" defaultValue="Cafe / Restaurant">
            <option>Cafe / Restaurant</option>
            <option>Restaurant</option>
            <option>Gym</option>
            <option>Retail store</option>
          </select>
          <p>Opening hours: 09:00-17:00</p>
        </article>
        <article className="app-card">
          <p className="eyebrow">Role setup</p>
          <ul className="app-list">
            <li>Barista / Front of House: peak cover 3, minimum 1.</li>
            <li>Kitchen: peak cover 1, minimum 1.</li>
            <li>Wait Staff: peak cover 1, minimum 1.</li>
          </ul>
        </article>
      </section>
    </AppShell>
  );
}
