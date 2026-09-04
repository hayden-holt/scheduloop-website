"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  deriveStaffingPlan,
} from "../lib/appProfile";
import type { BusinessProfile } from "../lib/appProfile";

type ProfileState =
  | { status: "loading" }
  | { status: "ready"; profile: BusinessProfile }
  | { status: "error"; message: string };

export function DashboardClient() {
  const router = useRouter();
  const [state, setState] = useState<ProfileState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch("/api/app/profile", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (response.status === 404) {
          router.replace("/onboarding");
          return;
        }

        if (response.status === 401) {
          router.replace("/sign-in?redirect=/dashboard");
          return;
        }

        if (!response.ok) {
          throw new Error("profile-load-failed");
        }

        const data = (await response.json()) as { profile?: BusinessProfile };
        if (!data.profile) {
          router.replace("/onboarding");
          return;
        }

        if (!cancelled) {
          setState({ status: "ready", profile: data.profile });
        }
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message: "We could not load your ScheduleLoop setup. Please refresh and try again.",
          });
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (state.status === "loading") {
    return (
      <section className="app-card upload-card" aria-live="polite">
        <p className="eyebrow">Opening workspace</p>
        <h2>Preparing your ScheduleLoop app.</h2>
        <p>Checking whether this account has completed business setup.</p>
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="app-card upload-card">
        <p className="eyebrow">Setup needed</p>
        <h2>Open business setup to continue.</h2>
        <p>{state.message}</p>
        <a className="button button-primary" href="/onboarding">
          Open Business Setup
        </a>
      </section>
    );
  }

  return <ProfileDashboard profile={state.profile} />;
}

function ProfileDashboard({ profile }: { profile: BusinessProfile }) {
  const plan = useMemo(() => deriveStaffingPlan(profile), [profile]);
  const confidenceLabel = plan.confidence >= 72 ? "High" : plan.confidence >= 58 ? "Moderate" : "Early";

  return (
    <section className="dashboard-grid app-dashboard">
      <article className="app-card app-card-wide">
        <div className="app-card-topline">
          <p className="eyebrow">Key recommendation</p>
          <a className="text-link" href="/onboarding">
            Update setup
          </a>
        </div>
        <h2>Plan for {plan.staffHours} staff hours today.</h2>
        <p>
          {profile.businessName} is strongest around {plan.strongestWindow}. Use this as the rota
          starting point, then adjust for manager judgement.
        </p>
      </article>

      <article className="app-card">
        <p className="eyebrow">Staff hours</p>
        <h2>{plan.staffHours}</h2>
        <p>Estimated cover for {profile.openTime}-{profile.closeTime}.</p>
      </article>

      <article className="app-card">
        <p className="eyebrow">Confidence</p>
        <h2>{confidenceLabel} ({plan.confidence}/100)</h2>
        <p>Based on your current business setup and demand assumptions.</p>
      </article>

      <article className="app-card app-card-wide">
        <p className="eyebrow">Rota guidance</p>
        <h2>{plan.guidance}</h2>
        <ul className="app-list">
          <li>{plan.strongestWindow}: strongest cover window.</li>
          <li>{profile.busyPeriod} is the busiest trading period.</li>
          <li>{profile.staffingCaution === "careful" ? "Keep extra cover available while the forecast learns." : "Use normal cover unless the day changes."}</li>
        </ul>
      </article>

      <article className="app-card app-card-wide">
        <div className="app-card-topline">
          <p className="eyebrow">Role cover</p>
          <span className="fine-print">{profile.roles.length} roles in setup</span>
        </div>
        <div className="role-plan-grid">
          {plan.roleLines.map((line) => (
            <div key={line.role} className="role-plan-card">
              <span>{line.role}</span>
              <strong>{line.cover} peak</strong>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
