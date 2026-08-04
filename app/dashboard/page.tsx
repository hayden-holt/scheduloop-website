import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";

export const metadata: Metadata = {
  title: "Dashboard | ScheduleLoop",
};

export default function DashboardPage() {
  return (
    <AppShell
      active="dashboard"
      title="Today's staffing plan"
      description="Review forecast confidence, busiest windows and the cover blocks ready for manager judgement."
    >
      <section className="dashboard-grid">
        <article className="app-card app-card-wide">
          <p className="eyebrow">Key recommendation</p>
          <h2>Plan for 36 staff hours today.</h2>
          <p>
            Strongest cover is expected around 11:00-14:00. Use this as the rota
            starting point, then adjust for real-world details.
          </p>
        </article>
        <article className="app-card">
          <p className="eyebrow">Staff hours</p>
          <h2>36</h2>
          <p>Estimated total cover for the selected day.</p>
        </article>
        <article className="app-card">
          <p className="eyebrow">Confidence</p>
          <h2>High (74/100)</h2>
          <p>Based on 31 observed days and matching weekday samples.</p>
        </article>
        <article className="app-card app-card-wide">
          <p className="eyebrow">Rota guidance</p>
          <h2>Keep cover steady through lunch.</h2>
          <ul className="app-list">
            <li>11:00-15:00: strongest cover window.</li>
            <li>Barista demand peaks around 12:00-14:00.</li>
            <li>Kitchen and wait staff remain covered while open.</li>
          </ul>
        </article>
      </section>
    </AppShell>
  );
}
