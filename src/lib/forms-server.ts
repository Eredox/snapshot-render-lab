import { createHash, createHmac, randomUUID } from "node:crypto";

type FormType =
  | "general-enquiry"
  | "plan-enquiry"
  | "quote-request"
  | "framework-enquiry"
  | "support-enquiry"
  | "demo-booking";

export type FormSubmission = {
  type: FormType;
  name: string;
  email: string;
  company: string;
  message: string;
  framework?: string;
  teamSize?: string;
  date?: string;
  timeSlot?: string;
};

type BrevoConfig = {
  apiKey: string;
  from: string;
  to: string;
};

const MAX_BODY_BYTES = 32_000;
const REQUEST_TIMEOUT_MS = 15_000;
const CRM_MAX_ATTEMPTS = 2;
const CRM_CONTENT_TYPE = "application/json";
const CRM_OPERATION = "enquiry.create";
const CRM_PATH = "/nova_website_intake/v1/enquiries";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const crmTypes = new Set<FormType>([
  "general-enquiry",
  "plan-enquiry",
  "quote-request",
  "framework-enquiry",
  "support-enquiry",
  "demo-booking",
]);
const formFields = new Set([
  "type",
  "name",
  "email",
  "company",
  "message",
  "framework",
  "teamSize",
  "date",
  "timeSlot",
]);

class FormConfigurationError extends Error {}

function environment(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function requiredEnvironment(name: string): string {
  const value = environment(name);
  if (!value) throw new FormConfigurationError(`Missing required form configuration: ${name}`);
  return value;
}

function brevoConfig(): BrevoConfig {
  return {
    apiKey: requiredEnvironment("BREVO_API_KEY"),
    from: requiredEnvironment("NOVA_FORM_FROM_EMAIL"),
    to: requiredEnvironment("NOVA_FORM_TO_EMAIL"),
  };
}

function normaliseSubmission(value: unknown): FormSubmission {
  if (!value || typeof value !== "object") throw new Error("Invalid form payload");
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some((field) => !formFields.has(field))) {
    throw new Error("Invalid form payload");
  }
  const inputType = input["type"];
  let type: FormType;
  if (inputType === undefined || inputType === "contact") {
    type = "general-enquiry";
  } else if (typeof inputType === "string" && crmTypes.has(inputType as FormType)) {
    type = inputType as FormType;
  } else {
    throw new Error("Invalid type");
  }
  const fields = {
    name: input["name"],
    email: input["email"],
    company: input["company"],
    message: input["message"],
    framework: input["framework"],
    teamSize: input["teamSize"],
    date: input["date"],
    timeSlot: input["timeSlot"],
  };

  const text = (name: keyof typeof fields, required: boolean, maxLength: number): string => {
    const value = fields[name];
    if (typeof value !== "string") {
      if (!required && (value === undefined || value === null)) return "";
      throw new Error(`Invalid ${name}`);
    }
    const trimmed = value.trim();
    if (required && !trimmed) throw new Error(`Missing ${name}`);
    if (trimmed.length > maxLength) throw new Error(`Invalid ${name}`);
    return trimmed;
  };

  const submission: FormSubmission = {
    type,
    name: text("name", true, 120),
    email: text("email", true, 254),
    company: text("company", false, 200),
    message: text("message", true, 10_000),
  };

  if (!emailPattern.test(submission.email)) throw new Error("Invalid email");

  for (const field of ["framework", "teamSize", "date", "timeSlot"] as const) {
    const value = text(field, false, 200);
    if (value) submission[field] = value;
  }

  if (
    type === "demo-booking" &&
    (!submission.company ||
      !submission.framework ||
      !submission.teamSize ||
      !submission.date ||
      !submission.timeSlot)
  ) {
    throw new Error("Incomplete booking details");
  }

  return submission;
}

function response(status: number, body: { ok: boolean; message: string }): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );
}

function formatSubmission(submission: FormSubmission): string {
  const entries = [
    ["Form", submission.type === "demo-booking" ? "Demo booking" : "Contact enquiry"],
    ["Name", submission.name],
    ["Email", submission.email],
    ["Company", submission.company || "Not provided"],
    ["Message", submission.message],
    ["Framework", submission.framework || "Not provided"],
    ["Team size", submission.teamSize || "Not provided"],
    ["Preferred date", submission.date || "Not provided"],
    ["Preferred time", submission.timeSlot || "Not provided"],
  ];
  return entries.map(([label, value]) => `${label}:\n${value}`).join("\n\n");
}

