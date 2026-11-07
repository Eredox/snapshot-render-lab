#!/usr/bin/env node
// NOVA search / AI discovery readiness checks. Dependency-free (Node 20+). GET/HEAD only, no forms, no JavaScript execution.
//
//   node scripts/discovery/check-discovery.mjs --base http://127.0.0.1:3000 [--out report.json] [--delay 0] [--ua-sim]
//   node scripts/discovery/check-discovery.mjs --base https://www.nova.eredox.com --live --delay 400   (bounded: robots, sitemap, home, UA simulation only)
//
// IMPORTANT: this proves *robots-policy compatibility* and *how the server answers a request carrying a crawler's User-Agent string*.
// It does NOT prove that the real crawler is accepted: a User-Agent header alone is not bot identity. Real access stays NOT VERIFIED until
// observed in server logs from verified crawler IPs (see docs/audits/NOVA-WEB-RELEASE-003).
import { writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i === -1 ? dflt : (args[i + 1]?.startsWith("--") || args[i + 1] === undefined ? true : args[i + 1]); };
const BASE = String(opt("base", "http://127.0.0.1:3000")).replace(/\/$/, "");
const LIVE = args.includes("--live");
const DELAY = Number(opt("delay", LIVE ? 400 : 0));
const OUT = opt("out", null);
const CANON = "https://www.nova.eredox.com"; // canonical origin as published
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
let failures = 0;
const check = (area, name, ok, detail = "") => { if (ok === false) failures += 1; results.push({ area, name, status: ok === true ? "PASS" : ok === false ? "FAIL" : String(ok), detail }); console.log(`${ok === true ? "PASS" : ok === false ? "FAIL" : ok}  [${area}] ${name}${detail ? "  — " + detail : ""}`); };

