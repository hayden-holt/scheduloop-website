import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { siteConfig } from "../lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy Policy | ScheduleLoop",
  description: "How ScheduleLoop handles contact, account and uploaded business data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="site-shell text-page">
      <SiteHeader compact />
      <section className="legal-page">
        <p className="eyebrow">Privacy</p>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: 7 August 2026</p>

        <h2>1. Who controls your information</h2>
        <p>
          ScheduleLoop is an early-stage product operated by {siteConfig.founderNames} in the {siteConfig.founderLocation}.
          They are the controllers of personal information collected through the public website and early-access service.
          Privacy requests can be sent to <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
        </p>

        <h2>2. Information we collect</h2>
        <ul>
          <li>Contact details, including name, email address, business name and walkthrough messages.</li>
          <li>Account information, including Firebase user ID, email-verification status and authentication events.</li>
          <li>Business profile data, including opening hours, locations, roles, wage assumptions and staffing settings.</li>
          <li>Rota data, including employee display names, roles, shift times, breaks and optional hourly rates.</li>
          <li>Uploaded or derived demand data, including CSV column names, timestamps, orders, sales, bookings, covers, check-ins and staffing counts.</li>
          <li>Technical and security data, including IP address, browser information, request logs and abuse-prevention signals.</li>
        </ul>

        <h2>3. How we use information and our lawful bases</h2>
        <p>
          We use information to respond to enquiries, provide requested walkthroughs, authenticate invited users, deliver staffing forecasts and rotas,
          protect the service, troubleshoot faults and improve the early-access product. We rely on steps taken before entering a contract and performance
          of a contract where we provide a requested service, legitimate interests in operating and securing ScheduleLoop, legal obligations where they
          apply, and consent for any optional marketing communication. Consent can be withdrawn at any time.
        </p>

        <h2>4. CSV and business data</h2>
        <p>
          CSV files are processed in the browser to create a derived demand model. ScheduleLoop does not need employee names, customer names, payment-card
          information, health information or other special-category data in a CSV. Users must remove unnecessary personal information and only upload data
          they are authorised to use. The current app stores the derived demand model in the owner&apos;s Firestore business profile rather than storing the
          original CSV file. Uploaded demand data can be removed from the app&apos;s privacy controls or through a deletion request.
        </p>

        <h2>5. Providers and processors</h2>
        <p>
          ScheduleLoop uses OpenAI Sites and Cloudflare infrastructure for website hosting and delivery, Google Firebase for authentication and Firestore,
          GitHub for source-code hosting and deployment workflows, and an email provider to receive and answer enquiries. These providers process information
          under their own security and data-protection terms. We do not sell personal information or uploaded business data.
        </p>

        <h2>6. International transfers</h2>
        <p>
          Some providers may process data outside the United Kingdom. Where required, transfers are protected by an adequacy decision, the UK International
          Data Transfer Agreement or UK Addendum to approved standard contractual clauses, together with provider security measures.
        </p>

        <h2>7. Retention</h2>
        <ul>
          <li>Walkthrough and support enquiries are normally retained for up to 24 months after the last meaningful contact.</li>
          <li>Account, profile, rota and derived demand data are retained while the account is active. Verified deletion requests are normally completed within one month, subject to any legal reason to retain specific records.</li>
          <li>Security and diagnostic logs are normally retained for up to 12 months unless a longer period is needed to investigate abuse or meet a legal obligation.</li>
          <li>ScheduleLoop does not currently create a separate application backup of customer CSV or rota data. Provider resilience copies, where applicable, are isolated from normal use and expire under the provider&apos;s standard rotation schedule.</li>
        </ul>

        <h2>8. Cookies and browser storage</h2>
        <p>
          The website uses a Secure, HttpOnly, SameSite session cookie after sign-in. It expires after approximately 55 minutes and is not available to
          browser scripts. The website does not store Firebase refresh tokens in localStorage. The separate application may use session-scoped Firebase
          browser storage for authentication and local preferences. ScheduleLoop does not currently use advertising cookies. Any future non-essential
          analytics will be described here and, where required, presented with a consent choice before use.
        </p>

        <h2>9. Security and backups</h2>
        <p>
          Measures include encrypted HTTPS connections, server-validated sessions, email verification, owner-scoped database rules, restrictive security
          headers, input and file limits, access controls, dependency monitoring and provider-managed backups. No internet service can guarantee absolute
          security, so suspected incidents should be reported promptly to the contact address above.
        </p>

        <h2>10. Your rights</h2>
        <p>
          Depending on the circumstances, UK data-protection law gives you rights to access, correct, erase, restrict or object to processing, receive a
          portable copy of information you provided, and withdraw consent. We may need to verify your identity before acting on a request and normally respond
          within one month. You can also complain to the UK Information Commissioner&apos;s Office through <a href="https://ico.org.uk/make-a-complaint/" rel="noreferrer">ico.org.uk</a>.
        </p>

        <h2>11. Changes to this policy</h2>
        <p>
          We will update this page when the service, providers or legal requirements change. Material changes will be highlighted through the website or the
          account contact address where practical.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
