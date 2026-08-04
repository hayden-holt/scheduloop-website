"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AuthSession,
  onAuthSessionChange,
  restoreAuthSession,
  signOut,
} from "../lib/auth";

type SiteHeaderProps = {
  compact?: boolean;
};

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = () => {
      restoreAuthSession().then((nextSession) => {
        if (!mounted) return;
        setSession(nextSession);
        setReady(true);
      });
    };
    load();
    const unsubscribe = onAuthSessionChange(load);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    window.location.assign("/");
  };

  return (
    <header className={`site-header ${compact ? "site-header-compact" : ""}`}>
      <Link className="brand-link" href="/" aria-label="ScheduleLoop home">
        <span className="brand-mark" aria-hidden="true">SL</span>
        <span>
          <strong>ScheduleLoop</strong>
          <small>Demand-shaped staffing</small>
        </span>
      </Link>

      <nav className="header-nav" aria-label="Main navigation">
        <Link href="/try">Try ScheduleLoop</Link>
        {ready && session ? (
          <>
            <Link href="/dashboard">Open Dashboard</Link>
            <button className="nav-button" type="button" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/sign-in">Sign In</Link>
            <Link className="nav-cta" href="/sign-up">Create Account</Link>
          </>
        )}
      </nav>
    </header>
  );
}