/** Crawlers. `category`: search | ai-search | user-initiated | training | social. UA strings are approximations for simulation only; vendor documentation is authoritative. */
export const CRAWLERS = [
  { token: "Googlebot", platform: "Google Search", category: "search", ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
  { token: "Bingbot", platform: "Microsoft Bing", category: "search", ua: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" },
  { token: "DuckDuckBot", platform: "DuckDuckGo", category: "search", ua: "DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)" },
  { token: "Applebot", platform: "Apple (Spotlight/Siri search)", category: "search", ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)" },
  { token: "YandexBot", platform: "Yandex", category: "search", ua: "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)" },
  { token: "Baiduspider", platform: "Baidu", category: "search", ua: "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)" },
  { token: "OAI-SearchBot", platform: "OpenAI ChatGPT search", category: "ai-search", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.3; +https://openai.com/searchbot" },
  { token: "Claude-SearchBot", platform: "Anthropic Claude search", category: "ai-search", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-SearchBot/1.0; +Claude-SearchBot@anthropic.com)" },
  { token: "PerplexityBot", platform: "Perplexity search index", category: "ai-search", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)" },
  { token: "ChatGPT-User", platform: "OpenAI user-initiated fetch", category: "user-initiated", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot" },
  { token: "Claude-User", platform: "Anthropic user-initiated fetch", category: "user-initiated", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +Claude-User@anthropic.com)" },
  { token: "Perplexity-User", platform: "Perplexity user-initiated fetch", category: "user-initiated", ua: "Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)" },
  { token: "GPTBot", platform: "OpenAI model training", category: "training", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.3; +https://openai.com/gptbot" },
  { token: "ClaudeBot", platform: "Anthropic model training", category: "training", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" },
  { token: "Google-Extended", platform: "Google Gemini training/grounding control (robots token only; no separate UA)", category: "training", ua: null },
  { token: "Applebot-Extended", platform: "Apple AI training control (robots token only)", category: "training", ua: null },
  { token: "CCBot", platform: "Common Crawl (training corpora)", category: "training", ua: "CCBot/2.0 (https://commoncrawl.org/faq/)" },
  { token: "Twitterbot", platform: "X link previews", category: "social", ua: "Twitterbot/1.0" },
  { token: "facebookexternalhit", platform: "Meta link previews", category: "social", ua: "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" },
];

// ---------- robots.txt (RFC 9309 matching: group by agent, longest matching rule wins, Allow wins ties, * and $ supported)
export function parseRobots(text) {
  const groups = []; let cur = null; let lastWasAgent = false; const sitemaps = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim(); if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/); if (!m) continue;
    const key = m[1].toLowerCase(), val = m[2].trim();
    if (key === "sitemap") { sitemaps.push(val); continue; }
    if (key === "user-agent") { if (!cur || !lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); } cur.agents.push(val.toLowerCase()); lastWasAgent = true; continue; }
    lastWasAgent = false;
    if (cur && (key === "allow" || key === "disallow")) cur.rules.push({ allow: key === "allow", path: val });
  }
  return { groups, sitemaps };
}
const patToRe = (p) => new RegExp("^" + p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
export function robotsAllows(robots, token, path) {
  const t = token.toLowerCase();
  let rules = robots.groups.filter((g) => g.agents.includes(t)).flatMap((g) => g.rules);
  let via = t;
  if (!robots.groups.some((g) => g.agents.includes(t))) { rules = robots.groups.filter((g) => g.agents.includes("*")).flatMap((g) => g.rules); via = "*"; }
  let best = null;
  for (const r of rules) {
    if (r.path === "") continue; // empty Disallow = allow all; empty Allow = no-op
    if (!patToRe(r.path).test(path)) continue;
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow)) best = r;
  }
  return { allowed: best ? best.allow : true, via, rule: best ? `${best.allow ? "Allow" : "Disallow"}: ${best.path}` : "(no matching rule)" };
}

// ---------- fetch helpers
async function get(path, { ua = "NOVA-discovery-check/1.0 (+self-test)", redirect = "manual" } = {}) {
  if (DELAY) await sleep(DELAY);
  const res = await fetch(path.startsWith("http") ? path : BASE + path, { headers: { "user-agent": ua, accept: "text/html,application/xml,text/plain;q=0.9,*/*;q=0.5" }, redirect });
  const body = await res.text();
  return { status: res.status, headers: res.headers, body, location: res.headers.get("location") };
}
const attr = (tag, name) => (tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i")) ?? [])[1];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ");

export function analyse(html) {
  const tags = (re) => [...html.matchAll(re)].map((m) => m[0]);
  const canon = tags(/<link\b[^>]*rel="canonical"[^>]*>/gi).map((t) => attr(t, "href"));
  const robotsMeta = tags(/<meta\b[^>]*name="robots"[^>]*>/gi).map((t) => attr(t, "content"));
  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [])[1] ?? "").trim();
  const descTag = tags(/<meta\b[^>]*name="description"[^>]*>/gi)[0];
  const description = descTag ? decode(attr(descTag, "content") ?? "") : "";
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: decode(m[2].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim() }));
  const ld = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => { try { return { ok: true, data: JSON.parse(m[1]) }; } catch (e) { return { ok: false, error: String(e.message) }; } });
  const text = decode(html.replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((m) => decode(m[1]));
  const lang = (html.match(/<html\b[^>]*lang="([^"]*)"/i) ?? [])[1] ?? "";
  const ogUrl = (tags(/<meta\b[^>]*property="og:url"[^>]*>/gi).map((t) => attr(t, "content")))[0];
  return { canon, robotsMeta, title, description, headings, ld, text, words: text ? text.split(" ").length : 0, links, lang, ogUrl };
}

