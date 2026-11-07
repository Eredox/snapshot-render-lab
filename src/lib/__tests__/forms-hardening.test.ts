import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleFormsRequest } from "@/lib/forms-server";
import { clientKey, resetFormGuardsForTests, SlidingWindowLimiter } from "@/lib/form-guards";

const env = [
  "BREVO_API_KEY",
  "NOVA_FORM_FROM_EMAIL",
  "NOVA_FORM_TO_EMAIL",
  "NOVA_CRM_ENQUIRY_URL",
  "NOVA_WEBSITE_INTAKE_KEY_ID",
  "NOVA_WEBSITE_INTAKE_KEY_SECRET",
] as const;
const saved = new Map(env.map((name) => [name, process.env[name]]));

function configure() {
  process.env["BREVO_API_KEY"] = "brevo-test-key";
  process.env["NOVA_FORM_FROM_EMAIL"] = "from@example.test";
  process.env["NOVA_FORM_TO_EMAIL"] = "to@example.test";
  process.env["NOVA_CRM_ENQUIRY_URL"] = "https://crm.example.test/nova_website_intake/v1/enquiries";
  process.env["NOVA_WEBSITE_INTAKE_KEY_ID"] = "kid";
  process.env["NOVA_WEBSITE_INTAKE_KEY_SECRET"] = "secret";
}
const crmOk = () =>
  new Response(
    JSON.stringify({ success: true, record_type: "crm.lead", record_id: 1, reference: "NWI-1" }),
    { status: 201 },
  );
const mailOk = () => new Response("{}", { status: 201 });

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://www.nova.eredox.com/api/forms", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
let counter = 0;
const contact = (extra: Record<string, unknown> = {}) => ({
  name: "A Visitor",
  email: `v${++counter}@example.com`,
  company: "Co",
  message: `Hello ${counter}`,
  ...extra,
});

beforeEach(() => {
  configure();
  resetFormGuardsForTests();
});
afterEach(() => {
  for (const name of env) {
    const value = saved.get(name);
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  vi.restoreAllMocks();
});

function mockDelivery() {
  return vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async (input) => (String(input).includes("brevo") ? mailOk() : crmOk()));
}

describe("/api/forms request validation", () => {
  it("rejects non-JSON content types without delivering (blocks cross-site text/plain form posts)", async () => {
    const fetchMock = mockDelivery();
    for (const contentType of [
      "text/plain",
      "application/x-www-form-urlencoded",
      "multipart/form-data; boundary=x",
      "",
    ]) {
      const result = await handleFormsRequest(post(contact(), { "content-type": contentType }));
      expect(result.status).toBe(415);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts application/json with a charset parameter", async () => {
    mockDelivery();
    const result = await handleFormsRequest(
      post(contact(), { "content-type": "application/json; charset=utf-8" }),
    );
    expect(result.status).toBe(202);
  });

  it("rejects foreign Origin and cross-site Fetch Metadata, accepts the site's own origin", async () => {
    const fetchMock = mockDelivery();
    expect((await handleFormsRequest(post(contact(), { origin: "https://evil.example" }))).status).toBe(403);
    expect((await handleFormsRequest(post(contact(), { origin: "null" }))).status).toBe(403);
    expect((await handleFormsRequest(post(contact(), { "sec-fetch-site": "cross-site" }))).status).toBe(403);
    expect((await handleFormsRequest(post(contact(), { "sec-fetch-site": "same-site" }))).status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
    const ok = await handleFormsRequest(
      post(contact(), { origin: "https://www.nova.eredox.com", "sec-fetch-site": "same-origin" }),
    );
    expect(ok.status).toBe(202);
  });

  it("enforces the body limit from Content-Length and while streaming", async () => {
    const fetchMock = mockDelivery();
    const big = JSON.stringify(contact({ message: "x".repeat(40_000) }));
    const declared = await handleFormsRequest(post(big, { "content-length": String(big.length) }));
    expect(declared.status).toBe(413);
    const streamed = new Request("https://www.nova.eredox.com/api/forms", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(big));
          controller.close();
        },
      }),
      duplex: "half",
    } as RequestInit);
    expect((await handleFormsRequest(streamed)).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns consistent JSON error shapes and codes", async () => {
    mockDelivery();
    const cases: [Request, number][] = [
      [post("{not json"), 400],
      [post({ ...contact(), unknownField: 1 }), 400],
      [post(contact({ email: "not-an-email" })), 400],
      [new Request("https://www.nova.eredox.com/api/forms", { method: "GET" }), 405],
    ];
    for (const [request, status] of cases) {
      const result = await handleFormsRequest(request);
      expect(result.status).toBe(status);
      expect(result.headers.get("cache-control")).toBe("no-store");
      expect(Object.keys(await result.json()).sort()).toEqual(["message", "ok"]);
    }
    const preflight = await handleFormsRequest(
      new Request("https://www.nova.eredox.com/api/forms", { method: "OPTIONS" }),
    );
    expect(preflight.headers.get("access-control-allow-origin")).toBeNull();
  });
});

