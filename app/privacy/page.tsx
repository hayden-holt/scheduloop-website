import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { siteConfig } from "../lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy Policy | ScheduleLoop",
  description: "How ScheduleLoop handles contact details, account data and uploaded business data.",
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
        <p className="legal-updated">Last updated: 4 August 2026</p>

        <h2>Who we are</h2>
        <p>
          ScheduleLoop is operated by {siteConfig.legalBusinessName}. Contact:
          {" "}{siteConfig.contactEmail}. Registered address: {siteConfig.registeredAddress}.
        </p>

        <h2>Information we collect</h2>
        <p>
          ScheduleLoop may collect contact details submitted through walkthrough requests,
          account details for invited early-access users, business setup information such as
          opening hours and roles, and business data that users choose to upload.
        </p>

        <h2>Uploaded business data</h2>
        <p>
          Uploaded CSV files may include trading history such as timestamps, sales, orders,
          bookings, covers, check-ins or similar demand indicators. Users should only upload
          information they have permission to use for staffing planning.
        </p>

        <h2>How information is used</h2>
        <p>
          Contact-form information is used to respond to walkthrough requests. Account and
          business information is used to provide staffing guidance and improve early-access
          product decisions. ScheduleLoop does not sell uploaded business data.
        </p>

        <h2>Authentication and service providers</h2>
        <p>
          The application is designed to use Firebase Authentication for invited user access.
          Hosting, authentication and storage providers may process information only as needed
          to operate the service.
        </p>

        <h2>Retention and deletion</h2>
        <p>
          Early-access information may be retained while ScheduleLoop is being configured,
          tested or supported. Users can request access, correction or deletion through the
          contact email above once it has been confirmed.
        </p>

        <h2>Cookies and analytics</h2>
        <p>
          ScheduleLoop does not currently describe any non-essential analytics or marketing
          cookies on this website. If analytics are added later, this policy should be updated
          to explain what is collected and why.
        </p>

        <h2>Important note</h2>
        <p>
          This early-stage policy is intended to describe the current product honestly. It is
          not legal advice and should be reviewed before relying on it for customer contracts.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
