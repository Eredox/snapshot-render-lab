// Browser end-to-end: the REAL contact and booking forms (fetch NOT stubbed) against a website wired to scripts/forms/mock-sinks.mjs.
//   SITE=http://127.0.0.1:13000 MOCK=http://127.0.0.1:18080 node scripts/forms/ui-forms-e2e.mjs        (synthetic data only)
import os from "node:os";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { openBrowser, pause } from "../journey/cdp-browser.mjs";

const SITE = (process.env.SITE || "http://127.0.0.1:13000").replace(/\/$/, ""), MOCK = process.env.MOCK || "http://127.0.0.1:18080";
const EDGE = process.env.NOVA_VERIFY_BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = path.join(os.tmpdir(), "nova-forms-e2e");
await mkdir(OUT, { recursive: true });
let fails = 0;
const step = (n, ok, d = "") => { if (!ok) fails += 1; console.log(`${ok ? "PASS" : "FAIL"} ${n}${d ? " :: " + d : ""}`); };
const state = async () => (await fetch(MOCK + "/__state")).json();

const b = await openBrowser({ edge: EDGE, out: OUT });
const go = async (p, ready) => { await b.call("Page.navigate", { url: SITE + p }); await pause(700); return b.waitFor("load " + p, `document.body && document.body.innerText.length>40 && ${ready}`, 15000); };
const setVal = (id, v) => b.evaluate(`(()=>{const el=document.getElementById(${JSON.stringify(id)}); if(!el) return false; const proto=el.tagName==='SELECT'?HTMLSelectElement.prototype:(el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype); Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${JSON.stringify(v)}); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); return true;})()`);
const submit = () => b.evaluate("(()=>{const f=document.querySelector('main form')||document.querySelector('form'); const btn=[...f.querySelectorAll('button')].find(x=>x.type==='submit'); btn.click(); return btn.innerText;})()");
try {
  await fetch(MOCK + "/__reset", { method: "POST" });
  // Contact form
  await go("/contact", "!!document.getElementById('contact-name')"); await pause(2500);
  await setVal("contact-name", "UI Synthetic Contact"); await setVal("contact-email", "ui.contact@example.test");
  await setVal("contact-company", "UI Synthetic Pty Ltd"); await setVal("contact-message", "UI synthetic contact message");
  await submit();
  await b.waitFor("thanks", "/Thanks for your message/.test(document.body.innerText)", 12000);
  let s = await state();
  step("UI contact form: visitor sees confirmation", true);
  step("UI contact form: CRM record created (valid signature) and notification sent", s.crm.length === 1 && s.crm[0].ok && s.brevo.length === 1 && s.brevo[0].ok && s.crm[0].payload.source_path === "/contact" && s.brevo[0].replyTo === "ui.contact@example.test");

  // Booking form
  await go("/book-demo", "!!document.getElementById('booking-name')"); await pause(2500);
  const d = new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10);
  const opt = (id) => b.evaluate(`[...document.getElementById(${JSON.stringify(id)}).options].filter(o=>!o.disabled).map(o=>o.value)[0]`);
  await setVal("booking-name", "UI Synthetic Booker"); await setVal("booking-email", "ui.booker@example.test"); await setVal("booking-company", "UI Synthetic Pty Ltd");
  await setVal("booking-framework", await opt("booking-framework")); await setVal("booking-team", await opt("booking-team"));
  await setVal("booking-date", d); await setVal("booking-time", "10:30");
  await submit();
  await b.waitFor("confirmed", "location.pathname==='/book-demo/confirmed'", 12000); await pause(600);
  s = await state();
  const url = await b.evaluate("location.href");
  if (s.crm.length !== 2) console.log("  diag: crm=" + s.crm.length + " brevo=" + s.brevo.length + " page=" + JSON.stringify((await b.evaluate("document.body.innerText")).slice(0, 400)));
  step("UI booking form: lands on confirmation with a clean URL", !/ui\.booker|UI%20|example\.test/i.test(url), url);
  step("UI booking form: CRM demo-booking record and notification delivered", s.crm.length === 2 && s.crm[1].ok && s.crm[1].payload.type === "demo-booking" && s.crm[1].payload.preferred_date === d && s.brevo.length === 2 && s.brevo[1].ok);

  // Failure path: delivery not configured/failing must show the visitor an error, never a false success
  await fetch(MOCK + "/__mode", { method: "POST", body: JSON.stringify({ crm: "500" }) });
  await go("/contact", "!!document.getElementById('contact-name')"); await pause(2500);
  await setVal("contact-name", "UI Synthetic Failing"); await setVal("contact-email", "ui.failing@example.test");
  await setVal("contact-message", "UI synthetic failing message");
  await submit();
  await b.waitFor("error", "/could not send your message/i.test(document.body.innerText)", 12000);
  s = await state();
  step("UI failure path: visitor sees an error (no false success) and no e-mail is sent", s.brevo.length === 2);
} catch (e) {
  step("UI e2e completed", false, String(e && e.message || e));
} finally {
  await b.close?.();
}
console.log(fails ? `\n${fails} FAIL` : "\nALL PASS");
process.exit(fails ? 1 : 0);
