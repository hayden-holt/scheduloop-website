import type { Metadata } from "next";
import { AuthShell } from "../components/AuthShell";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In | ScheduleLoop",
  description: "Sign in to continue planning staffing, building rotas and managing your business setup.",
  alternates: {
    canonical: "/sign-in",
  },
};

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Secure access"
      title="Welcome back"
      copy="Sign in to continue planning staffing, building rotas and managing your business setup."
    >
      <SignInForm />
    </AuthShell>
  );
}
