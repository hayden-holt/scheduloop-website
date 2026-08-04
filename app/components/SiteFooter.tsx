import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">ScheduleLoop</Link>
        <p>A daily staffing plan shaped around demand, roles and local context.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/try">Try ScheduleLoop</Link>
        <Link href="/sign-in">Sign In</Link>
        <Link href="/sign-up">Create Account</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </footer>
  );
}
