# NOVA-WEB-RELEASE-003 — Search-engine crawler readiness

Date 2026-11-08 · Branch `remediate/nova-web-remediate-001` · Scope: robots.txt, HTTP responses, meta robots, canonicals, server security configuration and crawler access for www.nova.eredox.com. Subscription, pricing cards, registration, billing, Odoo, Stripe, DNS, production infrastructure: **not touched**.

**How to read the results.** Three different things are kept apart: (1) **robots-policy compatibility** — what `public/robots.txt` permits, evaluated with an RFC 9309 matcher; (2) **server answer to a crawler-shaped request** — what nginx/the app return when a request carries that crawler's User-Agent string (*simulation*: a User-Agent header is not identity); (3) **actual crawler access** — only observable in server logs from verified crawler addresses, Search Console or Bing Webmaster Tools. (3) was not observable in this package and is reported **NOT VERIFIED** for every platform. Reproduce (1) and (2) with `node scripts/discovery/check-discovery.mjs --base <url>`.

## 1. Result
| Question | Answer |
|---|---|
| Does robots.txt allow search, AI-search and user-initiated crawlers to every sitemap URL? | **Yes** — 12 crawler tokens × 69 URLs, 0 blocked (release candidate); 12 × 66 on production today |
| Does anything in nginx, the app or DNS discriminate by User-Agent? | **No rule found**: the repository vhost has no `$http_user_agent`/deny/geo/connection-limit directives; the app contains no UA logic; 34 simulated crawler requests to production and to the release candidate returned identical status and content |
| Rate limits that could throttle crawlers? | Only `limit_req` on `POST /api/forms` (6 r/m, burst 3) and the app's form limiter. **No limit applies to page GETs** in the repository configuration |
| Challenge / bot-protection page? | **None observed**. `www.nova.eredox.com` resolves directly to Server1 (`168.144.244.21`, `Server: nginx/1.27.5`), i.e. no CDN or reverse-proxy WAF in front; a host firewall or Server1-level rules are **not inspected** (NOT VERIFIED) |
| JavaScript needed to read content? | **No**: every sitemap page returns ≥ 242 words of body text, one `<h1>`, canonical and structured data in the initial HTML (raw GET, no script execution) |
| Do real crawlers access the site successfully? | **NOT VERIFIED** (no logs, no account access) |

## 2. Crawler compatibility matrix
"Intended access" is the decision recorded in `NOVA_AI_SEARCH_DISCOVERY_READINESS.md` §2. "Actual robots policy" is the group that applies (RFC 9309: a named group replaces `*`). "HTTP" is the simulated-UA result. All **WAF/challenge** cells read *none observed* (see §1); all "actual access" cells are NOT VERIFIED.

| Platform | Official crawler token | Intended access | Actual robots policy (this branch) | HTTP accessibility (simulated UA) | Verification method for the *real* crawler | Status | Required correction |
|---|---|---|---|---|---|---|---|
| Google Search | `Googlebot` | Allow | Named group → Allow `/` | 200, identical to baseline | Reverse DNS to `googlebot.com`/`google.com` + forward confirm, or Google's published Googlebot IP JSON; then Search Console URL Inspection / Crawl stats | Policy **PASS** · access **NOT VERIFIED** | None. Confirm in Search Console after release |
| Microsoft Bing | `Bingbot` | Allow | Named group → Allow `/` | 200 | Reverse DNS to `search.msn.com` or Bing's published IP list; Bing Webmaster Tools "Verify Bingbot" | Policy **PASS** · access **NOT VERIFIED** | Bing Webmaster Tools ownership status unknown (§ Activation plan) |
| DuckDuckGo | `DuckDuckBot` | Allow | `*` → Allow | 200 | Vendor-published IP list | Policy **PASS** · NOT VERIFIED | None |
| Apple | `Applebot` | Allow | `*` → Allow | 200 | Reverse DNS to `applebot.apple.com` | Policy **PASS** · NOT VERIFIED | None |
| Yandex | `YandexBot` | Allow | `*` → Allow | 200 | Reverse DNS to `yandex.ru/.net/.com` | Policy **PASS** · NOT VERIFIED | None (market relevance for NOVA is a business call) |
| Baidu | `Baiduspider` | Allow | `*` → Allow | 200 | Reverse DNS to `baidu.com`/`baidu.jp` | Policy **PASS** · NOT VERIFIED | None |
| OpenAI ChatGPT search | `OAI-SearchBot` | Allow | Named group → Allow `/` | 200 | OpenAI's published `searchbot.json` IP list | Policy **PASS** · NOT VERIFIED | None |
| Anthropic Claude search | `Claude-SearchBot` | Allow | **New explicit** group → Allow `/` (previously only via `*`) | 200 | Anthropic documents the token and User-Agent; **I did not find a published IP list** in the sources reviewed, so IP-based identity verification may not be possible | Policy **PASS** · NOT VERIFIED | Added explicit Allow (commit in this package) |
| Perplexity search index | `PerplexityBot` | Allow | Named group → Allow `/` | 200 | Perplexity's published `perplexitybot.json` IP list | Policy **PASS** · NOT VERIFIED | None |
| OpenAI user-initiated | `ChatGPT-User` | Allow | Named group → Allow `/` | 200 | `chatgpt-user.json` IP list. OpenAI states robots.txt rules may not apply to user-initiated fetches | Policy **PASS** · NOT VERIFIED | None |
| Anthropic user-initiated | `Claude-User` | Allow | **New explicit** group → Allow `/` | 200 | UA only (as above) | Policy **PASS** · NOT VERIFIED | Added explicit Allow |
| Perplexity user-initiated | `Perplexity-User` | Allow | **New explicit** group → Allow `/` | 200 | `perplexity-user.json` IP list; Perplexity says this fetcher generally ignores robots.txt | Policy **PASS** · NOT VERIFIED | Added explicit Allow |
| OpenAI training | `GPTBot` | **Founder decision** (current: Allow) | Named group → Allow `/` (**unchanged**) | n/a (reported only) | `gptbot.json` | Documented, not asserted | None without Founder decision |
| Anthropic training | `ClaudeBot` | **Founder decision** (current: Allow) | Named group → Allow `/` (**unchanged**; moved under the "training" heading) | n/a | UA only | Documented | Same |
| Google Gemini training/grounding control | `Google-Extended` | **Founder decision** (current: Allow) | Named group → Allow `/` (**unchanged**) | token only, no crawl of its own | Controlled by robots.txt only; does not affect Search indexing | Documented | Same |
| Apple AI training control | `Applebot-Extended` | **Founder decision** (current: effectively Allow via `*`) | `*` → Allow | token only | robots.txt only | Documented | Same — not named in robots.txt today |
| Common Crawl | `CCBot` | Blocked today | Named group → **Disallow `/`** (unchanged) | n/a | vendor IP list | Documented | Same |
| X / Meta previews | `Twitterbot`, `facebookexternalhit` | Allow | Named groups → Allow | 200 | n/a | PASS (policy) | None |

