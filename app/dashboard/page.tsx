import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { requireServerAuthUser } from "../lib/serverAuth";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | ScheduleLoop",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireServerAuthUser("/dashboard");

  return (
    <AppShell
      user={user}
      active="dashboard"
      title="Today's staffing plan"
      description="Review forecast confidence, busiest windows and the cover blocks ready for manager judgement."
    >
      <DashboardClient />
    </AppShell>
  );
}
