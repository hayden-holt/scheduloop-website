import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE_NAME = "__Host-scheduleloop_session";
export const SESSION_MAX_AGE_SECONDS = 55 * 60;

export type ServerAuthUser = {
  localId: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
};

export class FirebaseAuthError extends Error {
  code: string;
  status: number;

  constructor(code: string, status: number) {
    super(code);
    this.name = "FirebaseAuthError";
    this.code = code;
    this.status = status;
  }
}

export async function getServerAuthUser(): Promise<ServerAuthUser | null> {
  const requestHeaders = await headers();
  const token = readCookie(
    requestHeaders.get("cookie") ?? "",
    SESSION_COOKIE_NAME,
  );
  if (!token) return null;
  return verifyFirebaseIdToken(token);
}

export async function requireServerAuthUser(returnTo: string) {
  const user = await getServerAuthUser();
  if (!user || !user.emailVerified) {
    redirect(`/sign-in?redirect=${encodeURIComponent(safeReturnPath(returnTo))}`);
  }
  return user;
}

export async function verifyFirebaseIdToken(
  idToken: string,
): Promise<ServerAuthUser | null> {
  const apiKey = getFirebaseApiKey();
  if (!isValidFirebaseApiKey(apiKey) || idToken.length < 100 || idToken.length > 4096) {
    return null;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
      },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as {
      users?: Array<{
        localId?: string;
        email?: string;
        displayName?: string;
        emailVerified?: boolean;
      }>;
    };
    const user = data.users?.[0];
    if (!user?.localId || !user.email) return null;

    return {
      localId: user.localId,
      email: user.email,
      displayName: user.displayName || user.email,
      emailVerified: user.emailVerified === true,
    };
  } catch {
    return null;
  }
}

export async function signInWithFirebasePassword(email: string, password: string) {
  const data = await firebaseAuthJson<{ idToken?: string }>("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });

  if (!data.idToken) throw new FirebaseAuthError("INVALID_LOGIN_CREDENTIALS", 401);
  return data.idToken;
}

export async function sendFirebaseEmailVerification(idToken: string) {
  await firebaseAuthJson("accounts:sendOobCode", {
    requestType: "VERIFY_EMAIL",
    idToken,
  });
}

export async function sendFirebasePasswordReset(email: string) {
  await firebaseAuthJson("accounts:sendOobCode", {
    requestType: "PASSWORD_RESET",
    email,
  });
}

export function createSessionCookie(idToken: string) {
  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(idToken)}`,
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Priority=High",
  ].join("; ");
}

export function clearSessionCookie() {
  return [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Priority=High",
  ].join("; ");
}

function readCookie(cookieHeader: string, name: string) {
  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName !== name) continue;
    try {
      return decodeURIComponent(rawValue.join("="));
    } catch {
      return null;
    }
  }
  return null;
}

function safeReturnPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

async function firebaseAuthJson<T>(path: string, body: Record<string, unknown>) {
  const apiKey = getFirebaseApiKey();
  if (!isValidFirebaseApiKey(apiKey)) {
    throw new FirebaseAuthError("MISSING_FIREBASE_CONFIG", 503);
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/${path}?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new FirebaseAuthError(data.error?.message ?? "FIREBASE_AUTH_ERROR", response.status);
  }

  return data;
}

function getFirebaseApiKey() {
  return (
    process.env.FIREBASE_WEB_API_KEY ??
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    ""
  ).trim();
}

function isValidFirebaseApiKey(key: string) {
  return key.length > 12 && !key.includes("your-") && !key.includes("YOUR_");
}