async function sendBrevoEmail(submission: FormSubmission) {
  const config = brevoConfig();
  const subject =
    submission.type === "demo-booking" ? "NOVA demo booking enquiry" : "NOVA website enquiry";
  const plain = formatSubmission(submission);
  const html = plain
    .split("\n\n")
    .map((part) => {
      const [label, ...rest] = part.split("\n");
      return `<p><strong>${escapeHtml(label ?? "")}</strong><br>${escapeHtml(rest.join("\n")).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const result = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": config.apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: config.from, name: "NOVA Compliance" },
        to: [{ email: config.to }],
        replyTo: { email: submission.email },
        subject,
        textContent: plain,
        htmlContent: `<html><body>${html}</body></html>`,
      }),
      signal: controller.signal,
    });
    if (!result.ok) {
      await result.arrayBuffer();
      throw new Error(`Brevo API returned ${result.status}`);
    }
  } finally {
    clearTimeout(timer);
  }
}

class CrmResponseError extends Error {
  constructor(
    readonly status: number,
    readonly retryable: boolean,
  ) {
    super(`CRM enquiry endpoint returned ${status}`);
  }
}

function sourcePathForRequest(request: Request): string {
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const requestUrl = new URL(request.url);
      if (refererUrl.origin === requestUrl.origin && refererUrl.pathname.startsWith("/")) {
        return refererUrl.pathname;
      }
    } catch {
      // Use the safe endpoint path below when the browser sends no valid same-origin referer.
    }
  }
  return "/";
}

function crmPayload(submission: FormSubmission, sourcePath: string): Record<string, string> {
  return {
    type: submission.type,
    name: submission.name,
    email: submission.email,
    organisation: submission.company,
    message: submission.message,
    plan: "",
    framework: submission.framework ?? "",
    team_size: submission.teamSize ?? "",
    preferred_date: submission.date ?? "",
    preferred_time: submission.timeSlot ?? "",
    source_path: sourcePath,
    submitted_at: new Date().toISOString(),
  };
}

function canonicalCrmRequest({
  timestamp,
  nonce,
  operationId,
  bodyHash,
  keyId,
}: {
  timestamp: string;
  nonce: string;
  operationId: string;
  bodyHash: string;
  keyId: string;
}): string {
  return [
    "POST",
    CRM_PATH,
    CRM_OPERATION,
    timestamp,
    nonce,
    operationId,
    bodyHash,
    CRM_CONTENT_TYPE,
    keyId,
  ].join("\n");
}

function crmHeaders({
  body,
  keyId,
  secret,
  operationId,
  minimumTimestamp = 0,
}: {
  body: Buffer;
  keyId: string;
  secret: string;
  operationId: string;
  minimumTimestamp?: number;
}): Record<string, string> {
  const timestamp = Math.max(Math.floor(Date.now() / 1000), minimumTimestamp + 1).toString();
  const nonce = randomUUID();
  const bodyHash = createHash("sha256").update(body).digest("hex");
  const canonical = canonicalCrmRequest({ timestamp, nonce, operationId, bodyHash, keyId });
  const signature = createHmac("sha256", secret).update(canonical, "utf8").digest("hex");
  return {
    "content-type": CRM_CONTENT_TYPE,
    "x-nova-key-id": keyId,
    "x-nova-timestamp": timestamp,
    "x-nova-nonce": nonce,
    "x-nova-operation-id": operationId,
    "x-nova-signature": signature,
  };
}

function isCrmSuccess(value: unknown): value is {
  success: true;
  record_type: "crm.lead";
  record_id: number;
  reference: string;
} {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  return (
    result["success"] === true &&
    result["record_type"] === "crm.lead" &&
    typeof result["record_id"] === "number" &&
    Number.isInteger(result["record_id"]) &&
    result["record_id"] > 0 &&
    typeof result["reference"] === "string" &&
    /^NWI-\d+$/.test(result["reference"])
  );
}

async function createCrmEnquiry(submission: FormSubmission, sourcePath: string): Promise<void> {
  const url = requiredEnvironment("NOVA_CRM_ENQUIRY_URL");
  const keyId = requiredEnvironment("NOVA_WEBSITE_INTAKE_KEY_ID");
  const secret = requiredEnvironment("NOVA_WEBSITE_INTAKE_KEY_SECRET");
  const body = Buffer.from(JSON.stringify(crmPayload(submission, sourcePath)), "utf8");
  const operationId = `website-${randomUUID()}`;
  let lastTimestamp = 0;

  for (let attempt = 0; attempt < CRM_MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const headers = crmHeaders({
        body,
        keyId,
        secret,
        operationId,
        minimumTimestamp: lastTimestamp,
      });
      lastTimestamp = Number(headers["x-nova-timestamp"]);
      const result = await fetch(url, {
        method: "POST",
        headers,
        body,
        signal: controller.signal,
      });
      if (!result.ok) {
        await result.arrayBuffer();
        throw new CrmResponseError(result.status, result.status === 500 || result.status === 503);
      }
      const response = await result.json().catch(() => null);
      if (!isCrmSuccess(response)) throw new CrmResponseError(502, false);
      return;
    } catch (error) {
      const retryable = !(error instanceof CrmResponseError) || error.retryable;
      if (!retryable || attempt === CRM_MAX_ATTEMPTS - 1) throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}

export async function handleFormsRequest(request: Request): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
  if (request.method !== "POST") return response(405, { ok: false, message: "Method not allowed" });

  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return response(413, { ok: false, message: "Form submission is too large" });
    }
    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return response(400, { ok: false, message: "Please check the form details and try again" });
    }
    const submission = normaliseSubmission(payload);
    await createCrmEnquiry(submission, sourcePathForRequest(request));
    await sendBrevoEmail(submission);
    return response(202, { ok: true, message: "Submission received" });
  } catch (error) {
    if (error instanceof FormConfigurationError) {
      console.error("Form delivery is not configured");
      return response(503, { ok: false, message: "Form delivery is temporarily unavailable" });
    }
    if (error instanceof Error && /Invalid |Missing |Incomplete /.test(error.message)) {
      return response(400, { ok: false, message: "Please check the form details and try again" });
    }
    console.error("Form delivery failed");
    return response(502, { ok: false, message: "Form delivery is temporarily unavailable" });
  }
}
