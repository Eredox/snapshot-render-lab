# NOVA-WEB-RELEASE-003 — Search indexing activation plan

**Status: PREPARED, NOT EXECUTED.** Nothing was submitted, verified, published or changed on any search-engine account, DNS record or production system. Every step marked ⛔ needs account access and release approval first. Activation follows the website deployment (RELEASE-002 execution plan); submitting a sitemap for a site that still serves the 22 Oct build (soft 404s, no CSP, 66-URL sitemap) would index the old behaviour.

## 1. Current state of ownership and verification
| Service | Evidence found | Status |
|---|---|---|
| **Google Search Console** | `public/google09b732402a3c6243.html` committed 2026-09-26, served live (200 `text/html`) | File exists. Whether the property is verified and which property type (URL-prefix `https://www.nova.eredox.com/` vs Domain) is **NOT VERIFIED** — needs the Search Console account. A URL-prefix property verified by this HTML file does not cover other hostnames (`nova.eredox.com` is the application and is intentionally `noindex`) |
| **Bing Webmaster Tools** | No `BingSiteAuth.xml`, no `msvalidate.01` meta, no Bing DNS record in the repo or in public DNS | **NOT VERIFIED / likely not set up directly.** Bing can import sites from Google Search Console; whether that happened is unknown |
| **IndexNow** | Key file `public/2695136d30af499e9ced4742ab0d9681.txt` committed 2026-09-26; live body equals the key (checked 2026-11-08) | Key published and valid. **No submission history is known** |
| Yandex / Naver / Seznam webmaster tools | nothing found | not set up; optional |
| DNS | `eredox.com` TXT shows only a Brevo code; `www.nova.eredox.com` A → Server1 directly | no change proposed or made |
All existing verification files are kept exactly as they are; no verification file or record is created by this package.

## 2. Pre-activation gate (all must be true)
1. RELEASE-002 conditions cleared and the website deployed with the approved build (robots.txt, 69-URL sitemap, genuine 404s).
2. `node scripts/discovery/check-discovery.mjs --base https://www.nova.eredox.com --live --delay 400` → `RESULT PASS` with **69** sitemap entries (bounded: robots, sitemap, UA simulation). Optionally the full crawl on a staging copy.
3. Training-crawler policy: **Founder decision recorded 2026-11-08 — retain existing permissions** (GPTBot, ClaudeBot, Google-Extended allowed; CCBot restricted). Nothing further needed unless the Founder changes it.
4. Someone with account access is named for each service below.

## 3. Google Search Console ⛔
1. Open the existing property (do not add a second one). Confirm ownership status = Verified; if not, verify with the existing HTML file (still served) — never delete it.
2. **Sitemaps → submit** `https://www.nova.eredox.com/sitemap.xml`. Expect "Success" and 69 discovered URLs.
3. **URL Inspection** (live test) for `/`, `/pricing`, `/frameworks/iso-27001`, `/industries`: confirm "URL is available to Google", user-declared canonical = Google-selected canonical, rendered HTML shows the content. This is the first *real* evidence of Googlebot access (the matrix in `NOVA_SEARCH_ENGINE_CRAWLER_READINESS.md` stays NOT VERIFIED until then).
4a. **Search generative AI setting (Founder-required checkpoint).** In Search Console → Settings, locate the property-level **"Search generative AI"** control (Google introduced it in 2026 for AI Overviews, AI Mode and generative AI features in Discover; per press reports the default is *Include* and it is separate from `Google-Extended`, which governs training/grounding). Confirm it is set to **Include** for `https://www.nova.eredox.com/`, record the value with date and screenshot in the release record, and do not change it without a Founder decision. I could not open Search Console, so the setting's current value is **NOT VERIFIED**, and its exact label and availability should be re-checked in Google's current help pages.
4. Request indexing only for a handful of key URLs (quota-limited); the sitemap does the rest.
5. Pages report: expect `/status`, `/testimonials`, `/resources/product-updates`, `/resources/case-studies` as "Excluded by 'noindex' tag" (intentional). Previously reported soft 404s should clear as Google re-crawls.
6. Record baseline: Pages (indexed / not indexed with reasons), Crawl stats (response codes, host status), Core Web Vitals (field data may be insufficient for weeks). **No ranking or traffic improvement is promised.**

