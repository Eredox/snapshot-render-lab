// End-to-end enquiry-delivery check with SYNTHETIC data against a website instance wired to scripts/forms/mock-sinks.mjs.
//   SITE=http://127.0.0.1:13000 MOCK=http://127.0.0.1:18080 EXPECT_TO=<destination> EXPECT_FROM=<sender> node scripts/forms/check-forms-delivery.mjs
// Sends nothing to any real service: the website under test must point NOVA_CRM_ENQUIRY_URL and (via brevo-redirect.mjs) Brevo at the mock.
const SITE = process.env.SITE, MOCK = process.env.MOCK, TO = process.env.EXPECT_TO, FROM = process.env.EXPECT_FROM;
let fails = 0;
const step = (n, ok, d = "") => { if (!ok) fails += 1; console.log(`${ok ? "PASS" : "FAIL"} ${n}${d ? " :: " + d : ""}`); };
const state = async () => (await fetch(MOCK + "/__state")).json();
const post = (body, { ip = "198.51.100.10", origin = SITE, ct = "application/json", raw } = {}) =>
  fetch(SITE + "/api/forms", { method: "POST", headers: { "content-type": ct, origin, "x-real-ip": ip, referer: SITE + "/contact" }, body: raw ?? JSON.stringify(body) });
const reset = () => fetch(MOCK + "/__reset", { method: "POST" });
const mode = (crm) => fetch(MOCK + "/__mode", { method: "POST", body: JSON.stringify({ crm }) });

const contact = { name: "Synthetic Tester", email: "synthetic.tester@example.test", company: "Synthetic Pty Ltd", message: "Synthetic enquiry <script>alert(1)</script> & more" };
const booking = { type: "demo-booking", name: "Synthetic Booker", email: "synthetic.booker@example.test", company: "Synthetic Pty Ltd", message: "", framework: "ISO 27001", teamSize: "11-50", date: "2026-12-01", timeSlot: "10:30", website: "" };
const allowList = ["email", "framework", "message", "name", "organisation", "plan", "preferred_date", "preferred_time", "source_path", "submitted_at", "team_size", "type"];

await reset();
let r = await post(contact);
let s = await state();
step("contact enquiry accepted (202)", r.status === 202, String(r.status));
step("CRM bridge: signature, key id, freshness, nonce, content-type all valid", s.crm.length === 1 && s.crm[0].ok, JSON.stringify(s.crm[0]?.checks));
step("CRM payload carries only allow-listed fields", JSON.stringify(s.crm[0]?.fields) === JSON.stringify(allowList));
step("CRM payload: type, source page and values", s.crm[0]?.payload.type === "general-enquiry" && s.crm[0]?.payload.source_path === "/contact" && s.crm[0]?.payload.email === contact.email);
step("Brevo notification delivered once, api-key accepted, message complete", s.brevo.length === 1 && s.brevo[0].ok, JSON.stringify(s.brevo[0]?.shape));
step("notification goes to the configured Eredox destination", !TO || s.brevo[0]?.to === TO, `to=${s.brevo[0]?.to}`);
step("notification sender is the fixed Eredox address; visitor is Reply-To only", (!FROM || s.brevo[0]?.sender === FROM) && s.brevo[0]?.replyTo === contact.email);
step("notification text includes the message; HTML body escapes markup", s.brevo[0]?.text.includes("Synthetic enquiry") && !s.brevo[0]?.html.includes("<script>") && s.brevo[0]?.html.includes("&lt;script&gt;"));

r = await post(booking, { ip: "198.51.100.11" }); s = await state();
step("demo booking accepted; second CRM record and second notification", r.status === 202 && s.crm.length === 2 && s.brevo.length === 2 && s.crm[1].ok && s.brevo[1].ok, String(r.status));
step("booking WITHOUT optional notes is accepted; details reach CRM (framework, team size, date, time) and the notification", s.crm[1]?.payload.type === "demo-booking" && s.crm[1]?.payload.framework === "ISO 27001" && s.crm[1]?.payload.preferred_time === "10:30" && /Demo booking/.test(s.brevo[1]?.text) && /no additional notes/.test(s.crm[1]?.payload.message) && s.brevo[1]?.subject === "NOVA demo booking enquiry");

r = await post({ ...contact, website: "http://spam.example" }, { ip: "198.51.100.12" }); s = await state();
step("honeypot filled: answered like success but nothing delivered", r.status === 202 && s.crm.length === 2 && s.brevo.length === 2);
r = await post(contact); s = await state();
step("immediate duplicate: acknowledged, not delivered twice", r.status === 202 && s.crm.length === 2 && s.brevo.length === 2);

r = await post({ ...contact, message: "Different synthetic" }, { origin: "https://evil.example", ip: "198.51.100.13" });
step("foreign Origin refused (403)", r.status === 403);
r = await post(null, { ip: "198.51.100.13", ct: "text/plain", raw: "x" });
step("wrong content-type refused (415)", r.status === 415);
r = await post(null, { ip: "198.51.100.13", raw: JSON.stringify({ ...contact, message: "x".repeat(40000) }) });
step("oversize body refused (413)", r.status === 413);
r = await post({ ...contact, email: "not-an-email" }, { ip: "198.51.100.13" });
step("invalid e-mail refused (400)", r.status === 400);
r = await post({ ...contact, unexpected: "field" }, { ip: "198.51.100.13" });
step("unknown field refused (400)", r.status === 400);
s = await state();
step("none of the refused requests reached CRM or e-mail", s.crm.length === 2 && s.brevo.length === 2);

await mode("500"); r = await post({ ...contact, message: "crm 500 case" }, { ip: "198.51.100.14" }); s = await state();
step("CRM 500: bounded retry (2 attempts), visitor sees failure (502), NO e-mail sent", r.status === 502 && s.crm.length === 4 && s.brevo.length === 2, `crmAttempts=${s.crm.length - 2}`);
await mode("401"); r = await post({ ...contact, message: "crm 401 case" }, { ip: "198.51.100.15" }); s = await state();
step("CRM 401: not retried, 502, NO e-mail sent", r.status === 502 && s.crm.length === 5 && s.brevo.length === 2);
await mode("ok");

let first429 = null;
for (let i = 1; i <= 8; i += 1) {
  const x = await post({ ...contact, message: `rate limit case ${i}` }, { ip: "198.51.100.99" });
  if (x.status === 429) { first429 = i; break; }
}
step("per-client delivery rate limit engages (429)", first429 !== null && first429 <= 6, `first 429 at request ${first429}`);
console.log(fails ? `\n${fails} FAIL` : "\nALL PASS");
process.exitCode = fails ? 1 : 0;