// ---------- JSON-LD validation (schema.org structure + Google-documented required properties; no network validator is used)
export function validateLd(data, pageUrl) {
  const issues = []; const types = []; const ids = new Set(); const refs = [];
  const nodes = (Array.isArray(data) ? data : data["@graph"] ?? [data]);
  const absolute = (u) => typeof u === "string" && /^https:\/\//.test(u);
  const walk = (n) => { if (n && typeof n === "object") { if (n["@id"] && Object.keys(n).length > 1) ids.add(n["@id"]); else if (n["@id"]) refs.push(n["@id"]); Object.values(n).forEach(walk); } };
  for (const node of nodes) {
    if (node["@context"] && !/^https?:\/\/schema\.org\/?$/.test(node["@context"])) issues.push(`unexpected @context ${node["@context"]}`);
    const t = node["@type"]; types.push(t); walk(node);
    const need = (props) => props.forEach((p) => { if (node[p] === undefined || node[p] === "" ) issues.push(`${t}: missing ${p}`); });
    switch (t) {
      case "Organization": need(["name", "url"]); if (node.logo && !absolute(node.logo.url ?? node.logo)) issues.push("Organization: logo url not absolute https"); break;
      case "WebSite": need(["name", "url"]); break;
      case "AboutPage": case "ContactPage": need(["name", "url", "isPartOf"]); break;
      case "SoftwareApplication": need(["name", "applicationCategory", "operatingSystem"]); break;
      case "BreadcrumbList": {
        const items = node.itemListElement ?? []; if (!items.length) issues.push("BreadcrumbList: empty");
        items.forEach((it, i) => { if (it.position !== i + 1) issues.push(`BreadcrumbList: position ${it.position} at index ${i}`); if (!it.name) issues.push(`BreadcrumbList: item ${i + 1} no name`); if (!absolute(it.item) && i !== items.length - 1) issues.push(`BreadcrumbList: item ${i + 1} no absolute URL`); if (it.item && !String(it.item).startsWith(CANON)) issues.push(`BreadcrumbList: item ${i + 1} off canonical origin`); });
        break; }
      case "FAQPage": { const q = node.mainEntity ?? []; if (!q.length) issues.push("FAQPage: no questions"); q.forEach((x, i) => { if (x["@type"] !== "Question" || !x.name || !x.acceptedAnswer?.text) issues.push(`FAQPage: question ${i + 1} incomplete`); }); break; }
      case "BlogPosting": case "Article": case "NewsArticle": need(["headline", "author", "publisher"]); if (node.datePublished && !/^\d{4}-\d{2}-\d{2}/.test(node.datePublished)) issues.push("Article: datePublished not ISO"); if (node.url && node.url !== pageUrl) issues.push(`Article: url ${node.url} != canonical ${pageUrl}`); break;
      default: issues.push(`unrecognised/unsupported @type ${t}`);
    }
    for (const forbidden of ["aggregateRating", "review", "offers", "award", "hasCredential"]) if (node[forbidden] !== undefined) issues.push(`${t}: contains ${forbidden} (must be backed by real, visible data — review manually)`);
  }
  for (const r of refs) if (!ids.has(r)) issues.push(`unresolved @id reference ${r} (resolved only if defined elsewhere in the page)`);
  return { types, issues, ids: [...ids], refs };
}

// ================= main
const robotsRes = await get("/robots.txt");
check("robots", "robots.txt returns 200 text/plain", robotsRes.status === 200 && /text\/plain/.test(robotsRes.headers.get("content-type") ?? ""), `${robotsRes.status} ${robotsRes.headers.get("content-type")}`);
const robots = parseRobots(robotsRes.body);
check("robots", "robots.txt references the sitemap (absolute https)", robots.sitemaps.length > 0 && robots.sitemaps.every((s) => s.startsWith("https://")), robots.sitemaps.join(", "));
check("robots", "robots.txt < 500 KiB (Google limit)", Buffer.byteLength(robotsRes.body) < 500 * 1024, `${Buffer.byteLength(robotsRes.body)} bytes`);

