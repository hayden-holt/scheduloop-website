import {
  createSessionCookie,
  getServerAuthUser,
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

  const body = (await request.json().catch(() => null)) as { idToken?: unknown } | null;
  const idToken = typeof body?.idToken === "string" ? body.idToken : "";
  const user = await verifyFirebaseIdToken(idToken);
  if (!user) {
    return Response.json({ error: "invalid-session" }, { status: 401, headers: JSON_HEADERS });
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
