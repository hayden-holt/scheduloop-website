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
          <div className="auth-app-preview">
            <div className="auth-preview-top">
              <div>
                <span>Planner view</span>
                <strong>Today&apos;s staffing plan</strong>
              </div>
              <em>Example data</em>
            </div>
            <div className="auth-recommendation">
              <span>Key recommendation</span>
              <strong>Plan for 36 staff hours today.</strong>
              <p>Strongest cover around 11:00-15:00.</p>
            </div>
            <div className="auth-preview-grid">
              <div>
                <span>Staff hours</span>
                <strong>36</strong>
              </div>
              <div>
                <span>Busiest period</span>
                <strong>11:00-14:00</strong>
              </div>
            </div>
            <div className="auth-chart-card">
              <div className="auth-chart-head">
                <span>Shape of the day</span>
                <strong>Staffing need</strong>
              </div>
              <svg
                className="auth-shape-chart"
                viewBox="0 0 620 260"
                role="img"
                aria-label="Shape of the day chart showing demand, total staffing and role coverage"
              >
                <defs>
                  <linearGradient id="auth-demand-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3578ff" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#3578ff" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {[42, 88, 134, 180].map((y) => (
                  <line key={y} x1="44" x2="596" y1={y} y2={y} className="auth-chart-grid" />
                ))}
                {["08:00", "10:00", "12:00", "14:00", "16:00", "17:00"].map((time, index) => (
                  <text key={time} x={62 + index * 104} y="238" className="auth-chart-label">
                    {time}
                  </text>
                ))}
                <path
                  className="auth-demand-area"
                  d="M48 188 C115 188 142 188 186 176 C238 162 270 124 326 98 C378 74 433 82 478 116 C522 148 548 174 596 182 L596 210 L48 210 Z"
                />
                <path
                  className="auth-demand-curve"
                  d="M48 188 C115 188 142 188 186 176 C238 162 270 124 326 98 C378 74 433 82 478 116 C522 148 548 174 596 182"
                />
                <path
                  className="auth-staff-curve"
                  d="M48 166 C120 166 150 166 196 154 C242 143 278 122 326 116 C380 108 425 112 472 132 C520 150 548 166 596 166"
                />
                <path
                  className="auth-role-curve auth-role-front"
                  d="M48 202 C150 202 210 202 270 178 C330 154 430 154 596 196"
                />
                <path
                  className="auth-role-curve auth-role-kitchen"
                  d="M48 204 C170 204 216 196 282 184 C346 170 420 172 596 200"
                />
                {[48, 186, 326, 478, 596].map((x, index) => (
                  <circle
                    key={x}
                    cx={x}
                    cy={[188, 176, 98, 116, 182][index]}
                    r="5"
                    className="auth-demand-dot"
                  />
                ))}
                <g className="auth-peak-tag">
                  <rect x="348" y="48" width="142" height="44" rx="8" />
                  <text x="364" y="66">Peak cover</text>
                  <text x="364" y="83">12:00-14:00</text>
                </g>
              </svg>
              <div className="auth-chart-times">
                <span><i className="legend-demand" /> Demand</span>
                <span><i className="legend-staff" /> Total staff</span>
                <span><i className="legend-front" /> Roles</span>
              </div>
            </div>
            <div className="auth-role-list">
              {["Barista / Front of House", "Kitchen", "Wait Staff"].map((role, index) => (
                <div key={role}>
                  <i aria-hidden="true" className={`role-dot role-dot-${index + 1}`} />
                  <span>{role}</span>
                  <strong>{index === 0 ? "3 peak" : "1 peak"}</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