const smRes = await get("/sitemap.xml");
check("sitemap", "sitemap.xml 200 application/xml", smRes.status === 200 && /xml/.test(smRes.headers.get("content-type") ?? ""), `${smRes.status} ${smRes.headers.get("content-type")}`);
const smXml = smRes.body;
const wellFormed = /^<\?xml[^>]*\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">[\s\S]*<\/urlset>\s*$/.test(smXml) && (smXml.match(/<url>/g) ?? []).length === (smXml.match(/<\/url>/g) ?? []).length && !/[&<](?![a-z]+;|\/?[a-z])/i.test(smXml.replace(/<[^>]+>/g, ""));
check("sitemap", "XML well-formed, sitemaps.org namespace, balanced <url>", wellFormed);
const entries = [...smXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({ loc: (m[1].match(/<loc>([^<]*)<\/loc>/) ?? [])[1], lastmod: (m[1].match(/<lastmod>([^<]*)<\/lastmod>/) ?? [])[1] }));
const locs = entries.map((e) => e.loc);
check("sitemap", "entry count", entries.length === 69 ? true : "INFO", `${entries.length} URLs (RELEASE-002 expectation: 69)`);
check("sitemap", "every <loc> is absolute https on the canonical host, no query/fragment, unique", locs.every((l) => l?.startsWith(CANON + "/") || l === CANON + "/") && locs.every((l) => !/[?#]/.test(l)) && new Set(locs).size === locs.length);
check("sitemap", "≤ 50,000 URLs and ≤ 50 MiB", entries.length <= 50000 && Buffer.byteLength(smXml) < 50 * 1024 * 1024);
const lm = entries.filter((e) => e.lastmod);
check("sitemap", "lastmod (where present) is valid W3C date, not in the future", lm.every((e) => /^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2}))?$/.test(e.lastmod) && new Date(e.lastmod) <= new Date()), `${lm.length} of ${entries.length} entries carry lastmod`);
check("sitemap", "lastmod is not a single repeated build date", lm.length < 5 || new Set(lm.map((e) => e.lastmod)).size > 1, `${new Set(lm.map((e) => e.lastmod)).size} distinct values`);

// robots × sitemap × crawler matrix
const matrix = [];
for (const c of CRAWLERS) {
  const blocked = locs.filter((l) => !robotsAllows(robots, c.token, new URL(l).pathname).allowed);
  const home = robotsAllows(robots, c.token, "/");
  matrix.push({ token: c.token, platform: c.platform, category: c.category, via: home.via, homeRule: home.rule, blockedSitemapUrls: blocked.length, allowedHome: home.allowed });
}
console.log("\nrobots.txt policy by crawler (sitemap URLs allowed / total):");
for (const m of matrix) console.log(`  ${m.token.padEnd(20)} ${m.category.padEnd(15)} group=${m.via.padEnd(18)} ${m.allowedHome ? "ALLOW" : "BLOCK"}  blockedSitemapUrls=${m.blockedSitemapUrls}`);
for (const c of CRAWLERS.filter((x) => x.category !== "training" && x.category !== "social")) {
  const m = matrix.find((x) => x.token === c.token);
  check("robots-policy", `${c.token} (${c.category}) may crawl all ${locs.length} sitemap URLs`, m.blockedSitemapUrls === 0 && m.allowedHome);
}
console.log("(training/social crawlers are reported, not asserted: their permission is a Founder decision)\n");

// UA simulation (server answers, not proof of crawler acceptance)
const baseline = await get("/");
const uaProbe = [];
for (const c of CRAWLERS.filter((x) => x.ua)) {
  for (const p of ["/", "/frameworks/iso-27001"]) {
    const r = await get(p, { ua: c.ua }); const b = p === "/" ? baseline : await get(p);
    uaProbe.push({ token: c.token, path: p, status: r.status, same: r.status === b.status && Math.abs(r.body.length - b.body.length) < 600, xrobots: r.headers.get("x-robots-tag") });
  }
}
check("http-ua-sim", "no User-Agent-dependent status or content difference (simulation only — NOT proof of real crawler acceptance)", uaProbe.every((p) => p.status === 200 && p.same), uaProbe.filter((p) => !(p.status === 200 && p.same)).map((p) => `${p.token}${p.path}=${p.status}`).join(" ") || `${uaProbe.length} requests identical`);
check("http", "no X-Robots-Tag header on any response probed", uaProbe.every((p) => !p.xrobots) && !baseline.headers.get("x-robots-tag"));

