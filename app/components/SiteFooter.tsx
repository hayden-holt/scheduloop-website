import Link from "next/link";
import { primaryCta, secondaryCta, siteConfig } from "../lib/siteConfig";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-summary">
        <Link className="footer-brand" href="/">
          <img src="/brand-logo.png" alt="ScheduleLoop" width={1087} height={245} />
        </Link>
        <p>
          Know how much cover the day needs, then build the rota around it. ScheduleLoop
          connects expected demand, staffing guidance and employee shifts.
        </p>
        <div className="footer-meta">
          <p>Founders: {siteConfig.founderNames}</p>
          <p>
            Email: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </p>
        </div>
      </div>
      <nav aria-label="Footer navigation">
        <Link href={siteConfig.routes.product}>Product</Link>
        <Link href={siteConfig.routes.howItWorks}>How It Works</Link>
        <Link href={siteConfig.routes.whoItsFor}>Who It&apos;s For</Link>
        <Link href={siteConfig.routes.demo}>{secondaryCta}</Link>
        <Link href={siteConfig.routes.walkthrough}>{primaryCta}</Link>
        <Link href={siteConfig.routes.signIn}>Sign In</Link>
        <Link href={siteConfig.routes.privacy}>Privacy Policy</Link>
        <Link href={siteConfig.routes.terms}>Terms</Link>
      </nav>
      <p className="footer-copyright">
        Copyright {new Date().getFullYear()} ScheduleLoop.
      </p>
    </footer>
  );
}
