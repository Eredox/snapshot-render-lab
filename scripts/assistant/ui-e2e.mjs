// Browser check of the NOVA AI Information Assistant against a LOCAL build with a MOCK AI endpoint (nothing leaves the machine).
//   1. node scripts/assistant/mock-anthropic.mjs 18433 &
//   2. MOCK_ANTHROPIC_URL=http://127.0.0.1:18433 ANTHROPIC_API_KEY=test PORT=18432 node --import ./scripts/assistant/anthropic-redirect.mjs .output/server/index.mjs &
//   3. SITE=http://127.0.0.1:18432 node scripts/assistant/ui-e2e.mjs
import { openBrowser, pause } from "../journey/cdp-browser.mjs";
import os from "node:os";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const SITE = (process.env.SITE || "http://127.0.0.1:18432").replace(/\/$/, "");
const EDGE = process.env.NOVA_VERIFY_BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = path.join(os.tmpdir(), "nova-assistant-e2e");
await mkdir(OUT, { recursive: true });
let fails = 0;
const step = (n, ok, d = "") => { if (!ok) fails += 1; console.log(`${ok ? "PASS" : "FAIL"} ${n}${d ? " :: " + d : ""}`); };
const b = await openBrowser({ edge: EDGE, out: OUT });
const go = async (p) => { await b.call("Page.navigate", { url: SITE + p }); await pause(700); return b.waitFor("load " + p, "document.getElementById('nova-assistant-input') && !document.getElementById('nova-assistant-input').disabled", 20000); };
const count = () => b.evaluate("document.querySelector('[data-testid=assistant-count]')?.innerText");
let first = '';
const answer = () => b.evaluate("document.querySelector('[data-testid=assistant-answer]')?.innerText || ''");
const suggestions = () => b.evaluate("[...document.querySelectorAll('[aria-label=\"Suggested questions\"] button')].map(x=>x.innerText)");
const clickSuggestion = async (i) => { await b.evaluate(`document.querySelectorAll('[aria-label="Suggested questions"] button')[${i}].click()`); await b.waitFor("answer", "document.querySelector('[data-testid=assistant-answer]')", 15000); await pause(300); };
const spa = async (href) => { await b.evaluate(`document.querySelector('a[href="${href}"]').click()`); await pause(900); await b.waitFor("route " + href, `location.pathname==='${href}' && document.getElementById('nova-assistant-input')`, 15000); };

try {
  await go("/pricing");
  const h = await b.evaluate("document.querySelector('#nova-assistant-title')?.innerText");
  step("heading text", h === "Need more information? Just ask NOVA.", h);
  step("no floating/overlay assistant (fixed-position elements)", (await b.evaluate("[...document.querySelectorAll('#nova-assistant, #nova-assistant *')].filter(e=>getComputedStyle(e).position==='fixed').length")) === 0);
  const pricingQs = await suggestions();
  step("pricing shows 3 pricing-specific suggestions", pricingQs.length === 3 && pricingQs.some((q) => /plan/i.test(q)), JSON.stringify(pricingQs));
  step("next-step actions present", await b.evaluate("[...document.querySelectorAll('#nova-assistant-next-step a')].map(a=>a.innerText+'>'+a.getAttribute('href')).join('|')") === "See NOVA in Action>/book-demo|Talk to Sales>/contact");
  await clickSuggestion(0);
  step("answer shown and count 1 of 7", (first = await answer()).includes("Mock answer") && /1 of 7/.test(await count()), await count());

  await spa("/frameworks");
  const fw = await suggestions();
  step("page change gives new suggestions", fw.join() !== pricingQs.join(), JSON.stringify(fw));
  step("count persists across pages (1 of 7)", /1 of 7/.test(await count()));
  await clickSuggestion(1);
  step("second answer, count 2", /2 of 7/.test(await count()));
  // reopen the first answer: must not consume a question and must not call the API
  await b.evaluate("window.__calls=0; const f=window.fetch; window.fetch=(...a)=>{ if(String(a[0]).includes('/api/assistant')&&a[1]?.method==='POST') window.__calls++; return f(...a); }");
  await b.evaluate("[...document.querySelectorAll('#nova-assistant li button')].pop().click()");
  await pause(300);
  step("reopen earlier answer shows it, count unchanged, no API call", (await answer()) === first && /2 of 7/.test(await count()) && (await b.evaluate("window.__calls")) === 0);

  // audio: controls present, never autoplay, stops on navigation
  step("TTS controls present (Listen, Pause, Stop, Replay)", (await b.evaluate("[...document.querySelectorAll('[aria-label=\"Listen to this answer\"] button')].map(x=>x.innerText).join()")).replace(/Resume/, "Listen") === "Listen,Pause,Stop,Replay");
  step("never autoplays", (await b.evaluate("window.speechSynthesis.speaking")) === false);
  await b.evaluate("window.speechSynthesis.speak(new SpeechSynthesisUtterance('test tone for navigation check. ' .repeat(8)))");
  await spa("/pricing");
  await pause(400);
  step("audio stops on navigation", (await b.evaluate("window.speechSynthesis.speaking")) === false);

  // full reload keeps the allowance and history
  await go("/pricing");
  step("reload keeps count (2 of 7) and history", /2 of 7/.test(await count()) && (await b.evaluate("document.querySelectorAll('#nova-assistant li button').length")) === 2);

  for (let i = 3; i <= 7; i++) {
    await b.evaluate("document.querySelectorAll('[aria-label=\"Suggested questions\"] button')[2].click()");
    await b.waitFor("count" + i, `document.querySelector('[data-testid=assistant-count]').innerText.startsWith('${i} of')`, 15000);
    await pause(150);
    if (i === 5) step("Sales encouragement after five questions", /contact our Sales team/i.test(await b.evaluate("document.getElementById('nova-assistant-next-step').innerText")));
  }
  step("after seven: input and suggestions disabled, Sales handoff shown", (await b.evaluate("document.getElementById('nova-assistant-input').disabled && [...document.querySelectorAll('[aria-label=\"Suggested questions\"] button')].every(x=>x.disabled)")) === true && /used all 7/.test(await b.evaluate("document.getElementById('nova-assistant-next-step').innerText")));
  // server-side enforcement: a direct POST with the same session id is refused
  const sid = await b.evaluate("JSON.parse(sessionStorage.getItem('nova.assistant.v1')).sid");
  await b.evaluate(`window.__r=null; fetch('/api/assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sid:${JSON.stringify(sid)},question:'one more',path:'/'})}).then(r=>{window.__r=r.status})`);
  await b.waitFor('r', 'window.__r!==null', 8000);
  const code = await b.evaluate('window.__r');
  step("server refuses the 8th question (429)", code === 429, String(code));
} catch (e) {
  step("script error", false, String(e && e.message || e));
}
console.log(fails ? `RESULT FAIL (${fails})` : "RESULT PASS");
await b.close?.();
process.exit(fails ? 1 : 0);
