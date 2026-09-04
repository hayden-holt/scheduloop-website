# Website security and privacy operations

## Implemented controls

- Next.js is pinned to a patched release and the production dependency audit is part of release verification.
- Email/password credentials are submitted only to same-origin ScheduleLoop API routes, then verified with Firebase from the server.
- Protected routes validate a short-lived Firebase ID token on the server before rendering.
- The session token is held only in a `Secure`, `HttpOnly`, `SameSite=Lax`, `__Host-` cookie for up to 55 minutes.
- Email verification is required before the server creates a website session.
- First-run business profiles are stored in the Sites D1 binding and are keyed by the Firebase user ID.
- Login errors do not distinguish an unknown account from an incorrect password.
- Password reset responses do not reveal whether an account exists.
- The session exchange checks same-origin requests and applies best-effort IP and user throttles.
- Production responses include CSP, HSTS, `nosniff`, `DENY` frame protection, referrer, permissions, opener and resource policies.
- The walkthrough form currently opens a `mailto:` draft. There is no server-side form submission endpoint or stored form record to rate-limit.
- Production browser source maps are disabled.

## Firebase console checklist

Complete these steps before treating website authentication as production-ready:

1. In Firebase Authentication, enable email/password sign-in only for the intended project and configure the verification-email and password-reset templates with the ScheduleLoop domain.
2. Enable email-enumeration protection and set a strong password policy of at least 12 characters, requiring a mixture of character classes where Firebase permits it.
3. Restrict authorised authentication domains to the production ScheduleLoop domains and required local-development hosts.
4. Review Authentication quotas and Google Cloud quota alerts. Alert on unusual sign-in failures, password resets and account creation.
5. In Google Cloud Identity Platform > Settings > User activity, disable end-user account creation while keeping sign-in enabled. This may require upgrading Firebase Authentication to Authentication with Identity Platform. Provision invited users manually until a protected invite service is available.
6. Test disabling a user and confirm that their next server validation fails. The current website intentionally does not use refresh tokens, so the maximum normal session is 55 minutes.

## Cloudflare/Sites checklist

1. Add an edge rate-limit rule for `POST /api/auth/session`: 20 requests per IP per 60 seconds, with a managed challenge or temporary block.
2. Add a stricter alert threshold for repeated `401`, `403` and `429` responses on authentication routes.
3. Confirm TLS is set to strict mode and that HTTP redirects to HTTPS before relying on HSTS.
4. Review the CSP report in browser developer tools whenever Firebase endpoints or new third-party services are added. Do not broaden `script-src` or `connect-src` without a concrete requirement.

The in-process throttle is a defence-in-depth control only. Worker isolates do not share memory, so it cannot replace the edge rule.

## Privacy operations

1. Confirm and document a correspondence/service address for the controllers before processing personal data at material scale.
2. Maintain a processor register and signed data-processing terms for hosting, Firebase, email and any analytics provider.
3. Record deletion requests and complete account/business-data deletion within the published period.
4. Review the stated retention and backup periods against provider settings at least every six months.
5. Keep a tested export and deletion process for the Firebase application. Do not ask users to email raw CSV files.

## Secrets and releases

- Store the Firebase web API key in Sites as `FIREBASE_WEB_API_KEY`. Firebase web API keys are public identifiers and must still be restricted to expected APIs and domains in Google Cloud.
- Never commit `.env`, service-account JSON, private keys, Stripe secrets, Supabase service-role keys or Firebase Admin credentials.
- Before release, run `npm audit --omit=dev`, the build/tests, a source-map check and the repository secret scan described in the audit report.
- Rotate any credential immediately if it appears in source control or logs, then remove it from history using a reviewed incident procedure.

## Remaining architecture risk

The website uses a server-validated Firebase ID token as a short session rather than a Firebase Admin session cookie. This avoids long-lived browser refresh tokens and protects SSR output, but it cannot provide multi-day sessions or a first-party revocation cache. A future backend with securely managed Firebase Admin credentials can exchange ID tokens with `createSessionCookie`, call `verifySessionCookie(..., true)`, and manage revocation without exposing administrator credentials to the browser or repository.

The full development dependency audit currently reports two high-severity denial-of-service advisories in `image-size@2.0.2`, pulled in by `vinext@0.0.50`. Version 2.0.2 is the latest upstream release and npm offers no non-breaking patched version. The production dependency audit reports zero findings, and ScheduleLoop does not accept user image uploads or pass user-controlled image files to vinext; only deployment-controlled assets are eligible for image handling. Recheck this advisory on every dependency update and upgrade as soon as vinext or `image-size` publishes a fix.
