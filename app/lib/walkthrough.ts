import { siteConfig } from "./siteConfig";

export type WalkthroughRequest = {
  fullName: string;
  businessName: string;
  workEmail: string;
  businessType: string;
  teamSize: string;
  schedulingMethod: string;
  message: string;
};

export type WalkthroughSubmissionResult =
  | { status: "email_opened" }
  | { status: "missing_contact_email"; requestSummary: string };

export function isConfiguredContactEmail() {
  return Boolean(siteConfig.contactEmail && !siteConfig.contactEmail.includes("["));
}

export function buildWalkthroughEmail(request: WalkthroughRequest) {
  const subject = `ScheduleLoop walkthrough request - ${request.businessName}`;
  const body = [
    "Hi ScheduleLoop,",
    "",
    "I would like to arrange a walkthrough.",
    "",
    `Full name: ${request.fullName}`,
    `Business name: ${request.businessName}`,
    `Work email: ${request.workEmail}`,
    `Business type: ${request.businessType}`,
    `Approximate team size: ${request.teamSize}`,
    `Current rota or scheduling method: ${request.schedulingMethod}`,
    "",
    "Optional message:",
    request.message || "None provided",
  ].join("\n");

  return { subject, body };
}

export function requestSummary(request: WalkthroughRequest) {
  const { subject, body } = buildWalkthroughEmail(request);
  return `${subject}\n\n${body}`;
}

export function submitWalkthroughRequest(request: WalkthroughRequest): WalkthroughSubmissionResult {
  if (!isConfiguredContactEmail()) {
    return {
      status: "missing_contact_email",
      requestSummary: requestSummary(request),
    };
  }

  const { subject, body } = buildWalkthroughEmail(request);
  const params = new URLSearchParams({ subject, body });
  window.location.href = `mailto:${siteConfig.contactEmail}?${params.toString()}`;
  return { status: "email_opened" };
}
