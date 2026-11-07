#!/usr/bin/env node
// IndexNow notifier for www.nova.eredox.com. DRY-RUN BY DEFAULT: it validates and prints; it sends nothing.
//
//   node scripts/discovery/indexnow.mjs --urls changed-urls.txt                 # validate + print the request that WOULD be sent
//   node scripts/discovery/indexnow.mjs --sitemap-diff old-sitemap.xml          # URLs new (or with a different lastmod) vs a saved sitemap
//   NOVA_INDEXNOW_APPROVED=yes node scripts/discovery/indexnow.mjs --urls f.txt --submit   # real submission (release approval required)
//
// Ownership key: the key is the file name of the key file already published in /public (public/<key>.txt, content = the key).
// IndexNow keys are public by design (the protocol verifies ownership by fetching that file); nothing here is a secret.
// Only genuinely changed URLs belong in the input: the release engineer lists them from the reviewed diff. Participating engines
// (documented at indexnow.org) include Bing, Yandex, Naver, Seznam and Yep; Google does NOT use IndexNow - use Search Console for Google.
import { readFile, readdir } from "node:fs/promises";

const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(`--${n}`); return i === -1 ? null : args[i + 1]; };
const HOST = "www.nova.eredox.com";
const ORIGIN = `https://${HOST}`;
const ENDPOINT = process.env.NOVA_INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const submit = args.includes("--submit");
class Stop extends Error {}
const fail = (m) => { console.error("ERROR " + m); process.exitCode = 1; throw new Stop(); }; // throw (not process.exit): lets sockets close cleanly on Windows
try {

// 1. key = the single 32-128 char [A-Za-z0-9-] file name in /public whose content equals its own name
const publicFiles = await readdir(new URL("../../public/", import.meta.url));
const keyFiles = [];
for (const f of publicFiles.filter((x) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(x))) {
  const key = f.slice(0, -4); if ((await readFile(new URL(`../../public/${f}`, import.meta.url), "utf8")).trim() === key) keyFiles.push(key);
}
if (keyFiles.length !== 1) fail(`expected exactly one IndexNow key file in public/, found ${keyFiles.length}`);
const key = keyFiles[0];
const keyLocation = `${ORIGIN}/${key}.txt`;

// 2. sitemap = the only URLs that may be submitted (no placeholder, redirected or non-indexable pages)
const smSource = process.env.NOVA_SITEMAP_FILE ? await readFile(process.env.NOVA_SITEMAP_FILE, "utf8") : await (await fetch(`${process.env.NOVA_BASE || ORIGIN}/sitemap.xml`)).text();
const parse = (xml) => new Map([...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => [(m[1].match(/<loc>([^<]*)<\/loc>/) ?? [])[1], (m[1].match(/<lastmod>([^<]*)<\/lastmod>/) ?? [])[1] ?? ""]));
const current = parse(smSource);
const norm = (u) => u.replace(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/, ORIGIN);
const currentN = new Map([...current].map(([k, v]) => [norm(k), v]));

let wanted = [];
if (val("urls")) wanted = (await readFile(val("urls"), "utf8")).split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));
if (val("sitemap-diff")) { const old = parse(await readFile(val("sitemap-diff"), "utf8")); for (const [u, lm] of currentN) if (!old.has(u) || old.get(u) !== lm) wanted.push(u); }
wanted = [...new Set(wanted)];
if (!wanted.length) fail("no URLs given (--urls FILE and/or --sitemap-diff OLD.xml)");

const rejected = wanted.filter((u) => { try { const x = new URL(u); return x.origin !== ORIGIN || x.search || x.hash || !currentN.has(u); } catch { return true; } });
if (rejected.length) fail(`not in the sitemap / wrong host / has query: ${rejected.slice(0, 5).join(", ")}${rejected.length > 5 ? " ..." : ""}`);
if (wanted.length > 10000) fail("IndexNow accepts at most 10,000 URLs per request");

const body = { host: HOST, key, keyLocation, urlList: wanted };
console.log(`IndexNow ${submit ? "SUBMIT" : "DRY-RUN"}: ${wanted.length} URL(s) to ${ENDPOINT}\n  key file: ${keyLocation}`);
wanted.slice(0, 20).forEach((u) => console.log("  " + u)); if (wanted.length > 20) console.log(`  ... +${wanted.length - 20}`);

// 3. the live key file must really be reachable and match before anything is sent
const live = await fetch(keyLocation).then((r) => (r.ok && /text\/plain/.test(r.headers.get("content-type") ?? "") ? r.text() : null)).catch(() => null);
console.log(`  live key file check: ${live?.trim() === key ? "OK (served as text/plain, content matches)" : "NOT SERVED / MISMATCH - engines would reject the submission"}`);

if (!submit) { console.log("Dry-run only. Nothing sent."); throw new Stop(); }
if (process.env.NOVA_INDEXNOW_APPROVED !== "yes") fail("refusing to submit: set NOVA_INDEXNOW_APPROVED=yes after release approval");
if (live?.trim() !== key) fail("key file not live - deploy first");
const res = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(body) });
console.log(`Response: ${res.status} (200/202 = accepted; 400 invalid; 403 key not verified; 422 URL/key mismatch; 429 too many)`);
process.exitCode = res.status === 200 || res.status === 202 ? 0 : 1;
} catch (e) { if (!(e instanceof Stop)) throw e; }
