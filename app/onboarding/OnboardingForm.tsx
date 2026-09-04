"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  businessTypeOptions,
  busyPeriodOptions,
  createDefaultBusinessProfile,
  defaultHoursForBusinessType,
  defaultRolesForBusinessType,
} from "../lib/appProfile";
import type { BusinessProfile, BusinessType } from "../lib/appProfile";

type OnboardingFormProps = {
  email: string;
};

type LoadState = "loading" | "ready" | "saving";

export function OnboardingForm({ email }: OnboardingFormProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<BusinessProfile>(() => createDefaultBusinessProfile());
  const [rolesText, setRolesText] = useState(() => createDefaultBusinessProfile().roles.join(", "));
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadExistingProfile() {
      try {
        const response = await fetch("/api/app/profile", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (response.status === 401) {
          router.replace("/sign-in?redirect=/onboarding");
          return;
        }

        if (response.ok) {
          const data = (await response.json()) as { profile?: BusinessProfile };
          if (data.profile && !cancelled) {
            setProfile(data.profile);
            setRolesText(data.profile.roles.join(", "));
          }
        }

        if (!cancelled) {
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setMessage("We could not check your existing setup. You can still save it again.");
          setLoadState("ready");
        }
      }
    }

    loadExistingProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const selectedBusinessLabel = useMemo(
    () => businessTypeOptions.find((option) => option.value === profile.businessType)?.label ?? "Cafe",
    [profile.businessType],
  );

  function updateProfile(update: Partial<BusinessProfile>) {
    setProfile((current) => ({ ...current, ...update }));
  }

  function handleBusinessTypeChange(value: BusinessType) {
    const hours = defaultHoursForBusinessType(value);
    const roles = defaultRolesForBusinessType(value);
    setProfile((current) => ({
      ...current,
      businessType: value,
      openTime: hours.openTime,
      closeTime: hours.closeTime,
      roles,
    }));
    setRolesText(roles.join(", "));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loadState === "saving") return;
    setMessage("");

    if (!profile.businessName.trim()) {
      setMessage("Add your business name to continue.");
      return;
    }

    setLoadState("saving");
    try {
      const roles = rolesText
        .split(",")
        .map((role) => role.trim())
        .filter(Boolean);
      const response = await fetch("/api/app/profile", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: { ...profile, roles } }),
      });

      if (response.status === 401) {
        router.replace("/sign-in?redirect=/onboarding");
        return;
      }

      if (!response.ok) {
        throw new Error("profile-save-failed");
      }

      router.push("/dashboard");
    } catch {
      setMessage("We could not save that setup. Please try again.");
      setLoadState("ready");
    }
  }

  if (loadState === "loading") {
    return (
      <section className="app-card upload-card" aria-live="polite">
        <p className="eyebrow">First run</p>
        <h2>Opening business setup.</h2>
        <p>Checking whether {email} already has a ScheduleLoop profile.</p>
      </section>
    );
  }

  return (
    <form className="onboarding-form" onSubmit={handleSubmit}>
      <section className="onboarding-panel app-card app-card-wide">
        <div>
          <p className="eyebrow">Business profile</p>
          <h2>Start with how the business trades.</h2>
          <p>
            This gives ScheduleLoop enough context to create the first staffing plan and role cover.
          </p>
        </div>
        <div className="form-grid">
          <label>
            <span className="field-label">Business name</span>
            <input
              value={profile.businessName}
              onChange={(event) => updateProfile({ businessName: event.target.value })}
              placeholder="Example Cafe"
              required
            />
          </label>
          <label>
            <span className="field-label">Location</span>
            <input
              value={profile.location}
              onChange={(event) => updateProfile({ location: event.target.value })}
              placeholder="Town or site name"
            />
          </label>
          <label>
            <span className="field-label">Business type</span>
            <select
              value={profile.businessType}
              onChange={(event) => handleBusinessTypeChange(event.target.value as BusinessType)}
            >
              {businessTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="field-label">Busiest period</span>
            <select
              value={profile.busyPeriod}
              onChange={(event) => updateProfile({ busyPeriod: event.target.value })}
            >
              {busyPeriodOptions.map((period) => (
                <option key={period}>{period}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="settings-grid">
        <article className="app-card">
          <p className="eyebrow">Trading day</p>
          <div className="form-grid single-column-form">
            <label>
              <span className="field-label">Opening time</span>
              <input
                type="time"
                value={profile.openTime}
                onChange={(event) => updateProfile({ openTime: event.target.value })}
              />
            </label>
            <label>
              <span className="field-label">Closing time</span>
              <input
                type="time"
                value={profile.closeTime}
                onChange={(event) => updateProfile({ closeTime: event.target.value })}
              />
            </label>
            <label>
              <span className="field-label">Average daily demand</span>
              <input
                type="number"
                min="0"
                max="10000"
                value={profile.averageDemand}
                onChange={(event) => updateProfile({ averageDemand: Number(event.target.value) })}
              />
            </label>
          </div>
        </article>

        <article className="app-card">
          <p className="eyebrow">Role setup</p>
          <label>
            <span className="field-label">Roles to plan around</span>
            <textarea
              rows={4}
              value={rolesText}
              onChange={(event) => setRolesText(event.target.value)}
              placeholder="Barista, Kitchen, Front of house"
            />
          </label>
          <p className="fine-print">
            Separate roles with commas. Current {selectedBusinessLabel} defaults can be changed anytime.
          </p>
        </article>
      </section>

      <section className="app-card app-card-wide onboarding-panel">
        <div>
          <p className="eyebrow">Planning style</p>
          <h2>Choose how cautious the first plan should be.</h2>
          <p>New accounts usually start normal, then tune this after real trading data is uploaded.</p>
        </div>
        <div className="onboarding-options" role="radiogroup" aria-label="Staffing caution">
          {[
            { value: "lean", label: "Lean", copy: "Keep the first plan tight." },
            { value: "normal", label: "Normal", copy: "Balanced cover for daily planning." },
            { value: "careful", label: "Careful", copy: "Add a little more cover while learning." },
          ].map((option) => (
            <label key={option.value} className="option-card">
              <input
                type="radio"
                name="staffingCaution"
                value={option.value}
                checked={profile.staffingCaution === option.value}
                onChange={() =>
                  updateProfile({
                    staffingCaution: option.value as BusinessProfile["staffingCaution"],
                  })
                }
              />
              <span>{option.label}</span>
              <small>{option.copy}</small>
            </label>
          ))}
        </div>
        <label>
          <span className="field-label">Planning notes</span>
          <textarea
            rows={3}
            value={profile.notes}
            onChange={(event) => updateProfile({ notes: event.target.value })}
            placeholder="Anything managers should remember about this site"
          />
        </label>
      </section>

      {message && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}

      <div className="onboarding-actions">
        <button className="button button-primary" type="submit" disabled={loadState === "saving"}>
          {loadState === "saving" ? "Saving setup..." : "Save and Open Dashboard"}
        </button>
      </div>
    </form>
  );
}
