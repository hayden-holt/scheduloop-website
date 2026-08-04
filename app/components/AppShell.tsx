"use client";

import Link from "next/link";
import { ProtectedRoute } from "./ProtectedRoute";
import { signOut } from "../lib/auth";

type AppShellProps = {
  title: string;
  description: string;
  active: "dashboard" | "setup" | "upload" | "plans" | "feedback" | "settings";
  children: React.ReactNode;
};

const navItems = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard" },
  { key: "setup", label: "Business setup", href: "/setup" },
  { key: "upload", label: "CSV upload", href: "/upload" },
  { key: "plans", label: "Saved plans", href: "/plans" },
  { key: "feedback", label: "Manager feedback", href: "/feedback" },
  { key: "settings", label: "Settings", href: "/settings" },
] as const;

export function AppShell({ title, description, active, children }: AppShellProps) {
  const handleSignOut = () => {
    signOut();
    window.location.assign("/");
  };

  return (
    <ProtectedRoute>
      <div className="product-app">
        <aside className="app-sidebar">
          <Link className="brand-link" href="/" aria-label="ScheduleLoop home">
            <span className="brand-mark" aria-hidden="true">SL</span>
            <span>
              <strong>ScheduleLoop</strong>
              <small>Planner view</small>
            </span>
          </Link>
          <nav aria-label="Product navigation">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active === item.key ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button className="button button-light sidebar-signout" type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </aside>
        <main className="app-main">
          <header className="app-page-header">
            <p className="eyebrow">Protected workspace</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
