import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE_NAME = "__Host-scheduleloop_session";
export const SESSION_MAX_AGE_SECONDS = 55 * 60;

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";

export type ServerAuthUser = {
  localId: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
};

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
  if (!hasFirebaseServerConfig() || idToken.length < 100 || idToken.length > 4096) {
    return null;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(API_KEY)}`,
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

function hasFirebaseServerConfig() {
  const key = API_KEY.trim();
  return key.length > 12 && !key.includes("your-") && !key.includes("YOUR_");
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
