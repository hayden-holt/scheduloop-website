export type BusinessType = "cafe" | "restaurant" | "gym" | "retail";

export type BusinessProfile = {
  businessName: string;
  businessType: BusinessType;
  location: string;
  openTime: string;
  closeTime: string;
  roles: string[];
  averageDemand: number;
  busyPeriod: string;
  staffingCaution: "lean" | "normal" | "careful";
  notes: string;
};

export type StaffingPlan = {
  staffHours: number;
  confidence: number;
  strongestWindow: string;
  guidance: string;
  roleLines: Array<{
    role: string;
    cover: number;
  }>;
};

export const businessTypeOptions: Array<{ value: BusinessType; label: string }> = [
  { value: "cafe", label: "Cafe" },
  { value: "restaurant", label: "Restaurant" },
  { value: "gym", label: "Gym / fitness" },
  { value: "retail", label: "Retail store" },
];

export const busyPeriodOptions = [
  "Morning",
  "Lunch",
  "Afternoon",
  "Evening",
  "Weekend",
  "Split peaks",
];

const roleDefaults: Record<BusinessType, string[]> = {
  cafe: ["Barista", "Kitchen", "Front of house"],
  restaurant: ["Kitchen", "Servers", "Bar"],
  gym: ["Reception", "Floor staff", "Classes"],
  retail: ["Sales floor", "Checkout", "Stock"],
};

const defaultOpenClose: Record<BusinessType, { openTime: string; closeTime: string }> = {
  cafe: { openTime: "07:00", closeTime: "17:00" },
  restaurant: { openTime: "10:00", closeTime: "23:00" },
  gym: { openTime: "06:00", closeTime: "22:00" },
  retail: { openTime: "09:00", closeTime: "18:00" },
};

export function createDefaultBusinessProfile(): BusinessProfile {
  return {
    businessName: "",
    businessType: "cafe",
    location: "",
    openTime: defaultOpenClose.cafe.openTime,
    closeTime: defaultOpenClose.cafe.closeTime,
    roles: roleDefaults.cafe,
    averageDemand: 120,
    busyPeriod: "Lunch",
    staffingCaution: "normal",
    notes: "",
  };
}

export function defaultRolesForBusinessType(type: BusinessType) {
  return roleDefaults[type] ?? roleDefaults.cafe;
}

export function defaultHoursForBusinessType(type: BusinessType) {
  return defaultOpenClose[type] ?? defaultOpenClose.cafe;
}

export function sanitizeBusinessProfile(input: unknown): BusinessProfile {
  const raw = isRecord(input) ? input : {};
  const businessType = parseBusinessType(raw.businessType);
  const defaultProfile = {
    ...createDefaultBusinessProfile(),
    businessType,
    ...defaultHoursForBusinessType(businessType),
    roles: defaultRolesForBusinessType(businessType),
  };
  const openTime = sanitizeTime(raw.openTime, defaultProfile.openTime);
  let closeTime = sanitizeTime(raw.closeTime, defaultProfile.closeTime);

  if (timeToMinutes(closeTime) <= timeToMinutes(openTime)) {
    closeTime = defaultProfile.closeTime;
  }

  return {
    businessName: sanitizeText(raw.businessName, 120) || "My business",
    businessType,
    location: sanitizeText(raw.location, 120),
    openTime,
    closeTime,
    roles: sanitizeRoles(raw.roles, defaultProfile.roles),
    averageDemand: clampNumber(raw.averageDemand, 0, 10000, defaultProfile.averageDemand),
    busyPeriod: sanitizeOption(raw.busyPeriod, busyPeriodOptions, defaultProfile.busyPeriod),
    staffingCaution: sanitizeStaffingCaution(raw.staffingCaution),
    notes: sanitizeText(raw.notes, 600),
  };
}

export function deriveStaffingPlan(profile: BusinessProfile): StaffingPlan {
  const openMinutes = timeToMinutes(profile.openTime);
  const closeMinutes = timeToMinutes(profile.closeTime);
  const tradingHours = Math.max(1, (closeMinutes - openMinutes) / 60);
  const demandPressure = Math.max(1, Math.ceil(profile.averageDemand / 35));
  const cautionLift =
    profile.staffingCaution === "careful" ? 1 : profile.staffingCaution === "lean" ? -1 : 0;
  const baseline = Math.max(1, Math.ceil(profile.roles.length / 2));
  const peakCover = Math.max(1, baseline + demandPressure + cautionLift);
  const offPeakCover = Math.max(1, Math.ceil(peakCover * 0.58));
  const staffHours = Math.round((offPeakCover * tradingHours + peakCover * 3) * 0.72);
  const confidence = Math.min(88, Math.max(45, 52 + profile.roles.length * 4 + Math.round(profile.averageDemand / 14)));
  const strongestWindow = getStrongestWindow(profile);

  return {
    staffHours,
    confidence,
    strongestWindow,
    guidance: getGuidance(profile, peakCover),
    roleLines: profile.roles.map((role, index) => ({
      role,
      cover: Math.max(1, Math.ceil((peakCover - index) / Math.max(1, profile.roles.length - 1))),
    })),
  };
}

export function parseStoredBusinessProfile(value: string | null | undefined) {
  if (!value) return null;
  try {
    return sanitizeBusinessProfile(JSON.parse(value));
  } catch {
    return null;
  }
}

function getStrongestWindow(profile: BusinessProfile) {
  const windows: Record<string, string> = {
    Morning: "08:00-11:00",
    Lunch: "11:00-14:00",
    Afternoon: "14:00-17:00",
    Evening: "18:00-21:00",
    Weekend: "10:00-14:00",
    "Split peaks": "08:00-10:00 and 17:00-19:00",
  };
  return windows[profile.busyPeriod] ?? "11:00-14:00";
}

function getGuidance(profile: BusinessProfile, peakCover: number) {
  const noun =
    profile.businessType === "gym"
      ? "member traffic"
      : profile.businessType === "retail"
        ? "shop-floor demand"
        : "service demand";
  return `Keep ${peakCover} people available around ${profile.busyPeriod.toLowerCase()} while ${noun} is strongest.`;
}

function sanitizeText(value: unknown, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function parseBusinessType(value: unknown): BusinessType {
  return businessTypeOptions.some((option) => option.value === value)
    ? (value as BusinessType)
    : "cafe";
}

function sanitizeRoles(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const roles = value
    .map((role) => sanitizeText(role, 60))
    .filter(Boolean)
    .slice(0, 10);
  return roles.length > 0 ? Array.from(new Set(roles)) : fallback;
}

function sanitizeOption(value: unknown, options: string[], fallback: string) {
  const text = sanitizeText(value, 40);
  return options.includes(text) ? text : fallback;
}

function sanitizeStaffingCaution(value: unknown): BusinessProfile["staffingCaution"] {
  return value === "lean" || value === "careful" ? value : "normal";
}

function sanitizeTime(value: unknown, fallback: string) {
  const text = sanitizeText(value, 5);
  return /^\d{2}:\d{2}$/.test(text) ? text : fallback;
}

function timeToMinutes(value: string) {
  const [hours = 0, minutes = 0] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
