import type { Metadata } from "next";
import { AuthShell } from "../components/AuthShell";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Create Account | ScheduleLoop",
  description: "Create a ScheduleLoop account for business staffing planning.",
};

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Start planning your business"
      copy="Create an account to configure your opening hours, roles and staffing assumptions."
    >
      <SignUpForm />
    </AuthShell>
  );
}
