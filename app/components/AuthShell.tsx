import { SiteHeader } from "./SiteHeader";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
};

export function AuthShell({ eyebrow, title, copy, children }: AuthShellProps) {
  return (
    <main className="auth-layout">
      <SiteHeader compact />
      <section className="auth-grid" aria-labelledby="auth-title">
        <div className="auth-panel">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="auth-title">{title}</h1>
          <p>{copy}</p>
          {children}
        </div>
        <aside className="auth-product" aria-label="ScheduleLoop product preview">
          <div className="auth-shot auth-shot-main">
            <img src="/screens/shape-of-day.png" alt="ScheduleLoop staffing chart preview" />
          </div>
          <div className="auth-benefit">
            <span>Forecast-based</span>
            <strong>Turn noisy hourly demand into staffing blocks.</strong>
          </div>
          <div className="auth-shot auth-shot-small">
            <img src="/screens/planner-overview.png" alt="ScheduleLoop staffing recommendation preview" />
          </div>
        </aside>
      </section>
    </main>
  );
}
