export type AuthSession = {
  localId: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
};

export class AuthError extends Error {
  code: string;

  constructor(message: string, code = "auth/error") {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function restoreAuthSession(): Promise<AuthSession | null> {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch("/api/auth/session", {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { user?: AuthSession };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function signInWithEmail(email: string, password: string) {
  const result = await postAuthJson<{
    user?: AuthSession;
  }>("/api/auth/session", { email, password });

  if (!result.user) throw new AuthError("We could not start a secure session.");
  return result.user;
}

export async function sendPasswordReset(email: string) {
  await postAuthJson<{ ok: boolean }>("/api/auth/password-reset", { email });
}

export async function signOut() {
  if (typeof window === "undefined") return;
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  }).catch(() => undefined);
}

export function safeRedirectTarget(value: string | null, fallback = "/dashboard") {
  if (!value) return fallback;
  try {
    const url = new URL(value, "https://scheduleloop.local");
    if (url.origin !== "https://scheduleloop.local") return fallback;
    if (["/sign-in", "/sign-up", "/forgot-password"].includes(url.pathname)) {
      return fallback;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

async function postAuthJson<T>(url: string, body: Record<string, unknown>) {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthError("We could not reach ScheduleLoop. Please try again.");
  }

  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };

  if (!response.ok) {
    const code = data.error ?? "auth/error";
    throw new AuthError(translateApiAuthError(code), code);
  }

  return data;
}

function translateApiAuthError(code?: string) {
  switch (code) {
    case "invalid-credentials":
      return "The email address or password is incorrect.";
    case "email-verification-required":
      return "Verify your email before signing in. We have sent a new verification link if one was needed.";
    case "rate-limited":
      return "Too many attempts. Please try again later.";
    case "missing-config":
      return "Sign in is still being configured. Please try again shortly.";
    case "invalid-request":
      return "Check the details and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
