import type { Metadata } from "next";
import { AuthShell } from "../components/AuthShell";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In | ScheduleLoop",
  description: "Sign in to continue planning staffing around the shape of your day.",
  alternates: {
    canonical: "/sign-in",
  },
};

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Secure access"
      title="Welcome back"
      copy="Sign in to continue planning staffing around the shape of your day."
    >
      <SignInForm />
    </AuthShell>
  );
}
