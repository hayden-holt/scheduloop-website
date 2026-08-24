import { clearSessionCookie } from "../../../lib/serverAuth";
import { isSameOriginRequest } from "../../../lib/rateLimit";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "invalid-request" }, { status: 403 });
  }

  return new Response(null, {
    status: 303,
    headers: {
      "Cache-Control": "no-store",
      Location: "/",
      "Set-Cookie": clearSessionCookie(),
    },
  });
}
