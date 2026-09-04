import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/", { protocol = "http" } = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`${protocol}://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the ScheduleLoop marketing page", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /ScheduleLoop/);
  assert.match(html, /Request a Free Walkthrough/);
  assert.match(html, /Try the Demo/);
  assert.match(html, /href="\/sign-in"/);
  assert.match(html, /href="\/try"/);
  assert.match(html, /Turn the staffing plan into a working rota/);
  assert.match(html, /\/screens\/rota-week\.jpg/);
  assert.doesNotMatch(html, /ScheduleLoop sits before the rota/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/);
});

test("renders public auth and demo routes", async () => {
  for (const pathname of ["/try", "/sign-in", "/sign-up", "/forgot-password"]) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /ScheduleLoop/);
  }
});

test("describes the connected rota workflow accurately", async () => {
  const demoResponse = await render("/try");
  const demoHtml = await demoResponse.text();
  assert.match(demoHtml, /Build the rota around the plan/);
  assert.match(demoHtml, /does not save rota changes/);

  const signInResponse = await render("/sign-in");
  const signInHtml = await signInResponse.text();
  assert.match(signInHtml, /planning staffing, building rotas/);
  assert.doesNotMatch(signInHtml, /Sign in is currently available to invited early-access businesses/);
  assert.doesNotMatch(signInHtml, /Remember me/);

  const termsResponse = await render("/terms");
  const termsHtml = await termsResponse.text();
  assert.match(termsHtml, /does not generate rotas or choose employee assignments/);
});

test("protects workspace routes before rendering private content", async () => {
  const protectedRoutes = [
    ["/dashboard", /Preparing your ScheduleLoop app/],
    ["/upload", /CSV demand upload/],
    ["/setup", /Business setup/],
    ["/onboarding", /Set up ScheduleLoop/],
    ["/plans", /Monday 6 Jul/],
    ["/feedback", /Forecast review/],
    ["/settings", /Normal caution/],
  ];

  for (const [pathname, privateCopy] of protectedRoutes) {
    const response = await render(pathname);
    assert.equal(response.status, 307);
    const location = new URL(response.headers.get("location") ?? "", "http://localhost");
    assert.equal(location.pathname, "/sign-in");
    assert.equal(location.searchParams.get("redirect"), pathname);
    assert.doesNotMatch(await response.text(), privateCopy);
  }
});

test("adds production security headers", async () => {
  const response = await render("/", { protocol: "https" });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.equal(response.headers.get("strict-transport-security"), "max-age=31536000; includeSubDomains");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.match(response.headers.get("permissions-policy") ?? "", /camera=\(\)/);
});

test("does not expose unresolved privacy placeholders", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Information Commissioner/);
  assert.match(html, /Secure, HttpOnly, SameSite session cookie/);
  assert.doesNotMatch(html, /\[LOCATION\]|\[CONTACT|once .* confirmed/i);
});
