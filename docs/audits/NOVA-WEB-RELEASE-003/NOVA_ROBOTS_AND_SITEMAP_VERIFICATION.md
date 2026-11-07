# NOVA-WEB-RELEASE-003 — robots.txt and sitemap verification

Date 2026-11-08 · Release candidate = this branch built with `bun run build` and served on loopback; production = the live 22 Oct build, read with bounded GETs. Raw results: `evidence/discovery-check-local-rc.{txt,json}`, `evidence/discovery-check-live-2026-11-08.json`, per-URL table `evidence/sitemap-url-inventory.csv`. Re-run: `node scripts/discovery/check-discovery.mjs --base <url>`.

## 1. robots.txt
| Check | Release candidate | Production today |
|---|---|---|
| `GET /robots.txt` | 200 `text/plain; charset=utf-8`, 1,403 bytes | 200 `text/plain`, 640 bytes |
| Sitemap referenced | `Sitemap: https://www.nova.eredox.com/sitemap.xml` (absolute, canonical host) | same |
| Blocks everything for `*`? | No (`Allow: /`) | No |
| Only Disallow rule | `CCBot` (`Disallow: /`), unchanged | same |
| Change in this package | Regrouped by purpose (search / AI search / user-initiated / training / previews); added explicit `Claude-SearchBot`, `Claude-User`, `Perplexity-User` (Allow); **no existing permission changed** (old vs new parsed groups: changed `[]`) | — |
| Paths such as `/api/` | Not disallowed. `/api/forms` is not linked anywhere and answers GET with 405; a `Disallow` would need repeating inside every named group (RFC 9309 groups do not inherit from `*`), which adds risk for no discovery benefit. Left as is | same |

Matcher: RFC 9309 (named group replaces `*`; longest rule wins; `Allow` wins ties; `*` and `$` supported) implemented in `scripts/discovery/check-discovery.mjs`, and a unit test (`src/lib/__tests__/robots-policy.test.ts`, 4 tests) pins the allow/training policy.

## 2. sitemap.xml
| Check | Release candidate | Production today |
|---|---|---|
| HTTP / type | 200 `application/xml; charset=utf-8` | same |
| XML well-formed, `http://www.sitemaps.org/schemas/sitemap/0.9` namespace, balanced `<url>` | PASS | PASS |
| Entries | **69** (matches RELEASE-002) | 66 |
| Every `<loc>` absolute `https://www.nova.eredox.com/…`, unique, no query/fragment | PASS | PASS |
| Limits (≤ 50,000 URLs, ≤ 50 MiB) | PASS (69 URLs) | PASS |
| Each URL: HTTP 200, no redirect, `text/html` | **69/69 PASS** | not re-crawled (bounded live mode) |
| Canonical = `<loc>`, exactly one, absolute | **69/69 PASS** | not re-crawled |
| `noindex`/`nofollow` meta or `X-Robots-Tag` on a sitemap URL | none | none observed on probes |
| In sitemap but not indexable / indexable but not in sitemap | 0 / 0 | 0 / 6 plan pages (known SEO-004) |

### 2.1 Reconciliation 73 canonical → 72 indexable (original) → 69 sitemap
| Group | URLs |
|---|---|
| Sitemap (indexable) | 69, by first path segment: `features` 11 (hub + 10), `frameworks` 9 (hub + 8), `solutions` 8, `industries` 6, `resources` 6, `plans` 6, `legal` 5, home 1, and 17 single pages (`about`, `book-demo`, `compliance-journey`, `compare`, `contact`, `customers`, `integrations`, `partners`, `platform`, `pricing`, `request-quote`, `roadmap`, `responsible-ai`, `security`, `start`, `support`, `trust`). Full list: `sitemap-url-inventory.csv` |
| Intentionally `noindex,follow`, **not** in sitemap | `/status` (no live feed connected), `/testimonials` (none exist), `/resources/product-updates` (none published), `/resources/case-studies` (none published); also `/resources/webinars` and `/book-demo/confirmed` (noindex) |
| Rule | Excluded sections join the sitemap and lose `noindex` automatically when real items are published (`sitemapUrls()` conditions; covered by tests) — they are omitted on purpose, not lost |
| Added vs the 66-entry production sitemap | +6 `/plans/{free,launch,growth,professional,business,enterprise}` (indexable, canonical, previously missing); −3 placeholder pages that were wrongly indexable |

### 2.2 `lastmod`
2 of 69 entries carry `lastmod` (the two published resources, from their `published`/`modified` fields, two distinct real dates). The other 67 deliberately carry **none**. Rationale: the sitemaps protocol treats `lastmod` as optional, and engines ignore values they find unreliable; stamping every URL with a build date would not reflect "genuine content change". There is no per-page modification record in the repository (the data files are edited in bulk, and the recent title/metadata programme touched most route files at once, so commit dates would overstate change). **Recommended follow-up, not built:** add an editor-maintained `updated` date to page data when content is materially changed, and emit it as `lastmod`; do not derive it from deploy time.

## 3. Reachability and internal links (HTML only, no JavaScript)
* **Defect found:** `/industries` and the five industry pages formed a closed cluster; the earlier orphan test (any inbound link) missed it. After adding a footer link, **69/69 sitemap URLs are reachable from `/`** by following `<a href>` only.
* Pages with a single inbound HTML link (informational): the six `/plans/*` pages, `/solutions/auditors`, `/solutions/executives`. They are linked from hubs (`/pricing`, `/solutions`). No page is an orphan.
* Note: the six plan pages are linked from `/pricing` cards that I did not modify.

## 4. 404 handling and private routes
* Unknown URL → **404** with `noindex` meta (verified), `/404`, `/index.html`, `*.map`, `/llms.txt` → 404 (they used to be soft 200s on production).
* `/.env`, `/.git/config`, `/package.json`, `/src/server.ts`, `/server/index.mjs`, `/.output/nitro.json` → 404; `/_serverFn/x` → 403; `/api/forms` → 405 (JSON); `/api/` and `/node_modules/` → 307 to the slash-less path then 404/405. **No sensitive file or private route exposed.**
* Trailing-slash URLs: app answers 307 → slash-less; the nginx vhost in the repo turns this into a 301 (validated with real nginx in RELEASE-002).

## 5. Verification files
| File | Source | Production now |
|---|---|---|
| `public/google09b732402a3c6243.html` (`google-site-verification: google09b732402a3c6243.html`) | committed 2026-09-26 | 200 `text/html` |
| `public/2695136d30af499e9ced4742ab0d9681.txt` (IndexNow key; content equals the file name) | committed 2026-09-26 | 200 `text/plain`, body equals key |
| `BingSiteAuth.xml`, Bing meta tag, DNS TXT | none in repo or in public DNS (`eredox.com` TXT shows only a Brevo code) | `/BingSiteAuth.xml` → 200 `text/html` (soft 404 today; becomes a real 404) |
Nothing was overwritten or added. Whether the Google property is currently verified, and whether Bing is verified (it can be imported from Google Search Console), cannot be seen without those accounts — **NOT VERIFIED**.

## 6. Result
| Requirement | Status |
|---|---|
| Sitemap valid, canonical-consistent, 69 × 200 | **PASS** (release candidate) |
| Coverage accurate; no placeholder / redirected / non-indexable URL included | **PASS** |
| Intentional noindex exclusions | **PASS** |
| All important pages reachable through HTML links | **PASS** after fix |
| Genuine `lastmod` | **PASS (by omission)**; editor-maintained date proposed |
| Sitemap referenced in robots.txt | **PASS** |
| Production serves all of the above | **NOT YET** — requires deployment (production is the 22 Oct build) |
