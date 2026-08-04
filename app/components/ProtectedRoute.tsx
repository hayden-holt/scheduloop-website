"use client";

import { useEffect, useState } from "react";
import { AuthSession, onAuthSessionChange, restoreAuthSession } from "../lib/auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    const check = () => {
      restoreAuthSession().then((nextSession) => {
        if (!mounted) return;
        setSession(nextSession);
        setChecking(false);
        if (!nextSession) {
          const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
          window.location.replace(`/sign-in?redirect=${encodeURIComponent(returnTo)}`);
        }
      });
    };

    check();
    const unsubscribe = onAuthSessionChange(check);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (checking || !session) {
    return (
      <main className="auth-loading" role="status" aria-live="polite">
        <span className="loading-dot" aria-hidden="true" />
        Checking your ScheduleLoop session...
      </main>
    );
  }

  return <>{children}</>;
}
