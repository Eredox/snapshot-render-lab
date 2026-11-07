#!/usr/bin/env node
/**
 * Release verification for the NOVA public website (read-only, GET/HEAD only).
 *
 *   node scripts/verify-release.mjs --base http://127.0.0.1:3000 [--browser] [--out report.json]
 *
 * HTTP checks: sitemap coverage + canonical/robots expectations, genuine 404s, security headers
 * (application-owned CSP, nonce on inline scripts, no wildcard/eval), security.txt, robots.txt,
 * internal link integrity. --browser additionally loads representative pages in headless Chrome
 * (desktop and mobile) and records console/CSP violations, failed requests, third-party hosts,
 * transferred bytes, LCP and CLS (synthetic lab values - not real-user data).
 * Point --base at a locally started build only; never at production without authorisation.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : (args[i + 1] ?? true);
};
const BASE = String(opt("base", "http://127.0.0.1:3000")).replace(/\/$/, "");
const OUT = opt("out", null);
const BROWSER = args.includes("--browser");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = { base: BASE, startedAt: new Date().toISOString(), checks: [], pages: [], browser: [] };
let failures = 0;
function check(name, ok, detail = "") {
  results.checks.push({ name, ok: !!ok, detail });
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
}

async function get(p, init = {}) {
  const res = await fetch(BASE + p, { redirect: "manual", ...init });
  return { res, text: init.method === "HEAD" ? "" : await res.text() };
}

// ---------- HTTP checks ----------
const sitemap = (await get("/sitemap.xml")).text;
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check("sitemap lists URLs", locs.length > 0, `${locs.length} URLs`);
check("sitemap URLs are unique", new Set(locs).size === locs.length);
const origin = locs[0] ? new URL(locs[0]).origin : "";
const paths = locs.map((l) => new URL(l).pathname);
const meta = (html, re) => (html.match(re) || [])[1] || "";
const titles = new Map(), descs = new Map();
for (const p of paths) {
  const { res, text } = await get(p);
  const title = meta(text, /<title>([^<]*)<\/title>/);
  const desc = meta(text, /<meta name="description" content="([^"]*)"/);
  const canonical = meta(text, /<link rel="canonical" href="([^"]*)"/);
  const robots = meta(text, /<meta name="robots" content="([^"]*)"/);
  const h1s = (text.match(/<h1[ >]/g) || []).length;
  const row = { path: p, status: res.status, title, titleLen: title.length, descLen: desc.length, canonical, robots, h1s };
  results.pages.push(row);
  titles.set(title, [...(titles.get(title) || []), p]);
  descs.set(desc, [...(descs.get(desc) || []), p]);
  const problems = [];
  if (res.status !== 200) problems.push(`status ${res.status}`);
  if (canonical !== origin + (p === "/" ? "/" : p)) problems.push(`canonical ${canonical}`);
  if (/noindex/i.test(robots)) problems.push("noindex in sitemap");
  if (h1s !== 1) problems.push(`h1 count ${h1s}`);
  if (title.length < 20 || title.length > 60) problems.push(`title length ${title.length}`);
  if (desc.length < 70 || desc.length > 160) problems.push(`description length ${desc.length}`);
  if (problems.length) check(`page ${p}`, false, problems.join("; "));
  await sleep(30);
}
check("every sitemap URL: 200, self canonical, indexable, 1 h1, title 20-60, description 70-160", !results.checks.some((c) => !c.ok && c.name.startsWith("page ")));
check("titles unique", [...titles.values()].every((v) => v.length === 1), JSON.stringify([...titles].filter(([, v]) => v.length > 1)));
check("descriptions unique", [...descs.values()].every((v) => v.length === 1), JSON.stringify([...descs].filter(([, v]) => v.length > 1).map(([, v]) => v)));

// Genuine 404s
for (const p of ["/zz-unknown-route", "/404", "/index.html", "/llms.txt", "/fonts/nope.woff2", "/assets/nope.js.map", "/resources/blog/nope", "/frameworks/nope"]) {
  const { res } = await get(p);
  check(`404 for ${p}`, res.status === 404, `got ${res.status}`);
}
// Redirect semantics: trailing slash must not be a soft/temporary success page.
const slash = await get("/pricing/");
check("/pricing/ redirects (not 200)", [301, 307, 308].includes(slash.res.status), `got ${slash.res.status}`);

// Placeholder sections must be noindex and out of the sitemap
for (const p of ["/testimonials", "/status", "/resources/product-updates", "/resources/case-studies", "/resources/webinars"]) {
  const { text } = await get(p);
  check(`${p} is noindex`, /<meta name="robots" content="[^"]*noindex/.test(text));
  check(`${p} not in sitemap`, !paths.includes(p));
}
// robots.txt
const robots = (await get("/robots.txt")).text;
check("robots.txt references sitemap", /Sitemap:\s*https:\/\/www\.nova\.eredox\.com\/sitemap\.xml/.test(robots));
check("robots.txt does not block everything for *", !/User-agent:\s*\*\s*\n\s*Disallow:\s*\/\s*$/m.test(robots));
// security.txt
const sec = await get("/.well-known/security.txt");
check("security.txt served as text/plain", sec.res.status === 200 && /text\/plain/.test(sec.res.headers.get("content-type") || ""));
const exp = (sec.text.match(/^Expires:\s*(.+)$/m) || [])[1];
check("security.txt has Contact and a future Expires < 1 year", /^Contact:\s*mailto:/m.test(sec.text) && !!exp && new Date(exp) > new Date() && new Date(exp) < new Date(Date.now() + 366 * 864e5), exp);

// Security headers on HTML, 404 and API
const home = await get("/");
const csp = home.res.headers.get("content-security-policy") || "";
check("CSP present on HTML", !!csp);
check("CSP has no unsafe-eval / wildcard / unsafe-inline script", !/unsafe-eval|script-src[^;]*unsafe-inline|\*(?=[ ;]|$)/.test(csp), csp);
check("CSP script-src uses a nonce and 'self'", /script-src 'self' 'nonce-[^']+'/.test(csp));
const nonce = (csp.match(/'nonce-([^']+)'/) || [])[1];
const inlineScripts = [...home.text.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)].filter((m) => !/type="application\/ld\+json"/.test(m[1]));
check("every executable inline <script> carries the request nonce", inlineScripts.length > 0 && inlineScripts.every((m) => m[1].includes(`nonce="${nonce}"`)), `${inlineScripts.length} inline scripts`);
check("no inline event handlers in HTML", !/\son(click|load|error|submit)=/i.test(home.text));
check("CSP differs per request", (await get("/")).res.headers.get("content-security-policy") !== csp);
check("COOP present", home.res.headers.get("cross-origin-opener-policy") === "same-origin");
check("no third-party hosts in HTML", !/https?:\/\/(?!www\.nova\.eredox\.com|nova\.eredox\.com|crm\.nova\.eredox\.com|ai\.nova\.eredox\.com|schema\.org|www\.w3\.org|127\.0\.0\.1|localhost)[a-z0-9.-]+\.[a-z]{2,}/i.test(home.text.replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>/g, "")));
const nf = await get("/zz-unknown-route");
check("404 page carries CSP and is noindex", !!nf.res.headers.get("content-security-policy") && /noindex/.test(nf.text));
const api = await get("/api/forms");
check("/api/forms GET -> 405 with no-store and CSP", api.res.status === 405 && api.res.headers.get("cache-control") === "no-store" && !!api.res.headers.get("content-security-policy"));
check("no CORS headers", !home.res.headers.get("access-control-allow-origin") && !api.res.headers.get("access-control-allow-origin"));

// Link integrity (internal, from sitemap pages)
const linkSet = new Set();
for (const p of paths) {
  const { text } = await get(p);
  for (const m of text.matchAll(/<a [^>]*href="(\/[^"#]*)"/g)) linkSet.add(m[1].replace(/&amp;/g, "&"));
  await sleep(10);
}
const broken = [];
for (const l of linkSet) {
  const { res } = await get(l, { method: "HEAD" });
  if (res.status >= 400) broken.push(`${l} ${res.status}`);
}
check("internal links resolve", broken.length === 0, `${linkSet.size} unique internal links checked; broken: ${broken.join(", ") || "none"}`);
const inbound = new Map(paths.map((p) => [p, 0]));
for (const p of paths) {
  const { text } = await get(p);
  for (const m of text.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)) if (m[1] !== p && inbound.has(m[1])) inbound.set(m[1], inbound.get(m[1]) + 1);
}
const orphans = [...inbound].filter(([, n]) => n === 0).map(([p]) => p);
check("no sitemap page is orphaned", orphans.length === 0, orphans.join(", "));

// ---------- Browser checks ----------
if (BROWSER) {
  const port = 9340 + Math.floor(Math.random() * 50);
  const proc = spawn(CHROME, [`--remote-debugging-port=${port}`, "--headless=new", "--disable-gpu", "--no-first-run", `--user-data-dir=${mkdtempSync(path.join(tmpdir(), "nova-verify-"))}`, "about:blank"], { stdio: "ignore" });
  let wsUrl;
  for (let i = 0; i < 40 && !wsUrl; i++) { try { wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl; } catch { await sleep(250); } }
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = new Map(); const listeners = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { const { res, rej } = pend.get(d.id); pend.delete(d.id); d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result); } else listeners.forEach((l) => l(d)); };
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
  const profiles = {
    mobile: { w: 390, h: 844, dpr: 2, mobile: true, cpu: 4, net: { latency: 150, down: 1.6e6 / 8, up: 750e3 / 8 } },
    desktop: { w: 1350, h: 940, dpr: 1, mobile: false, cpu: 1, net: { latency: 40, down: 10e6 / 8, up: 10e6 / 8 } },
  };
  const pages = String(opt("pages", "/,/pricing,/platform,/frameworks/iso-27001,/features/evidence,/resources/faq,/contact,/book-demo,/plans/launch,/start,/zz-unknown-route")).split(",");
  const probe = `(async()=>{await new Promise(r=>setTimeout(r,1500));
    const get=(t)=>new Promise(res=>{const a=[];new PerformanceObserver(l=>a.push(...l.getEntries())).observe({type:t,buffered:true});setTimeout(()=>res(a),200)});
    const l=(await get('largest-contentful-paint')).slice(-1)[0];const ls=await get('layout-shift');const lt=await get('longtask');
    const fonts=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight);
    return {lcp:l?Math.round(l.startTime):null,cls:+ls.filter(x=>!x.hadRecentInput).reduce((s,x)=>s+x.value,0).toFixed(4),tbt:Math.round(lt.reduce((s,x)=>s+Math.max(0,x.duration-50),0)),
      hOverflow:document.documentElement.scrollWidth>innerWidth+1,fontsLoaded:[...new Set(fonts)],h1:document.querySelectorAll('h1').length,
      imgBroken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.currentSrc).map(i=>i.currentSrc)}})()`;
  for (const [pname, P] of Object.entries(profiles)) {
    for (const p of pages) {
      const { targetId } = await send("Target.createTarget", { url: "about:blank" });
      const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
      const s = (m, pr) => send(m, pr, sessionId);
      const msgs = [], failed = [], hosts = new Set(); let bytes = 0, jsBytes = 0, imgBytes = 0, fontBytes = 0; const types = new Map();
      const l = (d) => {
        if (d.sessionId !== sessionId) return;
        if (d.method === "Log.entryAdded" && ["error", "warning"].includes(d.params.entry.level)) msgs.push(d.params.entry.text.slice(0, 200));
        if (d.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(d.params.type)) msgs.push(d.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 200));
        if (d.method === "Runtime.exceptionThrown") msgs.push("exception: " + (d.params.exceptionDetails.text || "").slice(0, 120));
        if (d.method === "Network.responseReceived") { types.set(d.params.requestId, d.params.type); if (/^https?:/.test(d.params.response.url)) hosts.add(new URL(d.params.response.url).host); if (d.params.response.status >= 400) failed.push(`${d.params.response.status} ${d.params.response.url.replace(BASE, "")}`); }
        if (d.method === "Network.loadingFailed") failed.push(`failed ${d.params.errorText} ${d.params.blockedReason || ""}`);
        if (d.method === "Network.loadingFinished") { const t = types.get(d.params.requestId), n = d.params.encodedDataLength; bytes += n; if (t === "Script") jsBytes += n; if (t === "Image") imgBytes += n; if (t === "Font") fontBytes += n; }
      };
      listeners.push(l);
      await s("Page.enable"); await s("Network.enable"); await s("Log.enable"); await s("Runtime.enable");
      await s("Network.setCacheDisabled", { cacheDisabled: true });
      await s("Emulation.setDeviceMetricsOverride", { width: P.w, height: P.h, deviceScaleFactor: P.dpr, mobile: P.mobile });
      await s("Network.emulateNetworkConditions", { offline: false, latency: P.net.latency, downloadThroughput: P.net.down, uploadThroughput: P.net.up });
      await s("Emulation.setCPUThrottlingRate", { rate: P.cpu });
      await s("Page.navigate", { url: BASE + p });
      await new Promise((resolve) => { const w = (d) => { if (d.sessionId === sessionId && d.method === "Page.loadEventFired") { listeners.splice(listeners.indexOf(w), 1); resolve(); } }; listeners.push(w); setTimeout(resolve, 45000); });
      const r = (await s("Runtime.evaluate", { expression: probe, awaitPromise: true, returnByValue: true })).result.value;
      listeners.splice(listeners.indexOf(l), 1);
      const row = { profile: pname, path: p, transferKB: Math.round(bytes / 1024), jsKB: Math.round(jsBytes / 1024), imgKB: Math.round(imgBytes / 1024), fontKB: Math.round(fontBytes / 1024), hosts: [...hosts], consoleIssues: msgs, failedRequests: failed, ...r };
      results.browser.push(row);
      const expected404 = p === "/zz-unknown-route";
      const bad = [...msgs.filter((m) => !expected404 || !/404/.test(m)), ...failed.filter((f) => !expected404 || !/404/.test(f))];
      check(`browser ${pname} ${p}: no console errors/CSP violations/failed requests`, bad.length === 0, bad.slice(0, 3).join(" | "));
      check(`browser ${pname} ${p}: same-origin only`, [...hosts].every((h) => h === new URL(BASE).host), [...hosts].join(","));
      if (pname === "mobile") check(`browser mobile ${p}: no horizontal overflow`, !r.hOverflow);
      await send("Target.closeTarget", { targetId });
      await sleep(400);
    }
  }
  ws.close(); proc.kill();
}

results.failures = failures;
if (OUT) writeFileSync(String(OUT), JSON.stringify(results, null, 1));
console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
