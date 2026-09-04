# ScheduleLoop website

Public marketing, walkthrough, authentication and read-only product demonstration for ScheduleLoop.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm test
```

Copy `.env.example` to `.env.local` and add the Firebase web API key used by invited website accounts as `FIREBASE_WEB_API_KEY`. Firebase web configuration is public client configuration, not an administrator credential, but the website keeps it server-side so the browser only talks to same-origin ScheduleLoop auth endpoints. Never add service-account JSON, private keys or server secrets to a browser-exposed variable.

## Authentication

The website accepts email/password credentials through a same-origin API route, verifies them with Firebase on the server, then creates a short-lived `Secure`, `HttpOnly`, `SameSite=Lax`, `__Host-` cookie. Protected pages validate that cookie with Firebase on the server before rendering and require a verified email address. Tokens are not stored in `localStorage` or `sessionStorage`, and the cookie expires after approximately 55 minutes.

The real staffing application has its own Firebase client and database rules. The website workspace routes are separate and contain no live customer business data.

## Security

Production responses include CSP, HSTS, frame protection, MIME sniffing protection, a strict referrer policy and a restrictive permissions policy. The session API has best-effort per-IP and per-user throttling; an edge rate-limit rule is still required for reliable distributed enforcement.

See [docs/SECURITY.md](docs/SECURITY.md) for the architecture, cloud-console checklist, remaining risks and incident steps.

## Hosting

This project is hosted with Sites using `.openai/hosting.json`. Keep hosting configuration and runtime values in the hosting service. Do not commit local `.env*` files.
