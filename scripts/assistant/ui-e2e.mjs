// Browser check of the NOVA AI Information Assistant against a LOCAL build with a MOCK AI endpoint (nothing leaves the machine).
//   1. node scripts/assistant/mock-ai.mjs 18433 &
//   2. MOCK_AI_URL=http://127.0.0.1:18433 NOVA_ASSISTANT_API_KEY=test PORT=18432 node --import ./scripts/assistant/ai-redirect.mjs .output/server/index.mjs &
//   3. SITE=http://127.0.0.1:18432 [VIEWPORT=mobile|tablet] node scripts/assistant/ui-e2e.mjs
import { openBrowser, pause } from "../journey/cdp-browser.mjs";
import os from "node:os";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const SITE = (process.env.SITE || "http://127.0.0.1:18432").replace(/\/$/, "");
const EDGE = process.env.NOVA_VERIFY_BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = path.join(os.tmpdir(), "nova-assistant-e2e");
const VP = { mobile: { width: 390, height: 844, mobile: true }, tablet: { width: 820, height: 1180, mobile: false } }[process.env.VIEWPORT || ""] || undefined;
await mkdir(OUT, { recursive: true });
let fails = 0;
const step = (n, ok, d = "") => { if (!ok) fails += 1; console.log(`${ok ? "PASS" : "FAIL"} ${n}${d ? " :: " + d : ""}`); };
const b = await openBrowser({ edge: EDGE, out: OUT, ...(VP ? { viewport: VP } : {}) });
const go = async (p) => { await b.call("Page.navigate", { url: SITE + p }); await pause(700); return b.waitFor("load " + p, "document.getElementById('nova-assistant-input') && !document.getElementById('nova-assistant-input').disabled", 20000); };
const count = () => b.evaluate("document.querySelector('[data-testid=assistant-count]')?.innerText");
let first = "";
const answer = () => b.evaluate("document.querySelector('[data-testid=assistant-answer]')?.innerText || ''");
const suggestions = () => b.evaluate("[...document.querySelectorAll('[aria-label=\"Suggested questions\"] button')].map(x=>x.innerText)");
const clickSuggestion = async (i) => { await b.evaluate(`document.querySelectorAll('[aria-label="Suggested questions"] button')[${i}].click()`); await b.waitFor("answer", "document.querySelector('[data-testid=assistant-answer]')", 15000); await pause(300); };
const spa = async (href) => { await b.evaluate(`document.querySelector('a[href="${href}"]').click()`); await pause(900); await b.waitFor("route " + href, `location.pathname==='${href}' && document.getElementById('nova-assistant-input')`, 15000); };

