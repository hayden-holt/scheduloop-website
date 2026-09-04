import {
  FirebaseAuthError,
  sendFirebasePasswordReset,
} from "../../../lib/serverAuth";
import {
  consumeRateLimit,
  getRequestIp,
  isSameOriginRequest,
} from "../../../lib/rateLimit";

const JSON_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "invalid-request" }, { status: 403, headers: JSON_HEADERS });
  }

  const ipLimit = consumeRateLimit(`password-reset:ip:${getRequestIp(request)}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (!ipLimit.allowed) {
    return Response.json(
      { error: "rate-limited" },
      {
        status: 429,
        headers: { ...JSON_HEADERS, "Retry-After": String(ipLimit.retryAfterSeconds) },
      },
    );
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!email) {
    return Response.json({ ok: true }, { headers: JSON_HEADERS });
  }

  try {
    await sendFirebasePasswordReset(email);
  } catch (error) {
    if (isNonRevealingResetError(error)) {
      return Response.json({ ok: true }, { headers: JSON_HEADERS });
    }
    if (
      error instanceof FirebaseAuthError &&
      ["MISSING_FIREBASE_CONFIG", "OPERATION_NOT_ALLOWED"].includes(error.code)
    ) {
      return Response.json({ error: "missing-config" }, { status: 503, headers: JSON_HEADERS });
    }
    if (error instanceof FirebaseAuthError && error.code === "TOO_MANY_ATTEMPTS_TRY_LATER") {
      return Response.json(
        { error: "rate-limited" },
        { status: 429, headers: { ...JSON_HEADERS, "Retry-After": "60" } },
      );
    }
    return Response.json({ error: "auth-failed" }, { status: 500, headers: JSON_HEADERS });
  }

  return Response.json({ ok: true }, { headers: JSON_HEADERS });
}

function isNonRevealingResetError(error: unknown) {
  return (
    error instanceof FirebaseAuthError &&
    ["EMAIL_NOT_FOUND", "USER_NOT_FOUND", "INVALID_EMAIL"].includes(error.code)
  );
}
