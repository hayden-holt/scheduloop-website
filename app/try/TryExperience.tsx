"use client";

import { useMemo, useState } from "react";
import {
  BusinessKey,
  businessOptions,
  DayType,
  dayTypeOptions,
  DemoScenario,
  getScenario,
  roleBlocks,
} from "../lib/demoData";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function TryExperience() {
  const [business, setBusiness] = useState<BusinessKey>("cafe");
  const [dayType, setDayType] = useState<DayType>("normal");
  const [hourlyRate, setHourlyRate] = useState(15);
  const scenario = useMemo(() => getScenario(business, dayType), [business, dayType]);
  const [activeRole, setActiveRole] = useState(scenario.roles[0].key);
  const selectedRole = scenario.roles.find((role) => role.key === activeRole) ?? scenario.roles[0];
  const blocks = roleBlocks(scenario, selectedRole.key);
  const labourCost = scenario.staffedHours * hourlyRate;
  const peak = peakPoint(scenario);
  const strongest = strongestBlock(scenario);
  const quietest = quietestBlock(scenario);
  const selectedBusiness = businessOptions.find((option) => option.key === business)?.label ?? "Cafe";
  const selectedDay = dayTypeOptions.find((option) => option.key === dayType)?.label ?? "Normal";
  const confidence = dayType === "event" ? 68 : dayType === "busy" ? 76 : dayType === "quiet" ? 72 : 82;

  return (
    <section className="demo-grid demo-workspace" aria-label="ScheduleLoop demonstration">
      <div className="demo-main">
        <div className="control-panel demo-command-bar" aria-label="Demo controls">
          <div>
            <span className="control-label">Business example</span>
            <div className="segmented-control">
              {businessOptions.map((option) => (
                <button
                  type="button"
                  key={option.key}
                  aria-pressed={business === option.key}
                  onClick={() => {
                    setBusiness(option.key);
                    setActiveRole(getScenario(option.key, dayType).roles[0].key);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="control-label">Day type</span>
            <div className="segmented-control day-control">
              {dayTypeOptions.map((option) => (
                <button
                  type="button"
                  key={option.key}
                  aria-pressed={dayType === option.key}
                  onClick={() => setDayType(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="demo-scenario-status">
            <span>Demo workspace</span>
            <strong>{selectedBusiness} / {selectedDay} day</strong>
            <em>No account required</em>
          </div>
        </div>

        <article className="planner-preview" aria-labelledby="planner-demo-title">
          <div className="planner-browser-bar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="planner-preview-header">
            <div>
              <p className="eyebrow">Planner view</p>
              <h2 id="planner-demo-title">Today&apos;s staffing plan</h2>
              <p>{scenario.summary}</p>
            </div>
            <div className="planner-mode-switch" aria-label="Demo mode">
              <span>Planner View</span>
              <span>Setup View</span>
            </div>
          </div>

          <div className="planner-summary-grid">
            <section className="planner-recommendation">
              <p className="eyebrow">Key recommendation</p>
              <h3>Plan for {scenario.staffedHours.toFixed(0)} staff hours today.</h3>
              <p>
                Strongest cover is expected around {strongest.start}-{strongest.end}.
                Use this as guidance before creating named shifts.
              </p>
            </section>
            <aside className="planner-side-stats">
              <div>
                <span>Busiest period</span>
                <strong>{strongest.start}-{strongest.end}</strong>
              </div>
              <div>
                <span>Confidence</span>
                <strong>{confidence}/100</strong>
              </div>
            </aside>
          </div>

          <div className="planner-metric-grid">
            <div>
              <span>Staff hours</span>
              <strong>{scenario.staffedHours.toFixed(1)}</strong>
            </div>
            <div>
              <span>Peak demand</span>
              <strong>{peak.expectedDemand}</strong>
            </div>
            <div>
              <span>Peak cover</span>
              <strong>{peak.recommendedStaff}</strong>
            </div>
            <div>
              <span>Forecast based on</span>
              <strong>Demo data</strong>
            </div>
          </div>

          <div className="planner-content-grid">
            <article className="chart-panel planner-chart-panel" aria-labelledby="chart-title">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Shape of the day</p>
                  <h3 id="chart-title">{scenario.label}</h3>
                </div>
                <div className="legend" aria-label="Chart legend">
                  <span><i className="legend-demand" /> Expected demand</span>
                  <span><i className="legend-staff" /> Recommended staffing</span>
                </div>
              </div>
              <ShapeChart scenario={scenario} />
              <p className="chart-summary">
                Demand is strongest around {peak.time}; recommended cover reaches {peak.recommendedStaff} employees.
              </p>
            </article>

            <aside className="day-panel">
              <div className="day-panel-heading">
                <span>Plan by day</span>
                <strong>July 2026</strong>
              </div>
              <div className="calendar-mini" aria-hidden="true">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
                {Array.from({ length: 14 }, (_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={index === 8 ? "selected-day" : ""}
                    tabIndex={-1}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="day-context">
                <span>{selectedDay} day</span>
                <p>Use context before deciding the final rota.</p>
              </div>
            </aside>
          </div>

          <section className="rota-guidance-panel">
            <div>
              <p className="eyebrow">Rota guidance</p>
              <h3>Keep cover practical, not jumpy.</h3>
            </div>
            <p>
              Schedule strongest cover around {strongest.start}-{strongest.end}. 
              Quieter cover can sit closer to minimum around {quietest.start}-{quietest.end}.
            </p>
          </section>
        </article>

        <div className="operations-grid">
          <article className="info-panel">
            <p className="eyebrow">Practical staffing plan</p>
            <h2>Coverage blocks</h2>
            <p>
              These are staffing requirements, not named employee assignments.
            </p>
            <div className="staffing-timeline">
              {scenario.blocks.map((block) => (
                <div key={`${block.start}-${block.end}-${block.staff}`}>
                  <span>{block.start}-{block.end}</span>
                  <strong>{block.staff}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="info-panel">
            <p className="eyebrow">Role planning</p>
            <h2>Role requirements</h2>
            <div className="role-tabs" role="tablist" aria-label="Role requirements">
              {scenario.roles.map((role) => (
                <button
                  type="button"
                  key={role.key}
                  role="tab"
                  aria-selected={selectedRole.key === role.key}
                  onClick={() => setActiveRole(role.key)}
                  style={{ "--role-color": role.color } as React.CSSProperties}
                >
                  {role.label}
                </button>
              ))}
            </div>
            <div className="role-coverage-grid">
              {scenario.roles.map((role) => (
                <div
                  key={role.key}
                  className="role-coverage-card"
                  style={{ "--role-color": role.color } as React.CSSProperties}
                >
                  <div>
                    <span>{role.label}</span>
                    <strong>{Math.max(...role.values)} peak</strong>
                  </div>
                  <div className="role-mini-bars" aria-hidden="true">
                    {role.values.map((value, index) => (
                      <i key={`${role.key}-${index}`} style={{ height: `${Math.max(16, value * 18)}px` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <ul className="block-list compact-blocks role-block-summary">
              {blocks.map((block) => (
                <li key={`${selectedRole.key}-${block.start}-${block.end}-${block.staff}`}>
                  {block.start}-{block.end}: {block.staff}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <aside className="demo-sidebar" aria-label="Demo explanation and labour cost">
        <article className="cost-panel">
          <p className="eyebrow">Labour-cost estimate</p>
          <h2>{money.format(labourCost)}</h2>
          <dl>
            <div>
              <dt>Estimated staffed hours</dt>
              <dd>{scenario.staffedHours.toFixed(1)}</dd>
            </div>
            <div>
              <dt>Example hourly rate</dt>
              <dd>{money.format(hourlyRate)}</dd>
            </div>
          </dl>
          <label className="field-label" htmlFor="hourly-rate">
            Adjust example hourly rate
          </label>
          <input
            id="hourly-rate"
            type="range"
            min="10"
            max="28"
            step="0.5"
            value={hourlyRate}
            onChange={(event) => setHourlyRate(Number(event.target.value))}
          />
          <input
            aria-label="Hourly rate"
            className="rate-input"
            type="number"
            min="10"
            max="60"
            step="0.5"
            value={hourlyRate}
            onChange={(event) => setHourlyRate(Number(event.target.value))}
          />
          <p className="fine-print">
            This estimates staffing cost only. It does not calculate or process payroll.
          </p>
        </article>

        <article className="callout-panel">
          <h2>How the planner thinks</h2>
          <ul className="callout-list">
            <li><strong>Demand first.</strong> The curve shows the expected pressure across the working day.</li>
            <li><strong>Coverage second.</strong> Staffing is smoothed into blocks that can become real shifts.</li>
            <li><strong>Roles separately.</strong> Each role can peak at a different time.</li>
            <li><strong>Manager context.</strong> Quiet, busy and event days adjust the forecast before rota work starts.</li>
          </ul>
        </article>
      </aside>
    </section>
  );
}

function ShapeChart({ scenario }: { scenario: DemoScenario }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const width = 920;
  const height = 340;
  const padding = { top: 24, right: 36, bottom: 42, left: 42 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const maxDemand = Math.max(...scenario.rawDemand, 100);
  const maxStaff = Math.max(...scenario.staffingDemand, 1);

  const demandPoints = scenario.points.map((point, index) =>
    pointToSvg(index, scenario.points.length, point.expectedDemand, maxDemand, innerWidth, innerHeight, padding),
  );
  const staffPoints = scenario.points.map((point, index) =>
    pointToSvg(index, scenario.points.length, point.recommendedStaff, maxStaff, innerWidth, innerHeight, padding),
  );
  const activePoint = activeIndex === null ? null : scenario.points[activeIndex];
  const activeSvgPoint = activeIndex === null ? null : demandPoints[activeIndex];

  return (
    <div className="chart-wrap" onPointerLeave={() => setActiveIndex(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="chart-svg-title chart-svg-desc">
        <title id="chart-svg-title">{`${scenario.label} staffing chart`}</title>
        <desc id="chart-svg-desc">
          Line chart comparing expected demand with recommended staffing across the working day.
        </desc>
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = padding.top + innerHeight - (tick / 100) * innerHeight;
          return (
            <g key={tick}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="chart-grid" />
              <text x={10} y={y + 4} className="chart-tick">{tick}</text>
            </g>
          );
        })}
        <path d={linePath(demandPoints)} className="chart-line demand-line" />
        <path d={linePath(staffPoints)} className="chart-line staff-line" />
        {scenario.points.map((point, index) => {
          const demandPoint = demandPoints[index];
          const staffPoint = staffPoints[index];
          return (
            <g key={point.time}>
              <circle
                cx={demandPoint.x}
                cy={demandPoint.y}
                r="8"
                className="chart-hit"
                tabIndex={0}
                role="button"
                aria-label={`${point.time}: demand ${point.expectedDemand}, staffing ${point.recommendedStaff}`}
                onFocus={() => setActiveIndex(index)}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              />
              <circle cx={demandPoint.x} cy={demandPoint.y} r="4" className="demand-dot" />
              <circle cx={staffPoint.x} cy={staffPoint.y} r="4" className="staff-dot" />
            </g>
          );
        })}
        {scenario.points.map((point, index) => {
          if (index % Math.ceil(scenario.points.length / 7) !== 0 && index !== scenario.points.length - 1) {
            return null;
          }
          const svgPoint = demandPoints[index];
          return (
            <text key={`label-${point.time}`} x={svgPoint.x} y={height - 14} className="chart-time">
              {point.time}
            </text>
          );
        })}
      </svg>
      {activePoint && activeSvgPoint && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(activeSvgPoint.x / width) * 100}%`,
            top: `${(activeSvgPoint.y / height) * 100}%`,
          }}
        >
          <strong>{activePoint.time}</strong>
          <span>Demand {activePoint.expectedDemand}</span>
          <span>{activePoint.recommendedStaff} staff recommended</span>
        </div>
      )}
    </div>
  );
}

function pointToSvg(
  index: number,
  total: number,
  value: number,
  max: number,
  innerWidth: number,
  innerHeight: number,
  padding: { top: number; left: number },
) {
  const x = padding.left + (index / Math.max(1, total - 1)) * innerWidth;
  const y = padding.top + innerHeight - (value / max) * innerHeight;
  return { x, y };
}

function linePath(points: Array<{ x: number; y: number }>) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
}

function peakPoint(scenario: DemoScenario) {
  return scenario.points.reduce((best, point) =>
    point.expectedDemand > best.expectedDemand ? point : best,
  );
}

function strongestBlock(scenario: DemoScenario) {
  return scenario.blocks.reduce((best, block) => (block.staff > best.staff ? block : best));
}

function quietestBlock(scenario: DemoScenario) {
  return scenario.blocks.reduce((best, block) => (block.staff < best.staff ? block : best));
}
