"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  isConfiguredContactEmail,
  submitWalkthroughRequest,
  WalkthroughRequest,
} from "../lib/walkthrough";

const businessTypes = [
  "Cafe or coffee shop",
  "Restaurant",
  "Bar or pub",
  "Gym or leisure venue",
  "Retail store",
  "Other shift-based business",
];

const teamSizes = ["1-5", "6-15", "16-30", "31-50", "50+"];

const schedulingMethods = [
  "Spreadsheet",
  "Paper rota",
  "Scheduling software",
  "Payroll system",
  "Mostly from memory",
  "Other",
];

const initialRequest: WalkthroughRequest = {
  fullName: "",
  businessName: "",
  workEmail: "",
  businessType: businessTypes[0],
  teamSize: teamSizes[1],
  schedulingMethod: schedulingMethods[0],
  message: "",
};

export function WalkthroughForm() {
  const [request, setRequest] = useState<WalkthroughRequest>(initialRequest);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "email_opened" | "needs_email">("idle");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  const emailConfigured = useMemo(() => isConfiguredContactEmail(), []);

  const updateField = (field: keyof WalkthroughRequest, value: string) => {
    setRequest((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;
    setError("");
    setSummary("");

    if (website.trim()) return;
    if (!request.fullName.trim() || !request.businessName.trim()) {
      setError("Add your name and business name so we know who the walkthrough is for.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.workEmail.trim())) {
      setError("Enter a valid work email address.");
      return;
    }

    setStatus("loading");
    const result = submitWalkthroughRequest({
      ...request,
      fullName: request.fullName.trim(),
      businessName: request.businessName.trim(),
      workEmail: request.workEmail.trim(),
      message: request.message.trim(),
    });

    if (result.status === "email_opened") {
      setStatus("email_opened");
      return;
    }

    setSummary(result.requestSummary);
    setStatus("needs_email");
  };

  return (
    <form className="walkthrough-form" id="request-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div>
          <label className="field-label" htmlFor="full-name">
            Full name
          </label>
          <input
            id="full-name"
            name="name"
            type="text"
            autoComplete="name"
            value={request.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="business-name">
            Business name
          </label>
          <input
            id="business-name"
            name="organization"
            type="text"
            autoComplete="organization"
            value={request.businessName}
            onChange={(event) => updateField("businessName", event.target.value)}
            required
          />
        </div>
      </div>

      <label className="field-label" htmlFor="work-email">
        Work email
      </label>
      <input
        id="work-email"
        name="email"
        type="email"
        autoComplete="email"
        value={request.workEmail}
        onChange={(event) => updateField("workEmail", event.target.value)}
        required
      />

      <div className="form-grid">
        <div>
          <label className="field-label" htmlFor="business-type">
            Business type
          </label>
          <select
            id="business-type"
            name="businessType"
            value={request.businessType}
            onChange={(event) => updateField("businessType", event.target.value)}
          >
            {businessTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="team-size">
            Approximate team size
          </label>
          <select
            id="team-size"
            name="teamSize"
            value={request.teamSize}
            onChange={(event) => updateField("teamSize", event.target.value)}
          >
            {teamSizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="field-label" htmlFor="scheduling-method">
        Current rota or scheduling method
      </label>
      <select
        id="scheduling-method"
        name="schedulingMethod"
        value={request.schedulingMethod}
        onChange={(event) => updateField("schedulingMethod", event.target.value)}
      >
        {schedulingMethods.map((method) => (
          <option key={method}>{method}</option>
        ))}
      </select>

      <label className="field-label" htmlFor="optional-message">
        Optional message
      </label>
      <textarea
        id="optional-message"
        name="message"
        rows={5}
        autoComplete="off"
        placeholder="Opening hours, roles, busy days or what you want to understand first."
        value={request.message}
        onChange={(event) => updateField("message", event.target.value)}
      />

      <label className="honeypot-field" htmlFor="website">
        Website
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </label>

      {!emailConfigured && (
        <p className="form-note" role="status">
          Walkthrough requests are ready in the page, but delivery still needs a confirmed
          ScheduleLoop contact email before the form can send directly.
        </p>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {status === "email_opened" && (
        <p className="form-success" role="status">
          Your email app should open with the walkthrough request. Please send the email to
          complete the request.
        </p>
      )}

      {status === "needs_email" && (
        <div className="form-error" role="alert">
          <p>
            This request has not been sent yet because a public ScheduleLoop contact email has
            not been connected.
          </p>
          <textarea readOnly rows={9} value={summary} aria-label="Walkthrough request details" />
        </div>
      )}

      <button className="button button-primary form-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Preparing request..." : "Request My Walkthrough"}
      </button>
    </form>
  );
}
