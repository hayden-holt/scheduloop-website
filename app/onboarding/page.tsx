import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { requireServerAuthUser } from "../lib/serverAuth";
import { OnboardingForm } from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Business Setup | ScheduleLoop",
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await requireServerAuthUser("/onboarding");

  return (
    <AppShell
      user={user}
      active="setup"
      title="Set up ScheduleLoop"
      description="Add the business details ScheduleLoop needs before creating the first staffing plan."
    >
      <OnboardingForm email={user.email} />
    </AppShell>
  );
}
