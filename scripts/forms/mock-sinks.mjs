// SYNTHETIC test sinks for the website enquiry path. Never contacts a real service and holds no real secret.
//  - CRM bridge mock: verifies the exact HMAC-SHA256 canonical contract of docs/forms-runtime.md.
//  - Brevo mock: checks the api-key header and message shape.
// Run in a throw-away container (see docs/audits/NOVA-WEB-PREFLIGHT-005). Control: GET /__state, POST /__reset, POST /__mode {crm}.
import http from "node:http";
import { createHash, createHmac } from "node:crypto";

const KEY_ID = process.env.MOCK_KEY_ID, SECRET = process.env.MOCK_SECRET, BREVO_KEY = process.env.MOCK_BREVO_KEY;
const CRM_PATH = "/nova_website_intake/v1/enquiries";
let crm = [], brevo = [], nonces = new Set(), mode = "ok", n = 0;

const send = (res, status, body) => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
const readBody = (req) => new Promise((r) => { const c = []; req.on("data", (d) => c.push(d)); req.on("end", () => r(Buffer.concat(c))); });

http.createServer(async (req, res) => {
  const body = await readBody(req);
  if (req.url === "/__state") return send(res, 200, { crm, brevo });
  if (req.url === "/__reset") { crm = []; brevo = []; nonces = new Set(); mode = "ok"; return send(res, 200, { ok: true }); }
  if (req.url === "/__mode") { mode = JSON.parse(body).crm; return send(res, 200, { mode }); }

  if (req.method === "POST" && req.url === CRM_PATH) {
    const h = req.headers;
    const checks = {};
    const bodyHash = createHash("sha256").update(body).digest("hex");
    const canonical = ["POST", CRM_PATH, "enquiry.create", h["x-nova-timestamp"], h["x-nova-nonce"], h["x-nova-operation-id"], bodyHash, "application/json", h["x-nova-key-id"]].join("\n");
    checks.keyId = h["x-nova-key-id"] === KEY_ID;
    checks.signature = createHmac("sha256", SECRET).update(canonical, "utf8").digest("hex") === h["x-nova-signature"];
    checks.fresh = Math.abs(Date.now() / 1000 - Number(h["x-nova-timestamp"])) < 300;
    checks.nonceUnique = !nonces.has(h["x-nova-nonce"]); nonces.add(h["x-nova-nonce"]);
    checks.contentType = h["content-type"] === "application/json";
    const payload = JSON.parse(body.toString("utf8"));
    const record = { checks, ok: Object.values(checks).every(Boolean), fields: Object.keys(payload).sort(), payload };
    crm.push(record);
    if (mode === "500") return send(res, 500, { success: false });
    if (mode === "401") return send(res, 401, { success: false });
    if (!record.ok) return send(res, 401, { success: false });
    n += 1;
    return send(res, 200, { success: true, record_type: "crm.lead", record_id: n, reference: `NWI-${n}` });
  }

  if (req.method === "POST" && req.url === "/brevo/v3/smtp/email") {
    const m = JSON.parse(body.toString("utf8"));
    const shape = { apiKey: req.headers["api-key"] === BREVO_KEY, sender: !!m.sender?.email, to: m.to?.length === 1, replyTo: !!m.replyTo?.email, subject: !!m.subject, text: !!m.textContent, html: !!m.htmlContent };
    brevo.push({ shape, ok: Object.values(shape).every(Boolean), sender: m.sender?.email, to: m.to?.[0]?.email, replyTo: m.replyTo?.email, subject: m.subject, text: m.textContent, html: m.htmlContent });
    return send(res, shape.apiKey ? 201 : 401, { messageId: "<synthetic@mock>" });
  }
  send(res, 404, { error: "not found" });
}).listen(8080, "0.0.0.0", () => console.log("mock sinks listening"));
