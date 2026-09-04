/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import {
  parseStoredBusinessProfile,
  sanitizeBusinessProfile,
} from "../app/lib/appProfile";
import { SECURITY_HEADERS } from "../security-headers";

interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
  FIREBASE_WEB_API_KEY?: string;
  NEXT_PUBLIC_FIREBASE_API_KEY?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/app/profile") {
      return withSecurityHeaders(await handleProfileRequest(request, env), request);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const response = await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(response, request);
    }

    const response = await handler.fetch(request, env, ctx);
    return withSecurityHeaders(response, request);
  },
};

function withSecurityHeaders(response: Response, request: Request) {
  const headers = new Headers(response.headers);
  for (const { key, value } of SECURITY_HEADERS) {
    if (key === "Strict-Transport-Security" && !request.url.startsWith("https://")) {
      continue;
    }
    headers.set(key, value);
  }

  const pathname = new URL(request.url).pathname;
  if (pathname.startsWith("/api/") || isProtectedPath(pathname)) {
    headers.set("Cache-Control", "no-store");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isProtectedPath(pathname: string) {
  return ["/dashboard", "/upload", "/setup", "/onboarding", "/settings", "/plans", "/feedback"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

const PROFILE_JSON_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

type FirebaseLookupUser = {
  localId: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
};

async function handleProfileRequest(request: Request, env: Env) {
  if (!env.DB) {
    return Response.json({ error: "missing-database" }, { status: 503, headers: PROFILE_JSON_HEADERS });
  }

  const user = await getFirebaseUserFromRequest(request, env);
  if (!user || !user.emailVerified) {
    return Response.json({ error: "not-authenticated" }, { status: 401, headers: PROFILE_JSON_HEADERS });
  }

  if (request.method === "GET") {
    const row = await env.DB.prepare(
      "SELECT profile_json FROM business_profiles WHERE user_id = ?"
    ).bind(user.localId).first<{ profile_json: string }>();
    const profile = parseStoredBusinessProfile(row?.profile_json);
    if (!profile) {
      return Response.json(
        { needsOnboarding: true, user: publicUser(user) },
        { status: 404, headers: PROFILE_JSON_HEADERS },
      );
    }

    return Response.json(
      { needsOnboarding: false, profile, user: publicUser(user) },
      { headers: PROFILE_JSON_HEADERS },
    );
  }

  if (request.method === "POST" || request.method === "PUT") {
    if (!isSameOriginRequest(request)) {
      return Response.json({ error: "invalid-request" }, { status: 403, headers: PROFILE_JSON_HEADERS });
    }

    const body = (await request.json().catch(() => null)) as { profile?: unknown } | null;
    const profile = sanitizeBusinessProfile(body?.profile ?? body);
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO business_profiles
        (user_id, email, profile_json, onboarding_complete, created_at, updated_at)
       VALUES (?, ?, ?, 1, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
        email = excluded.email,
        profile_json = excluded.profile_json,
        onboarding_complete = 1,
        updated_at = excluded.updated_at`
    ).bind(user.localId, user.email, JSON.stringify(profile), now, now).run();

    return Response.json(
      { needsOnboarding: false, profile, user: publicUser(user) },
      { headers: PROFILE_JSON_HEADERS },
    );
  }

  return Response.json({ error: "method-not-allowed" }, { status: 405, headers: PROFILE_JSON_HEADERS });
}

async function getFirebaseUserFromRequest(request: Request, env: Env) {
  const token = readCookie(request.headers.get("cookie") ?? "", "__Host-scheduleloop_session");
  const apiKey = getFirebaseApiKey(env);
  if (!token || !apiKey || token.length < 100 || token.length > 4096) return null;

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
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
    const firebaseUser = data.users?.[0];
    if (!firebaseUser?.localId || !firebaseUser.email) return null;

    return {
      localId: firebaseUser.localId,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email,
      emailVerified: firebaseUser.emailVerified === true,
    };
  } catch {
    return null;
  }
}

function publicUser(user: FirebaseLookupUser) {
  return {
    email: user.email,
    displayName: user.displayName,
  };
}

function getFirebaseApiKey(env: Env) {
  return (env.FIREBASE_WEB_API_KEY ?? env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "").trim();
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

function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) return origin === new URL(request.url).origin;

  const fetchSite = request.headers.get("sec-fetch-site");
  return !fetchSite || ["same-origin", "same-site", "none"].includes(fetchSite);
}

export default worker;
