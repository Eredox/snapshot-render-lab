import { afterEach, describe, expect, it } from "vitest";
import { handleFormsRequest } from "@/lib/forms-server";

const formEnvironment = [
  "EREDOX_SMTP_HOST",
  "EREDOX_SMTP_PORT",
  "EREDOX_SMTP_SECURE",
  "EREDOX_SMTP_USERNAME",
  "EREDOX_SMTP_PASSWORD",
  "NOVA_FORM_FROM_EMAIL",
  "NOVA_FORM_TO_EMAIL",
  "NOVA_CRM_ENQUIRY_URL",
  "NOVA_CRM_ENQUIRY_TOKEN",
] as const;

const originalEnvironment = new Map(formEnvironment.map((name) => [name, process.env[name]]));

afterEach(() => {
  for (const name of formEnvironment) {
    const value = originalEnvironment.get(name);
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

describe("public form endpoint", () => {
  it("rejects methods other than POST", async () => {
    const result = await handleFormsRequest(
      new Request("http://localhost/api/forms", { method: "GET" }),
    );
    expect(result.status).toBe(405);
  });

  it("rejects malformed payloads without attempting delivery", async () => {
    const result = await handleFormsRequest(
      new Request("http://localhost/api/forms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Visitor" }),
      }),
    );
    expect(result.status).toBe(400);
  });

  it("fails closed when production delivery is not configured", async () => {
    for (const name of formEnvironment) delete process.env[name];
    const result = await handleFormsRequest(
      new Request("http://localhost/api/forms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Visitor",
          email: "visitor@example.com",
          company: "Example Co",
          message: "Test enquiry",
        }),
      }),
    );
    expect(result.status).toBe(503);
    expect(await result.text()).not.toContain("PASSWORD");
  });
});