Other documented AI/training crawlers (for example Meta, ByteDance, Amazon, Cohere agents) are **not named**, so they fall under `*` (Allow). Whether to name and block any of them is part of the Founder training decision; nothing was added.

## 3. Evidence
| Check | Result | Source |
|---|---|---|
| robots.txt 200 `text/plain`, 1,403 bytes (< 500 KiB; production today 640 bytes), references `https://www.nova.eredox.com/sitemap.xml` | PASS (local RC and production) | `evidence/discovery-check-local-rc.txt`, `…-live-2026-11-08.json` |
| Policy per crawler × 69 sitemap URLs | 0 blocked for all search / AI-search / user-initiated tokens | same |
| Simulated-UA requests (17 UAs × 2 pages) vs default UA | 34/34 identical (status 200, body length within 600 bytes), **on production and on the release candidate** | same |
| `X-Robots-Tag` anywhere | none | same |
| Canonical / meta robots (69 pages, raw HTML) | one self-referencing absolute canonical equal to the sitemap `<loc>` on all 69; no `noindex`/`nofollow` meta on any of them | `evidence/sitemap-url-inventory.csv` |
| Intentional `noindex` pages | `/status`, `/testimonials`, `/resources/product-updates`, `/resources/case-studies`, `/resources/webinars`, `/book-demo/confirmed`: reachable (200), `noindex`, not in the sitemap | checker |
| Unknown URL | real **404** with `noindex` | checker |
| Server security configuration vs crawlers | CSP is nonce-based and has no effect on crawlers; headers (HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy, COOP, `Cache-Control: private, no-cache`) are all compatible with crawling. `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` do not affect indexing. `Cache-Control: private, no-cache` on HTML does not prevent indexing (crawlers revalidate) | RELEASE-002 security verification |
| Sensitive routes | `/.env`, `/.git/config`, `/package.json`, `/src/*`, `/server/*`, `/.output/*`, `*.map`, `/index.html`, `/_serverFn/*` → 404/403; `/api/forms` GET → 405; `/api/` and `/node_modules/` → 307 to the slash-less path, then 404/405 | checker |

## 4. Defects found and fixed in this package
1. **`/industries` and its five pages were an unreachable island** — they linked only to each other. Nothing reachable from the homepage by HTML links led to them (the RELEASE-001/002 orphan test counted inbound links from *any* page, so the closed cluster passed). A true reachability walk from `/` found it. Fix: footer link "Industries" (site-wide, server-rendered). After: **69/69 sitemap pages reachable from `/`** by following HTML links only.
2. `/features/framework-management` jumped from `<h1>` to `<h3>` (no `<h2>`): added a visible "Key capabilities" `<h2>`; heading outline now valid on all 69 pages.
3. `robots.txt` regrouped into the four purposes with explicit entries for `Claude-SearchBot`, `Claude-User`, `Perplexity-User`. **No existing permission changed** (verified by comparing the parsed groups of the old and new file: changed `[]`, added the three tokens, removed none). `ClaudeBot` was previously commented as an "AI search" crawler; it is the training crawler and now sits under that heading.

## 5. Not verified / limits
* Real crawler traffic of every platform; verified-IP logs; Search Console and Bing Webmaster Tools data.
* Server1 host firewall, fail2ban-style tools, or any rule outside the repository vhost; the live vhost file itself (see RELEASE-002).
* The production site still serves the 22 Oct build (soft 404s, no CSP, 66-URL sitemap, older robots.txt); every statement about the "release candidate" applies after deployment.
* Crawl behaviour under load, crawl budget, and rendering by Googlebot's Web Rendering Service (not needed: content is server-rendered, but not observed).
