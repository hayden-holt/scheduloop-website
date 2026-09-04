import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireServerAuthUser } from "../lib/serverAuth";

export const metadata: Metadata = {
  title: "Business Setup | ScheduleLoop",
};

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  await requireServerAuthUser("/setup");
  redirect("/onboarding");
}
