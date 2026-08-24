"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthSession, restoreAuthSession, signOut } from "../lib/auth";
import { primaryCta, secondaryCta, siteConfig } from "../lib/siteConfig";

type SiteHeaderProps = {
  compact?: boolean;
};

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    restoreAuthSession().then((nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
    router.refresh();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${compact ? "site-header-compact" : ""}`}>
      <Link className="brand-link" href="/" aria-label="ScheduleLoop home">
        <img
          src="/brand-logo.png"
          alt="ScheduleLoop"
          width={1087}
          height={245}
          className="brand-logo"
        />
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        Menu
      </button>

      <nav
        id="main-navigation"
        className={`header-nav ${menuOpen ? "header-nav-open" : ""}`}
        aria-label="Main navigation"
      >
        <Link href={siteConfig.routes.product} onClick={closeMenu}>Product</Link>
        <Link href={siteConfig.routes.howItWorks} onClick={closeMenu}>How It Works</Link>
        <Link href={siteConfig.routes.whoItsFor} onClick={closeMenu}>Who It&apos;s For</Link>
        <Link href={siteConfig.routes.demo} onClick={closeMenu}>{secondaryCta}</Link>
        <Link href={siteConfig.routes.faq} onClick={closeMenu}>FAQ</Link>
        <Link href={siteConfig.routes.contact} onClick={closeMenu}>Contact</Link>
        {ready && session ? (
          <>
            <Link href="/dashboard" onClick={closeMenu}>Open Dashboard</Link>
            <button className="nav-button" type="button" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href={siteConfig.routes.signIn} onClick={closeMenu}>Sign In</Link>
            <Link className="nav-cta" href={siteConfig.routes.walkthrough} onClick={closeMenu}>
              {primaryCta}
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
