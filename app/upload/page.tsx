import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { requireServerAuthUser } from "../lib/serverAuth";

export const metadata: Metadata = {
  title: "CSV Upload | ScheduleLoop",
};

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const user = await requireServerAuthUser("/upload");

  return (
    <AppShell
      user={user}
      active="upload"
      title="CSV upload"
      description="Upload trading history when you are ready to improve forecast confidence."
    >
      <section className="app-card upload-card">
        <p className="eyebrow">Trading history</p>
        <h2>CSV demand upload</h2>
        <p>
          CSV files should include a timestamp, time, date or datetime column.
          Demand columns can include orders, sales, customers, bookings or check-ins.
        </p>
        <label className="field-label" htmlFor="csv-file">
          Choose CSV file
        </label>
        <input id="csv-file" type="file" accept=".csv,text/csv" />
        <p className="fine-print">
          Upload processing still needs the production forecasting backend before this
          form can save live business data.
        </p>
      </section>
    </AppShell>
  );
}
