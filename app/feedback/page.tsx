import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";

export const metadata: Metadata = {
  title: "Manager Feedback | ScheduleLoop",
};

export default function FeedbackPage() {
  return (
    <AppShell
      active="feedback"
      title="Manager feedback"
      description="Record whether a past shift felt high, right or low so future guidance improves."
    >
      <section className="app-card">
        <p className="eyebrow">Forecast review</p>
        <div className="feedback-grid">
          <label>
            Hour
            <select defaultValue="12:00">
              <option>08:00</option>
              <option>12:00</option>
              <option>16:00</option>
            </select>
          </label>
          <label>
            Staff area
            <select defaultValue="Total staff">
              <option>Total staff</option>
              <option>Front of house</option>
              <option>Kitchen</option>
            </select>
          </label>
          <label>
            Actual staff
            <input type="number" min="0" defaultValue="3" />
          </label>
        </div>
        <div className="inline-actions">
          <button className="button button-light" type="button">Overstaffed</button>
          <button className="button button-primary" type="button">About right</button>
          <button className="button button-secondary" type="button">Understaffed</button>
        </div>
      </section>
    </AppShell>
  );
}