describe("/api/forms abuse resistance", () => {
  it("rate limits deliveries per client with Retry-After, without affecting other clients", async () => {
    const fetchMock = mockDelivery();
    const ip = { "x-real-ip": "203.0.113.7" };
    for (let i = 0; i < 5; i++) {
      expect((await handleFormsRequest(post(contact(), ip))).status).toBe(202);
    }
    const limited = await handleFormsRequest(post(contact(), ip));
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
    const before = fetchMock.mock.calls.length;
    expect((await handleFormsRequest(post(contact(), { "x-real-ip": "203.0.113.8" }))).status).toBe(202);
    expect(fetchMock.mock.calls.length).toBeGreaterThan(before);
  });

  it("rate limits raw attempts (including invalid ones) per client", async () => {
    mockDelivery();
    const ip = { "x-real-ip": "198.51.100.9" };
    for (let i = 0; i < 20; i++) {
      expect((await handleFormsRequest(post("{bad", ip))).status).toBe(400);
    }
    expect((await handleFormsRequest(post("{bad", ip))).status).toBe(429);
  });

  it("silently drops honeypot submissions (acknowledged like success, nothing delivered)", async () => {
    const fetchMock = mockDelivery();
    const result = await handleFormsRequest(post(contact({ website: "http://spam.example" })));
    expect(result.status).toBe(202);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("delivers an identical resubmission only once", async () => {
    const fetchMock = mockDelivery();
    const body = contact();
    expect((await handleFormsRequest(post(body))).status).toBe(202);
    const calls = fetchMock.mock.calls.length;
    expect((await handleFormsRequest(post(body))).status).toBe(202);
    expect(fetchMock.mock.calls.length).toBe(calls);
  });

  it("does not trust client-supplied forwarding chains beyond the proxy-appended entry", () => {
    const chained = new Request("https://x.test/", {
      headers: { "x-forwarded-for": "1.1.1.1, 2.2.2.2, 203.0.113.5" },
    });
    expect(clientKey(chained)).toBe("203.0.113.5");
    const real = new Request("https://x.test/", {
      headers: { "x-real-ip": "198.51.100.1", "x-forwarded-for": "9.9.9.9" },
    });
    expect(clientKey(real)).toBe("198.51.100.1");
    const junk = new Request("https://x.test/", { headers: { "x-real-ip": "<script>" } });
    expect(clientKey(junk)).toBe("unknown");
  });

  it("sliding window releases after the window and bounds its memory", () => {
    const limiter = new SlidingWindowLimiter(2, 1000, 3);
    expect(limiter.take("a", 0).allowed).toBe(true);
    expect(limiter.take("a", 10).allowed).toBe(true);
    expect(limiter.take("a", 20).allowed).toBe(false);
    expect(limiter.take("a", 1001).allowed).toBe(true);
    for (const key of ["b", "c", "d", "e"]) limiter.take(key, 2000);
    expect(limiter.take("a", 2001).allowed).toBe(true);
  });
});

describe("/api/forms privacy-safe logging", () => {
  it("never logs names, e-mail addresses, company or message text", async () => {
    mockDelivery();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const person = {
      name: "Unique Person",
      email: "unique.person@example.com",
      company: "Sensitive Co",
      message: "confidential message body",
    };
    await handleFormsRequest(post({ ...person, website: "trap" }));
    await handleFormsRequest(post(person, { origin: "https://evil.example" }));
    delete process.env["BREVO_API_KEY"];
    await handleFormsRequest(post({ ...person, message: "another confidential body" }));
    const logged = JSON.stringify([...warn.mock.calls, ...error.mock.calls]);
    expect(logged.length).toBeGreaterThan(10);
    for (const needle of ["Unique Person", "unique.person", "Sensitive Co", "confidential"]) {
      expect(logged).not.toContain(needle);
    }
  });
});
