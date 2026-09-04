import {
  createSessionCookie,
  FirebaseAuthError,
  getServerAuthUser,
  sendFirebaseEmailVerification,
  signInWithFirebasePassword,
  verifyFirebaseIdToken,
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

export async function GET() {
  const user = await getServerAuthUser();
  if (!user || !user.emailVerified) {
    return Response.json({ authenticated: false }, { status: 401, headers: JSON_HEADERS });
  }
  return Response.json({ authenticated: true, user }, { headers: JSON_HEADERS });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "invalid-request" }, { status: 403, headers: JSON_HEADERS });
  }

  const ipLimit = consumeRateLimit(`session:ip:${getRequestIp(request)}`, {
    limit: 20,
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

  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
    idToken?: unknown;
  } | null;
  const hasCredentials = typeof body?.email === "string" && typeof body?.password === "string";
  let idToken = typeof body?.idToken === "string" ? body.idToken : "";

  if (!idToken && hasCredentials) {
    try {
      idToken = await signInWithFirebasePassword(body.email.trim(), body.password);
    } catch (error) {
      return firebaseAuthErrorResponse(error);
    }
  }

  if (!idToken) {
    return Response.json({ error: "invalid-request" }, { status: 400, headers: JSON_HEADERS });
  }

  const user = await verifyFirebaseIdToken(idToken);
  if (!user) {
    return Response.json({ error: "invalid-credentials" }, { status: 401, headers: JSON_HEADERS });
  }

  const userLimit = consumeRateLimit(`session:user:${user.localId}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (!userLimit.allowed) {
    return Response.json(
      { error: "rate-limited" },
      {
        status: 429,
        headers: { ...JSON_HEADERS, "Retry-After": String(userLimit.retryAfterSeconds) },
      },
    );
  }

  if (!user.emailVerified) {
    await sendFirebaseEmailVerification(idToken).catch(() => undefined);
    return Response.json(
      { error: "email-verification-required" },
      { status: 403, headers: JSON_HEADERS },
    );
  }

  return Response.json(
    { authenticated: true, user },
    {
      headers: {
        ...JSON_HEADERS,
        "Set-Cookie": createSessionCookie(idToken),
      },
    },
  );
}

function firebaseAuthErrorResponse(error: unknown) {
  if (!(error instanceof FirebaseAuthError)) {
    return Response.json({ error: "auth-failed" }, { status: 500, headers: JSON_HEADERS });
  }

  switch (error.code) {
    case "EMAIL_NOT_FOUND":
    case "USER_NOT_FOUND":
    case "INVALID_PASSWORD":
    case "INVALID_LOGIN_CREDENTIALS":
    case "INVALID_EMAIL":
      return Response.json(
        { error: "invalid-credentials" },
        { status: 401, headers: JSON_HEADERS },
      );
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return Response.json(
        { error: "rate-limited" },
        { status: 429, headers: { ...JSON_HEADERS, "Retry-After": "60" } },
      );
    case "MISSING_FIREBASE_CONFIG":
    case "OPERATION_NOT_ALLOWED":
      return Response.json({ error: "missing-config" }, { status: 503, headers: JSON_HEADERS });
    default:
      return Response.json({ error: "auth-failed" }, { status: 500, headers: JSON_HEADERS });
  }
}