if (LIVE) { finish(); } else {
  // full local crawl of every sitemap URL, raw HTML only
  const pages = new Map();
  const queue = [...locs]; const workers = Array.from({ length: 6 }, async () => { while (queue.length) { const loc = queue.shift(); const path = new URL(loc).pathname; const r = await get(path); pages.set(loc, { r, a: analyse(r.body) }); } });
  await Promise.all(workers);
  const bad = (f) => [...pages].filter(([, p]) => !f(p)).map(([l]) => l.replace(CANON, ""));
  const must = (name, f, extra = "") => { const b = bad(f); check("pages", name, b.length === 0, b.length ? `${b.length} fail: ${b.slice(0, 6).join(" ")}` : extra); };
  must("HTTP 200, no redirect, text/html", (p) => p.r.status === 200 && /text\/html/.test(p.r.headers.get("content-type") ?? ""));
  must("self-referencing canonical, exactly one, absolute, equals sitemap <loc>", (p) => p.a.canon.length === 1);
  for (const [loc, p] of pages) if (p.a.canon.length === 1 && p.a.canon[0] !== loc) check("pages", `canonical == loc for ${loc}`, false, p.a.canon[0]);
  must("og:url equals canonical", (p) => !p.a.ogUrl || p.a.ogUrl === p.a.canon[0]);
  must("robots meta absent or index,follow (never noindex)", (p) => p.a.robotsMeta.every((m) => !/noindex|none|nofollow/i.test(m ?? "")));
  must("<html lang> set", (p) => !!p.a.lang);
  must("title 20–60 chars, description 70–160 chars", (p) => p.a.title.length >= 20 && p.a.title.length <= 60 && p.a.description.length >= 70 && p.a.description.length <= 160);
  must("exactly one <h1> and no skipped heading level", (p) => p.a.headings.filter((h) => h.level === 1).length === 1 && p.a.headings.every((h, i, a) => i === 0 || h.level <= a[i - 1].level + 1));
  must("server-rendered body text ≥ 150 words without executing JavaScript", (p) => p.a.words >= 150, `min ${Math.min(...[...pages.values()].map((p) => p.a.words))} words`);
  must("server-rendered text names the company (Eredox Pty Ltd) on every page", (p) => /Eredox Pty Ltd/.test(p.a.text), "");
  must("server-rendered text names the product (NOVA Compliance) on every page", (p) => /NOVA Compliance/.test(p.a.text));
  const about = pages.get(CANON + "/about"); check("identity", "About page states that NOVA is developed/operated by Eredox", !!about && /Eredox/.test(about.a.text) && /NOVA/.test(about.a.text));
  const titles = [...pages.values()].map((p) => p.a.title); check("pages", "titles unique", new Set(titles).size === titles.length);
  const descs = [...pages.values()].map((p) => p.a.description); check("pages", "descriptions unique", new Set(descs).size === descs.length);

  // structured data
  let ldIssues = 0; const typeCount = {};
  for (const [loc, p] of pages) {
    if (p.a.ld.some((b) => !b.ok)) { ldIssues += 1; check("jsonld", `JSON parses ${loc}`, false, p.a.ld.find((b) => !b.ok).error); continue; }
    const pageIds = new Set(); const pageRefs = [];
    for (const b of p.a.ld) { const v = validateLd(b.data, p.a.canon[0] ?? loc); v.types.forEach((t) => (typeCount[t] = (typeCount[t] ?? 0) + 1)); v.ids.forEach((i) => pageIds.add(i)); v.refs.forEach((i) => pageRefs.push(i)); const real = v.issues.filter((i) => !i.startsWith("unresolved @id")); if (real.length) { ldIssues += 1; check("jsonld", `valid ${loc}`, false, real.join("; ")); } }
    for (const r of new Set(pageRefs)) if (!pageIds.has(r)) { ldIssues += 1; check("jsonld", `@id reference resolves on ${loc}`, false, r); }
  }
  check("jsonld", "all JSON-LD blocks parse and pass structural validation", ldIssues === 0, JSON.stringify(typeCount));
  const home = pages.get(CANON + "/"); const homeTypes = (home?.a.ld ?? []).flatMap((b) => (b.ok ? validateLd(b.data, CANON + "/").types : []));
  check("jsonld", "homepage declares Organization + WebSite + SoftwareApplication", ["Organization", "WebSite", "SoftwareApplication"].every((t) => homeTypes.includes(t)), homeTypes.join(","));

  // internal link graph from raw HTML
  const toPath = (h) => { try { const u = new URL(h, BASE + "/"); if (u.origin !== new URL(BASE).origin && u.origin !== CANON) return null; return u.pathname.replace(/\/$/, "") || "/"; } catch { return null; } };
  const inbound = new Map(locs.map((l) => [new URL(l).pathname, 0]));
  for (const [loc, p] of pages) for (const t of new Set(p.a.links.map(toPath).filter(Boolean))) if (inbound.has(t) && t !== new URL(loc).pathname) inbound.set(t, inbound.get(t) + 1);
  const seen = new Set(["/"]); const q = ["/"]; while (q.length) { const cur = q.shift(); const p = pages.get(CANON + (cur === "/" ? "/" : cur)); if (!p) continue; for (const t of p.a.links.map(toPath)) if (t && inbound.has(t) && !seen.has(t)) { seen.add(t); q.push(t); } }
  const orphans = [...inbound.keys()].filter((k) => !seen.has(k));
  check("links", "every sitemap URL reachable from / by following HTML <a href> only", orphans.length === 0, orphans.join(" ") || `${seen.size}/${inbound.size} reachable`);
  const weak = [...inbound].filter(([, n]) => n < 2).map(([k]) => k);
  check("links", "pages with fewer than 2 inbound HTML links (informational)", weak.length ? "INFO" : true, weak.join(" "));

  // intentional exclusions, 404, private routes
  for (const p of ["/status", "/testimonials", "/resources/product-updates", "/resources/case-studies", "/resources/webinars", "/book-demo/confirmed"]) {
    const r = await get(p); const a = analyse(r.body);
    check("exclusions", `${p}: reachable, noindex, not in sitemap`, r.status === 200 && a.robotsMeta.some((m) => /noindex/i.test(m ?? "")) && !locs.includes(CANON + p), `${r.status} meta=${a.robotsMeta.join("|")}`);
  }
  const nf = await get("/zz-not-a-page-" + Date.now()); check("404", "unknown URL → real 404 with noindex", nf.status === 404 && analyse(nf.body).robotsMeta.some((m) => /noindex/i.test(m ?? "")));
  for (const p of ["/index.html", "/404", "/assets/x.js.map", "/.env", "/.git/config", "/package.json", "/src/server.ts", "/node_modules/", "/_serverFn/x", "/api/", "/api/forms", "/server/index.mjs", "/.output/nitro.json", "/llms.txt"]) {
    let r = await get(p); if ([301, 307, 308].includes(r.status) && r.location) r = await get(new URL(r.location, BASE + "/").pathname); const exposes = r.status === 200 && !/<html/i.test(r.body) && /\{|\bimport\b|DB_|SECRET|KEY/.test(r.body.slice(0, 2000)) && p !== "/llms.txt";
    check("private-routes", `${p} not exposed (${r.status})`, [403, 404, 405].includes(r.status) && !exposes || (p === "/llms.txt" ? "INFO" : false), `${r.status} ${r.headers.get("content-type") ?? ""}`);
  }
  finish();
}

async function finish() {
  if (OUT) await writeFile(OUT, JSON.stringify({ base: BASE, live: LIVE, generated: new Date().toISOString(), matrix, results }, null, 2));
  console.log(failures ? `\nRESULT FAIL (${failures})` : "\nRESULT PASS");
  process.exit(failures ? 1 : 0);
}
