export type BusinessKey = "cafe" | "restaurant" | "gym" | "retail";
export type DayType = "quiet" | "normal" | "busy" | "event";

export type DemoPoint = {
  time: string;
  expectedDemand: number;
  recommendedStaff: number;
  roles: Record<string, number>;
};

export type DemoScenario = {
  business: BusinessKey;
  dayType: DayType;
  label: string;
  summary: string;
  open: string;
  close: string;
  rawDemand: number[];
  staffingDemand: number[];
  points: DemoPoint[];
  roles: DemoRole[];
  blocks: StaffingBlock[];
  staffedHours: number;
};

export type DemoRole = {
  key: string;
  label: string;
  color: string;
  values: number[];
};

export type StaffingBlock = {
  start: string;
  end: string;
  staff: number;
};

type BusinessSource = {
  label: string;
  summary: string;
  open: string;
  close: string;
  times: string[];
  rawDemand: number[];
  staffingDemand: number[];
  roles: DemoRole[];
};

// Stable demonstration data for the public try page. These curves are hand-shaped
// examples of recognizable trading patterns and should later be replaced by the
// live ScheduleLoop forecasting pipeline once real business data is connected.
const businessSources: Record<BusinessKey, BusinessSource> = {
  cafe: {
    label: "Cafe",
    summary:
      "Morning setup, a breakfast lift, a lunch rush and a gradual afternoon decline.",
    open: "07:00",
    close: "17:00",
    times: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    rawDemand: [18, 34, 58, 44, 50, 82, 90, 68, 42, 28, 18],
    staffingDemand: [2, 3, 4, 4, 4, 5, 5, 4, 3, 3, 2],
    roles: [
      { key: "barista", label: "Barista", color: "#3578ff", values: [1, 2, 3, 2, 2, 3, 3, 2, 2, 1, 1] },
      { key: "kitchen", label: "Kitchen", color: "#ff6f61", values: [1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1] },
      { key: "front", label: "Front of house", color: "#35c77b", values: [1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1] },
    ],
  },
  restaurant: {
    label: "Restaurant",
    summary:
      "Quiet prep, lunch service, an afternoon lull, strong evening service and closing.",
    open: "10:00",
    close: "23:00",
    times: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    rawDemand: [12, 22, 64, 74, 46, 24, 18, 42, 72, 96, 100, 82, 50, 18],
    staffingDemand: [3, 3, 6, 6, 5, 3, 3, 4, 7, 8, 8, 7, 5, 3],
    roles: [
      { key: "kitchen", label: "Kitchen", color: "#ff6f61", values: [2, 2, 3, 3, 3, 2, 2, 2, 3, 4, 4, 3, 2, 2] },
      { key: "servers", label: "Servers", color: "#3578ff", values: [1, 1, 3, 3, 2, 1, 1, 2, 4, 5, 5, 4, 3, 1] },
      { key: "bar", label: "Bar", color: "#f4b740", values: [0, 0, 1, 1, 1, 0, 0, 1, 2, 2, 2, 2, 1, 0] },
    ],
  },
  gym: {
    label: "Gym",
    summary:
      "Early member traffic, a quiet daytime stretch, an after-work peak and evening decline.",
    open: "06:00",
    close: "22:00",
    times: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    rawDemand: [42, 82, 76, 44, 28, 24, 34, 36, 30, 32, 46, 72, 98, 92, 66, 38, 18],
    staffingDemand: [3, 5, 5, 3, 2, 2, 3, 3, 2, 2, 3, 4, 6, 6, 4, 3, 2],
    roles: [
      { key: "reception", label: "Reception", color: "#3578ff", values: [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1] },
      { key: "floor", label: "Floor staff", color: "#35c77b", values: [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 2, 1, 1] },
      { key: "classes", label: "Classes", color: "#9a72ff", values: [1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 2, 2, 1, 1, 0] },
    ],
  },
  retail: {
    label: "Retail store",
    summary:
      "Quiet opening, a gradual build, midday activity, an afternoon peak and pre-close decline.",
    open: "09:00",
    close: "18:00",
    times: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    rawDemand: [16, 28, 46, 58, 64, 72, 88, 82, 54, 26],
    staffingDemand: [2, 2, 3, 4, 4, 5, 5, 5, 3, 2],
    roles: [
      { key: "floor", label: "Sales floor", color: "#3578ff", values: [1, 1, 2, 2, 2, 3, 3, 3, 2, 1] },
      { key: "checkout", label: "Checkout", color: "#f4b740", values: [1, 1, 1, 2, 2, 2, 2, 2, 1, 1] },
      { key: "stock", label: "Stock", color: "#35c77b", values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0] },
    ],
  },
};

