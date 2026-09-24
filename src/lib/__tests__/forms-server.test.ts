import { EventEmitter } from "node:events";
import { createHash, createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";

const { connectMock } = vi.hoisted(() => ({ connectMock: vi.fn() }));
vi.mock("node:tls", () => ({ connect: connectMock }));

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
  "NOVA_WEBSITE_INTAKE_KEY_ID",
  "NOVA_WEBSITE_INTAKE_KEY_SECRET",
] as const;

const originalEnvironment = new Map(formEnvironment.map((name) => [name, process.env[name]]));

class MockSmtpSocket extends EventEmitter {
  destroyed = false;

  constructor(private readonly fail = false) {
    super();
  }

  setEncoding() {
    return this;
  }

  setTimeout() {
    return this;
  }

  write(command: string | Uint8Array) {
    const value = typeof command === "string" ? command : Buffer.from(command).toString("utf8");
    let response = "250 OK\r\n";
    if (value.startsWith("EHLO"))
      response = this.fail ? "550 AUTH unavailable\r\n" : "250-AUTH PLAIN\r\n250 OK\r\n";
    else if (value.startsWith("AUTH PLAIN")) response = "235 Authenticated\r\n";
    else if (value.startsWith("DATA")) response = "354 End data with <CR><LF>.<CR><LF>\r\n";
    queueMicrotask(() => this.emit("data", response));
    return true;
  }

  end() {
    this.destroyed = true;
    this.emit("close");
  }

  destroy() {
    this.destroyed = true;
    return this;
  }
}

function configureSmtp() {
  process.env["EREDOX_SMTP_HOST"] = "mail.example.test";
  process.env["EREDOX_SMTP_PORT"] = "465";
  process.env["EREDOX_SMTP_SECURE"] = "true";
  process.env["EREDOX_SMTP_USERNAME"] = "compliance@example.test";
  process.env["EREDOX_SMTP_PASSWORD"] = "smtp-test-secret";
  process.env["NOVA_FORM_FROM_EMAIL"] = "compliance@example.test";
  process.env["NOVA_FORM_TO_EMAIL"] = "compliance@example.test";
}

function configureCrm() {
  process.env["NOVA_CRM_ENQUIRY_URL"] = "https://crm.example.test/nova_website_intake/v1/enquiries";
  process.env["NOVA_WEBSITE_INTAKE_KEY_ID"] = "website-test-key";
  process.env["NOVA_WEBSITE_INTAKE_KEY_SECRET"] = "website-test-secret";
}

function successfulCrmResponse() {
  return new Response(
    JSON.stringify({
      success: true,
      record_type: "crm.lead",
      record_id: 42,
      reference: "NWI-00000042",
    }),
    { status: 201 },
  );
}

function request(body: Record<string, unknown>, referer?: string) {
  return new Request("https://www.nova.eredox.com/api/forms", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(referer ? { referer } : {}),
    },
    body: JSON.stringify(body),
  });
}

function validContact() {
  return {
    name: "Visitor Name",
    email: "visitor@example.com",
    company: "Example Pty Ltd",
    message: "Please explain the Launch plan.",
  };
}

function capturedRequest(fetchMock: { mock: { calls: readonly unknown[][] } }, index = 0) {
  const init = fetchMock.mock.calls[index]?.[1] as RequestInit | undefined;
  if (!init || !init.body) throw new Error("CRM request was not captured");
  return {
    body: Buffer.from(init.body as Uint8Array),
    headers: init.headers as Record<string, string>,
  };
}

