import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Terms | ScheduleLoop",
};

export default function TermsPage() {
  return (
    <main className="site-shell text-page">
      <SiteHeader compact />
      <section className="legal-page">
        <p className="eyebrow">Terms</p>
        <h1>Terms</h1>
        <p>
          ScheduleLoop provides planning guidance for staffing decisions. It does
          not publish rotas, process payroll or replace manager judgement.
        </p>
        <p>
          Replace this page with your production terms before inviting customers
          to create accounts.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