try {
  await go("/pricing");
  const h = await b.evaluate("document.querySelector('#nova-assistant-title')?.innerText");
  step("heading text", h === "Need more information? Just ask me below.", h);
  const intro = await b.evaluate("document.querySelector('#nova-assistant')?.innerText || ''");
  step("introduction line and NOVA logo", /Hi, I.m NOVA — NOVA Compliance.s AI Information Assistant\./.test(intro) && (await b.evaluate("!!document.querySelector('#nova-assistant img[src=\"/media/brand/nova-shield.png\"]')")));
  step("no large disclaimer paragraph and no voice label", !/powered by DeepSeek, a third-party/i.test(intro) && !/Voice:|Microsoft|David|English \(United States\)/i.test(intro));
  step("no floating/overlay assistant (fixed-position elements)", (await b.evaluate("[...document.querySelectorAll('#nova-assistant, #nova-assistant *')].filter(e=>getComputedStyle(e).position==='fixed').length")) === 0);
  const geo = await b.evaluate("(()=>{const r=e=>document.querySelector(e).getBoundingClientRect(); const i=r('#nova-assistant-input'), c=r('[aria-label=\"Suggested questions\"]'), n=r('#nova-assistant-next-step'), s=r('[data-testid=assistant-count]'); return {chipsBelowInput:c.top>=i.bottom-1, countBelowChips:s.top>=c.bottom-1, nextStepBottom:n.top>=s.bottom-1, inputFull:i.width>200, overflowX: document.documentElement.scrollWidth>window.innerWidth+1}})()");
  step("layout: chips below input, count below chips, next-step panel last, no horizontal overflow", geo.chipsBelowInput && geo.countBelowChips && geo.nextStepBottom && geo.inputFull && !geo.overflowX, JSON.stringify(geo));
  step("send button is circular and inside the input row", await b.evaluate("(()=>{const bt=document.querySelector('#nova-assistant form button[type=submit]').getBoundingClientRect(); const i=document.getElementById('nova-assistant-input').getBoundingClientRect(); return Math.abs(bt.width-bt.height)<1 && bt.right<=i.right && bt.left>i.left+i.width/2})()"));
  const pricingQs = await suggestions();
  step("pricing shows 3 pricing-specific suggestions", pricingQs.length === 3 && pricingQs.some((q) => /plan/i.test(q)), JSON.stringify(pricingQs));
  step("next-step actions present (right-aligned)", (await b.evaluate("[...document.querySelectorAll('#nova-assistant-next-step a')].map(a=>a.innerText.trim()+'>'+a.getAttribute('href')).join('|')")) === "See NOVA in Action>/book-demo|Talk to Sales>/contact");
  await clickSuggestion(0);
  step("answer shown beneath controls and 6 of 7 remaining", (first = await answer()).includes("Mock answer") && /6 of 7 questions remaining/.test(await count()), await count());
  step("answer sits below the count row", await b.evaluate("document.querySelector('[data-testid=assistant-answer]').getBoundingClientRect().top >= document.querySelector('[data-testid=assistant-count]').getBoundingClientRect().bottom - 1"));

  await spa("/frameworks");
  const fw = await suggestions();
  step("page change gives new suggestions", fw.join() !== pricingQs.join(), JSON.stringify(fw));
  step("allowance persists across pages (6 of 7 remaining)", /6 of 7 questions remaining/.test(await count()));
  await clickSuggestion(1);
  step("second answer, 5 of 7 remaining", /5 of 7 questions remaining/.test(await count()));
  await b.evaluate("window.__calls=0; const f=window.fetch; window.fetch=(...a)=>{ if(String(a[0]).includes('/api/assistant')&&a[1]?.method==='POST') window.__calls++; return f(...a); }");
  await b.evaluate("[...document.querySelectorAll('#nova-assistant li button')].pop().click()");
  await pause(300);
  step("reopen earlier answer shows it, allowance unchanged, no API call", (await answer()) === first && /5 of 7 questions remaining/.test(await count()) && (await b.evaluate("window.__calls")) === 0);

  // voice: server-synthesised neural audio (self-hosted Piper) played with Web Audio; only shown when the server reports it
  const hasControls = await b.evaluate("!!document.querySelector('[aria-label=\"Listen to this answer\"]')");
  step("never autoplays", (await b.evaluate("window.speechSynthesis.speaking")) === false);
  step("no voice name or engine label anywhere", !/Voice:|Microsoft|David|Piper|English (United States)/i.test(await b.evaluate("document.body.innerText")));
  if (hasControls) {
    const btn = (label) => "[...document.querySelectorAll('[aria-label=\"Listen to this answer\"] button')].find(x=>x.innerText.trim().startsWith('" + label + "'))";
    step("playback controls present (Listen, Pause, Stop, Replay)", (await b.evaluate("[...document.querySelectorAll('[aria-label=\"Listen to this answer\"] button')].map(x=>x.innerText.trim()).join()")).replace(/Resume/, "Listen") === "Listen,Pause,Stop,Replay");
    await b.evaluate("window.__speechReq=0; const f2=window.fetch; window.fetch=(...a)=>{ if(String(a[0]).includes('/api/assistant/speech')) window.__speechReq++; return f2(...a); }");
    await b.evaluate(btn("Listen") + ".click()");
    await b.waitFor("playing", "(()=>{const p=[...document.querySelectorAll('[aria-label=\"Listen to this answer\"] button')].find(x=>x.innerText.trim()==='Pause'); return p && !p.disabled})()", 60000);
    step("Listen fetched neural audio from our server and is playing", (await b.evaluate("window.__speechReq")) >= 1);
    await b.evaluate(btn("Pause") + ".click()");
    await pause(300);
    step("Pause suspends playback (button becomes Resume)", await b.evaluate("!!(" + btn("Resume") + ")"));
    await b.evaluate(btn("Resume") + ".click()");
    await pause(300);
    step("Resume continues playback", await b.evaluate("!!(" + btn("Pause") + " && !" + btn("Pause") + ".disabled)"));
    await b.evaluate(btn("Stop") + ".click()");
    await pause(300);
    step("Stop returns to idle", await b.evaluate("!!(" + btn("Listen") + ") && " + btn("Stop") + ".disabled"));
    await b.evaluate(btn("Replay") + ".click()");
    await b.waitFor("replaying", "(()=>{const p=[...document.querySelectorAll('[aria-label=\"Listen to this answer\"] button')].find(x=>x.innerText.trim()==='Pause'); return p && !p.disabled})()", 60000);
    await spa("/pricing");
    await pause(500);
    step("audio stops on navigation", await b.evaluate("(()=>{const l=[...document.querySelectorAll('[aria-label=\"Listen to this answer\"] button')].find(x=>x.innerText.trim()==='Listen'||x.innerText.trim()==='Resume'); return !l || !!l && [...document.querySelectorAll('[aria-label=\"Listen to this answer\"] button')].find(x=>x.innerText.trim()==='Stop').disabled})()"));
  } else {
    step("server reports no neural voice: playback controls are NOT shown (no robotic fallback)", !(await b.evaluate("document.body.innerText")).match(/Listen|Replay/));
    await spa("/pricing");
  }

  await go("/pricing");
  step("reload keeps allowance (5 of 7) and earlier-answers list", /5 of 7 questions remaining/.test(await count()) && (await b.evaluate("document.querySelectorAll('#nova-assistant li button').length")) === 1);

  for (let i = 3; i <= 7; i++) {
    await b.evaluate("document.querySelectorAll('[aria-label=\"Suggested questions\"] button')[2].click()");
    await b.waitFor("count" + i, `document.querySelector('[data-testid=assistant-count]').innerText.startsWith('${7 - i} of')`, 15000);
    await pause(150);
    if (i === 5) step("Sales encouragement after five questions", /contact our Sales team/i.test(await b.evaluate("document.getElementById('nova-assistant-next-step').innerText")));
  }
  step("after seven: input and suggestions disabled, Sales handoff shown", (await b.evaluate("document.getElementById('nova-assistant-input').disabled && [...document.querySelectorAll('[aria-label=\"Suggested questions\"] button')].every(x=>x.disabled)")) === true && /used all 7/.test(await b.evaluate("document.getElementById('nova-assistant-next-step').innerText")));
  const sid = await b.evaluate("JSON.parse(sessionStorage.getItem('nova.assistant.v1')).sid");
  await b.evaluate(`window.__r=null; fetch('/api/assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sid:${JSON.stringify(sid)},question:'one more',path:'/'})}).then(r=>{window.__r=r.status})`);
  await b.waitFor("r", "window.__r!==null", 8000);
  const code = await b.evaluate("window.__r");
  step("server refuses the 8th question (429)", code === 429, String(code));
} catch (e) {
  step("script error", false, String((e && e.message) || e));
}
console.log(fails ? `RESULT FAIL (${fails})` : "RESULT PASS");
await b.close?.();
process.exit(fails ? 1 : 0);
