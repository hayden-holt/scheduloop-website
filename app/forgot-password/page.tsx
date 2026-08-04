import type { Metadata } from "next";
import { AuthShell } from "../components/AuthShell";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | ScheduleLoop",
  description: "Send a ScheduleLoop password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account help"
      title="Reset your password"
      copy="Enter the email address connected to your ScheduleLoop account and we will send you a reset link."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
