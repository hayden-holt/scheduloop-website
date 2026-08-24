import Link from "next/link";
import type { ServerAuthUser } from "../lib/serverAuth";

type AppShellProps = {
  title: string;
  description: string;
  active: "dashboard" | "setup" | "upload" | "plans" | "feedback" | "settings";
  user: ServerAuthUser;
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

export function AppShell({ title, description, active, user, children }: AppShellProps) {
  return (
    <div className="product-app">
        <aside className="app-sidebar">
          <Link className="brand-link" href="/" aria-label="ScheduleLoop home">
            <img
              src="/brand-logo.png"
              alt="ScheduleLoop"
              width={1087}
              height={245}
              className="brand-logo"
            />
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
          <form action="/api/auth/logout" method="post">
            <button className="button button-light sidebar-signout" type="submit">
              Sign Out
            </button>
          </form>
        </aside>
        <main className="app-main">
          <header className="app-page-header">
            <p className="eyebrow">Protected workspace</p>
            <h1>{title}</h1>
            <p>{description}</p>
            <span className="fine-print">Signed in as {user.email}</span>
          </header>
          {children}
        </main>
    </div>
  );
}
