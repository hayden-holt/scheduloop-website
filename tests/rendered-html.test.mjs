import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
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

  const termsResponse = await render("/terms");
  const termsHtml = await termsResponse.text();
  assert.match(termsHtml, /does not generate rotas or choose employee assignments/);
});
