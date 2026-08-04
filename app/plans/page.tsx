import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";

export const metadata: Metadata = {
  title: "Saved Plans | ScheduleLoop",
};

export default function PlansPage() {
  return (
    <AppShell
      active="plans"
      title="Saved plans"
      description="Review staffing plans that managers have prepared or exported."
    >
      <section className="dashboard-grid">
        {["Monday 6 Jul", "Tuesday 7 Jul", "Wednesday 8 Jul"].map((day, index) => (
          <article className="app-card" key={day}>
            <p className="eyebrow">{index === 0 ? "Ready" : "Draft"}</p>
            <h2>{day}</h2>
            <p>{index === 0 ? "36 staff hours, high confidence." : "Needs context review before publishing."}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
