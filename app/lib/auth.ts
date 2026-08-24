export type AuthSession = {
  localId: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
};

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";

export class AuthError extends Error {
  code: string;

  constructor(message: string, code = "auth/error") {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export function hasFirebaseConfig() {
  const key = API_KEY.trim();
  return key.length > 12 && !key.includes("your-") && !key.includes("YOUR_");
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
  ensureFirebaseReady();
  const data = await firebaseJson<FirebaseAuthResponse>(
    "accounts:signInWithPassword",
    {
      email,
      password,
      returnSecureToken: true,
    },
  );

  const response = await fetch("/api/auth/session", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken: data.idToken }),
  });
  const result = (await response.json().catch(() => ({}))) as {
    error?: string;
    user?: AuthSession;
  };

  if (response.status === 403 && result.error === "email-verification-required") {
    await firebaseJson("accounts:sendOobCode", {
      requestType: "VERIFY_EMAIL",
      idToken: data.idToken,
    }).catch(() => undefined);
    throw new AuthError(
      "Verify your email before signing in. We have sent a new verification link if one was needed.",
      "auth/email-not-verified",
    );
  }

  if (!response.ok || !result.user) {
    throw new AuthError(
      "We could not start a secure session. Please try again.",
      "auth/session-failed",
    );
  }

  return result.user;
}

export async function sendPasswordReset(email: string) {
  ensureFirebaseReady();
  try {
    await firebaseJson("accounts:sendOobCode", {
      requestType: "PASSWORD_RESET",
      email,
    });
  } catch (error) {
    if (
      error instanceof AuthError &&
      ["EMAIL_NOT_FOUND", "USER_NOT_FOUND", "INVALID_EMAIL"].includes(error.code)
    ) {
      return;
    }
    throw error;
  }
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

async function firebaseJson<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/${path}?key=${encodeURIComponent(API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: { message?: string };
  };

  if (!response.ok) {
    const code = data.error?.message ?? "auth/error";
    throw new AuthError(translateFirebaseError(code), code);
  }

  return data;
}

function ensureFirebaseReady() {
  if (!hasFirebaseConfig()) {
    throw new AuthError(
      "Sign in is currently available to invited early-access businesses. Request a walkthrough if you need access.",
      "auth/missing-config",
    );
  }
}

function translateFirebaseError(message?: string) {
  switch (message) {
    case "EMAIL_NOT_FOUND":
    case "USER_NOT_FOUND":
    case "INVALID_PASSWORD":
    case "INVALID_LOGIN_CREDENTIALS":
    case "INVALID_EMAIL":
      return "The email address or password is incorrect.";
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return "Too many attempts. Please try again later.";
    case "WEAK_PASSWORD : Password should be at least 6 characters":
    case "WEAK_PASSWORD":
      return "Use a password with at least 8 characters.";
    case "OPERATION_NOT_ALLOWED":
      return "Sign in is not currently available. Please contact ScheduleLoop support.";
    case "MISSING_PASSWORD":
      return "Enter your password to continue.";
    default:
      return "Something went wrong. Please try again.";
  }
}

type FirebaseAuthResponse = {
  idToken: string;
};