const dayProfiles: Record<DayType, { label: string; demandScale: number; staffLift: number; note: string }> = {
  quiet: {
    label: "Quiet",
    demandScale: 0.72,
    staffLift: -1,
    note: "Lower than usual demand, with minimum cover kept in place.",
  },
  normal: {
    label: "Normal",
    demandScale: 1,
    staffLift: 0,
    note: "Typical demand using the base trading pattern.",
  },
  busy: {
    label: "Busy",
    demandScale: 1.18,
    staffLift: 1,
    note: "Higher demand across the strongest periods.",
  },
  event: {
    label: "Event",
    demandScale: 1.33,
    staffLift: 2,
    note: "A local event lifts demand and extends the busiest cover window.",
  },
};

export const businessOptions = Object.entries(businessSources).map(([key, value]) => ({
  key: key as BusinessKey,
  label: value.label,
  summary: value.summary,
}));

export const dayTypeOptions = Object.entries(dayProfiles).map(([key, value]) => ({
  key: key as DayType,
  label: value.label,
  note: value.note,
}));

export const demoScenarios = buildScenarios();

export function getScenario(business: BusinessKey, dayType: DayType) {
  return demoScenarios[business][dayType];
}

export function blockLabel(block: StaffingBlock) {
  return `${block.start}-${block.end}: ${block.staff} ${block.staff === 1 ? "employee" : "employees"}`;
}

export function roleBlocks(scenario: DemoScenario, roleKey: string) {
  const role = scenario.roles.find((item) => item.key === roleKey) ?? scenario.roles[0];
  return compressBlocks(scenario.open, scenario.close, scenario.points.map((point) => point.time), role.values);
}

function buildScenarios() {
  const result = {} as Record<BusinessKey, Record<DayType, DemoScenario>>;

  for (const [businessKey, source] of Object.entries(businessSources) as Array<[BusinessKey, BusinessSource]>) {
    result[businessKey] = {} as Record<DayType, DemoScenario>;
    for (const [dayType, profile] of Object.entries(dayProfiles) as Array<[DayType, typeof dayProfiles[DayType]]>) {
      const rawDemand = source.rawDemand.map((value, index) =>
        Math.min(100, Math.round(value * profile.demandScale + eventBump(dayType, index, source.rawDemand.length))),
      );
      const staffingDemand = smoothStaff(source.staffingDemand, profile.staffLift);
      const roles = source.roles.map((role) => ({
        ...role,
        values: smoothStaff(role.values, Math.max(-1, Math.round(profile.staffLift / 2))),
      }));
      const points = source.times.map((time, index) => ({
        time,
        expectedDemand: rawDemand[index],
        recommendedStaff: staffingDemand[index],
        roles: Object.fromEntries(roles.map((role) => [role.key, role.values[index]])),
      }));

      result[businessKey][dayType] = {
        business: businessKey,
        dayType,
        label: `${source.label} - ${profile.label} day`,
        summary: `${source.summary} ${profile.note}`,
        open: source.open,
        close: source.close,
        rawDemand,
        staffingDemand,
        points,
        roles,
        blocks: compressBlocks(source.open, source.close, source.times, staffingDemand),
        staffedHours: staffedHours(source.times, staffingDemand),
      };
    }
  }

  return result;
}

function smoothStaff(values: number[], lift: number) {
  return values.map((value, index, list) => {
    const lifted = Math.max(1, value + lift);
    const previous = list[index - 1] ?? value;
    const next = list[index + 1] ?? value;
    const isSingleSpike = lifted > previous + lift + 1 && lifted > next + lift + 1;
    return isSingleSpike ? Math.max(1, Math.round((previous + next) / 2) + lift) : lifted;
  });
}

function eventBump(dayType: DayType, index: number, length: number) {
  if (dayType !== "event") return 0;
  const center = length * 0.66;
  const distance = Math.abs(index - center);
  return Math.max(0, Math.round(18 - distance * 8));
}

function compressBlocks(open: string, close: string, times: string[], values: number[]) {
  const blocks: StaffingBlock[] = [];
  let start = open;
  let current = values[0] ?? 1;

  for (let index = 1; index < times.length; index += 1) {
    if (values[index] !== current) {
      blocks.push({ start, end: times[index], staff: current });
      start = times[index];
      current = values[index] ?? current;
    }
  }

  blocks.push({ start, end: close, staff: current });
  return blocks.filter((block) => block.start !== block.end);
}

function staffedHours(times: string[], values: number[]) {
  return times.slice(0, -1).reduce((total, time, index) => {
    return total + hoursBetween(time, times[index + 1]) * (values[index] ?? 0);
  }, 0);
}

function hoursBetween(start: string, end: string) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  return (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60;
}