afterEach(() => {
  for (const name of formEnvironment) {
    const value = originalEnvironment.get(name);
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  vi.restoreAllMocks();
  connectMock.mockReset();
});

describe("public form endpoint", () => {
  it("rejects methods other than POST", async () => {
    const result = await handleFormsRequest(
      new Request("http://localhost/api/forms", { method: "GET" }),
    );
    expect(result.status).toBe(405);
  });

  it("rejects malformed and unknown payloads without attempting delivery", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const result = await handleFormsRequest(request({ ...validContact(), unknown: "not allowed" }));
    expect(result.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed when production delivery is not configured", async () => {
    const result = await handleFormsRequest(request(validContact()));
    expect(result.status).toBe(503);
    expect(await result.text()).not.toContain("PASSWORD");
  });

  it("signs the exact transmitted payload and sends CRM before SMTP", async () => {
    configureCrm();
    configureSmtp();
    const events: string[] = [];
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      events.push("crm");
      return successfulCrmResponse();
    });
    connectMock.mockImplementation(() => {
      events.push("smtp");
      const socket = new MockSmtpSocket();
      queueMicrotask(() => {
        socket.emit("secureConnect");
        queueMicrotask(() => socket.emit("data", "220 mail.example.test ready\r\n"));
      });
      return socket;
    });

    const result = await handleFormsRequest(
      request(validContact(), "https://www.nova.eredox.com/contact"),
    );
    expect(result.status).toBe(202);
    expect(events).toEqual(["crm", "smtp"]);
    expect(connectMock).toHaveBeenCalledTimes(1);

    const captured = capturedRequest(fetchMock);
    const bodyHash = createHash("sha256").update(captured.body).digest("hex");
    const timestamp = captured.headers["x-nova-timestamp"];
    const nonce = captured.headers["x-nova-nonce"];
    const operationId = captured.headers["x-nova-operation-id"];
    const canonical = [
      "POST",
      "/nova_website_intake/v1/enquiries",
      "enquiry.create",
      timestamp,
      nonce,
      operationId,
      bodyHash,
      "application/json",
      "website-test-key",
    ].join("\n");
    expect(captured.headers["x-nova-signature"]).toBe(
      createHmac("sha256", "website-test-secret").update(canonical).digest("hex"),
    );
    expect(captured.headers["authorization"]).toBeUndefined();
    expect(JSON.parse(captured.body.toString("utf8"))).toMatchObject({
      type: "general-enquiry",
      organisation: "Example Pty Ltd",
      source_path: "/contact",
    });
  });

  it("retries transient CRM failures with stable operation ID and fresh signing values", async () => {
    configureCrm();
    configureSmtp();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "internal_error" }), { status: 503 }),
      )
      .mockResolvedValueOnce(successfulCrmResponse());
    connectMock.mockImplementation(() => {
      const socket = new MockSmtpSocket();
      queueMicrotask(() => {
        socket.emit("secureConnect");
        queueMicrotask(() => socket.emit("data", "220 mail.example.test ready\r\n"));
      });
      return socket;
    });

    const result = await handleFormsRequest(request(validContact()));
    expect(result.status).toBe(202);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const first = capturedRequest(fetchMock, 0);
    const second = capturedRequest(fetchMock, 1);
    expect(second.body.equals(first.body)).toBe(true);
    expect(second.headers["x-nova-operation-id"]).toBe(first.headers["x-nova-operation-id"]);
    expect(second.headers["x-nova-nonce"]).not.toBe(first.headers["x-nova-nonce"]);
    expect(second.headers["x-nova-timestamp"]).not.toBe(first.headers["x-nova-timestamp"]);
    expect(second.headers["x-nova-signature"]).not.toBe(first.headers["x-nova-signature"]);
  });

  it.each([400, 401, 409, 415, 500, 503])(
    "does not send SMTP after CRM status %s",
    async (status) => {
      configureCrm();
      const fetchMock = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(new Response("{}", { status }));
      const result = await handleFormsRequest(request(validContact()));
      expect(result.status).toBe(502);
      expect(fetchMock).toHaveBeenCalledTimes(status >= 500 ? 2 : 1);
      expect(connectMock).not.toHaveBeenCalled();
    },
  );

  it("maps demo booking fields to the Odoo payload", async () => {
    configureCrm();
    configureSmtp();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(successfulCrmResponse());
    connectMock.mockImplementation(() => {
      const socket = new MockSmtpSocket();
      queueMicrotask(() => {
        socket.emit("secureConnect");
        queueMicrotask(() => socket.emit("data", "220 mail.example.test ready\r\n"));
      });
      return socket;
    });
    const result = await handleFormsRequest(
      request({
        type: "demo-booking",
        name: "Visitor Name",
        email: "visitor@example.com",
        company: "Example Pty Ltd",
        framework: "ISO/IEC 27001",
        teamSize: "11–50",
        date: "2026-10-01",
        timeSlot: "09:00",
        message: "Please prepare an evidence walkthrough.",
      }),
    );
    expect(result.status).toBe(202);
    const payload = JSON.parse(capturedRequest(fetchMock).body.toString("utf8"));
    expect(payload).toMatchObject({
      type: "demo-booking",
      organisation: "Example Pty Ltd",
      framework: "ISO/IEC 27001",
      team_size: "11–50",
      preferred_date: "2026-10-01",
      preferred_time: "09:00",
    });
  });

  it("retains CRM-first semantics when SMTP fails", async () => {
    configureCrm();
    configureSmtp();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(successfulCrmResponse());
    connectMock.mockImplementation(() => {
      const socket = new MockSmtpSocket(true);
      queueMicrotask(() => {
        socket.emit("secureConnect");
        queueMicrotask(() => socket.emit("data", "220 mail.example.test ready\r\n"));
      });
      return socket;
    });
    const result = await handleFormsRequest(request(validContact()));
    expect(result.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(connectMock).toHaveBeenCalledTimes(1);
  });
});