## 4. Bing Webmaster Tools ⛔
1. Sign in; if the site is absent, **import from Google Search Console** (preferred, no site change) or add via an XML file/meta tag/CNAME. If a file or meta is needed it must be added in a release (new file name, never replacing existing ones); a DNS CNAME needs separate DNS approval.
2. Submit the same sitemap. Run "URL Inspection" on the key URLs and the **Verify Bingbot** tool against server-log entries (confirms a request really came from Bing).
3. Confirm IndexNow key status in the Bing "IndexNow" report (the key file already exists).

## 5. IndexNow ⛔ (appropriate, with limits)
*Appropriate because* it is free, the key is already published, and Bing-family engines and other participating engines (documented at indexnow.org: Bing, Yandex, Naver, Seznam, Yep) can use it. *Limits:* Google does not use IndexNow (sources reviewed in 2026), so it does not replace Search Console; it only notifies engines — it does not guarantee indexing.
* Tool: `scripts/discovery/indexnow.mjs` (this package). **Dry-run by default.** It finds the key from `public/<key>.txt`, restricts submissions to URLs that are in the live sitemap on `www.nova.eredox.com` (no placeholder, redirected, query-string or non-indexable URLs), verifies the key file is served before sending, caps at 10,000, and refuses to send unless `--submit` **and** `NOVA_INDEXNOW_APPROVED=yes` are given. Tested here: dry-run OK; URL not in sitemap rejected; submit without approval refused (`evidence/indexnow-dry-run.txt`).
* When to notify: only for URLs whose content genuinely changed in a release, listed by the release engineer from the reviewed diff (`--urls changed.txt`) or new/changed-lastmod entries (`--sitemap-diff previous-sitemap.xml`). Do not submit the whole sitemap on every deploy. First launch after deployment: submitting the changed set once is reasonable (pages retitled, `/industries` and plan pages newly in the sitemap).
* Key handling: the IndexNow key is public by design (ownership proof is fetching the file); do not rotate it without publishing the new file first; never put it in a place that requires secrecy. Rotating means: new file in a release → deploy → switch the tool.

## 6. Verifying real crawlers (turns NOT VERIFIED into evidence)
Ask the operator to export nginx access logs (not committed; they contain IP addresses) for the week after activation and check each platform with its **official** method — never by User-Agent alone:
| Platform | Method |
|---|---|
| Googlebot | reverse DNS → `*.googlebot.com`/`*.google.com`, forward-confirm; or Google's published IP JSON; plus Search Console Crawl stats |
| Bingbot | reverse DNS → `*.search.msn.com`; or Bing's published IP list; Bing Webmaster "Verify Bingbot" |
| OAI-SearchBot / ChatGPT-User / GPTBot | OpenAI's published `searchbot.json` / `chatgpt-user.json` / `gptbot.json` |
| PerplexityBot / Perplexity-User | Perplexity's published `perplexitybot.json` / `perplexity-user.json` |
| Claude-SearchBot / Claude-User / ClaudeBot | UA token only unless Anthropic publishes IP ranges; record as "UA-identified, address not verifiable" |
| Applebot, DuckDuckBot, YandexBot, Baiduspider | reverse DNS / published lists per vendor |
Expected result: 200 for HTML, no 4xx/5xx spikes, no 429 (page GETs are not rate-limited at the edge in the repository config). If a legitimate crawler is blocked, fix the rule that blocks it; **never disable security protections globally**.

## 7. Monitoring and cadence
Week 1: daily Search Console Pages/Crawl stats and Bing report; log review as above. Weeks 4 and 8: indexed-page count vs the 69 submitted, query/CTR data for the retitled pages, structured-data reports (Rich Results Test and validator.schema.org run on live URLs at activation). Record AI-assistant mentions only as dated manual observations; they are anecdotal, not a metric.

## 8. Out of scope / not done
No Search Console or Bing action, no IndexNow submission, no DNS change, no new verification file, no `llms.txt`, no change to subscription, pricing, registration, billing, Odoo or Stripe, no change to the training-crawler policy.
