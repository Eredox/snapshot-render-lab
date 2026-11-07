# NOVA-WEB-REMEDIATE-001 — SEO, performance and journey retest

Method: the same documented audit method as NOVA-WEB-AUDIT-001 (bounded GET crawler `crawl.py`, same inventory rules) re-run against a **local production build** of the remediation branch (88 URLs crawled; sitemap URLs rewritten to the local origin so nothing on production was fetched), plus `scripts/verify-release.mjs` and Lighthouse 13.6. **This is not evidence of Google indexing, ranking or traffic changes — none can be claimed from local tests.** Real-user Core Web Vitals: UNAVAILABLE. Raw outputs: `NOVA_WEBSITE_PAGE_INVENTORY_RETEST.csv`, `inventory-comparison.txt`, `lighthouse-summary.json` (this folder).

## 1. Page inventory comparison (original audit → corrected local build)

| Metric | Original (live, 22 Oct build) | Corrected | Note |
|---|---|---|---|
| Canonical pages | 73 | **73** | none removed, none added |
| URLs crawled / inventory rows | 82 / 108 | 88 / 88 | 108 included 26 probe rows; retest probes below; 6 extra crawled URLs are `?billing=` plan links |
| HTTP status of crawled URLs | all 200 | all 200 | broken links: 0 → **0** |
| Sitemap URLs | 66 | **69** | −3 placeholders, +6 plan pages |
| Unique titles | 73 / 73 | 73 / 73 | |
| Generic "Noun — NOVA Compliance" titles (SEO-005) | 45 | **0** | |
| Titles > 60 / descriptions outside 70–160 (SEO-008) | 2 / 7 | **0 / 0** | enforced by tests and `verify-release` |
| Placeholder pages indexable and in sitemap (SEO-006) | 3 | **0** | noindex,follow; sitemap exclusion automatic |
| Indexable pages not in sitemap (SEO-004) | 6 | **0** | plan pages added |
| Orphans in sitemap (`/compare`, `/start`) | 2 | **0** (footer links) | crawler lists the 6 `/plans/*` pages as "0 links" only because `/pricing` links to them with `?billing=…`; `verify-release` (query-stripped) finds 0 orphans |
| Weakly linked (1 link) | 13 | 4 | `/partners` (now footer-linked after this crawl), `/request-quote`, `/solutions/executives`, `/solutions/auditors` |
| Homepage description = site tagline (SEO-014) | yes | no | |
| New exclusions | — | `/status`, `/testimonials`, `/resources/product-updates` (noindex + not in sitemap) | restored automatically when content exists |
| Regressions | — | none found; one pre-existing defect fixed: `/plans/*` redirected (307) to `?billing=monthly` on `main` | would have put 6 redirecting URLs in the sitemap |

### Probe results (original live → corrected local)
`/this-page-does-not-exist-audit` 200→**404** · `/404` 200→**404** · `/index.html` 200→**404** · `/llms.txt` 200→**404** · `/security.txt` 200→**404** · `/.well-known/security.txt` 200 (HTML)→**200 text/plain (real file)** · `/assets/*.map` 200→**404** · `/fonts/cirqua.woff2` 200 (HTML)→**404 and no longer requested** · `/resources/blog/not-a-post` 404→404 · `/api/forms` 405→405 · `/_serverFn/x` 403→403 · `/pricing/` 307→307 (app; the 301 is in the nginx vhost) · `/book-demo/confirmed` 307→**200** (clean URL) · robots.txt, sitemap.xml, verification files, favicon, OG image unchanged.

## 2. Findings from NOVA-WEB-AUDIT-001

| ID | Orig. sev | Root cause | Corrective change | Test evidence | Final technical status | Production verification still required |
|---|---|---|---|---|---|---|
| SEO-001 Soft 404s | High | splat route `$.tsx` + `404.tsx` matched every path with status 200 | routes removed; root notFound serves 404 + noindex | 8 route probes in `verify-release` (404 for unknown route, `/404`, `/index.html`, `/llms.txt`, missing font/map, unknown blog/framework slug); crawl comparison | **FIXED-LOCAL** | `curl -s -o /dev/null -w %{http_code}` on 4 unknown URLs after deploy; Search Console soft-404 report |
| SEO-002 Broken Cirqua font | Medium | licensed font file never added; preload + `@font-face` referenced it | invalid preload/`@font-face` removed (restore notes in `styles.css`); Roboto preloaded from `/fonts/roboto` | `verify-release`: preloaded font is `font/woff2`, no `cirqua`; Chrome: Roboto 400/500/700 loaded, 0 failed requests | **FIXED-LOCAL** (Cirqua itself still pending licensed file) | Real font in production |
| SEO-003 Deployment drift | Medium | releases not tied to repo | RC prepared (see Release readiness) | build artefact fingerprint | **OPEN** (deploy not authorised) | Compare live to RC |
| SEO-004 Orphans/weak links/plans | Low–Med | no inbound links; plan pages indexable but absent from sitemap | footer links; plans in sitemap | verify-release orphan check; sitemap invariants test | **FIXED-LOCAL** | — |
| SEO-005 Generic titles | Medium | template `<name> — NOVA Compliance` | intent-led titles for all 73 pages | `seo-metadata.test.ts` + `verify-release` (20–60 chars, unique, `|` suffix) | **FIXED-LOCAL** | Search Console CTR over 4–8 weeks (not claimable locally) |
| SEO-006 Placeholder pages | Medium | empty sections indexable | conditional noindex + sitemap exclusion | `verify-release` (noindex + not in sitemap, 5 sections); tests | **FIXED-LOCAL** | — |
| SEO-007 Topical authority | Medium | thin content programme | `/platform` GRC / automation section; editorial backlog | text present in render; backlog doc | **PARTIAL** (new articles are a separate editorial project by design) | — |
| SEO-008 Length issues | Low | — | see SEO-005 | tests | **FIXED-LOCAL** | — |
| SEO-009 sitemap `lastmod` | Low | not implemented | — | — | **OPEN** | — |
| SEO-010 Long `?framework=` links | Low | — | — | canonicals already correct | **OPEN** | — |
| SEO-011 Trailing slash 307 | Low | router default | nginx vhost `rewrite … permanent` (301) | app still 307 locally; vhost not validated with `nginx -t` | **PARTIAL (edge file only)** | `curl -I https://…/pricing/` → 301 |
| SEO-012 Schema polish | Low | — | — | — | **OPEN** | — |
| SEO-013 `en-AU`, per-page OG | Low | — | — | — | **OPEN** | — |
| SEO-014 Homepage title/description | Low | tagline reuse | new title/description; H1 unchanged by design (brand line) | tests | **FIXED-LOCAL** | — |
| SEO-015 Homepage weight / caching | Medium | 1.3–1.6 MB PNGs, 1 MB logos, no cache headers | AVIF/WebP, 320 px logos, 30-day cache headers | see §3 | **FIXED-LOCAL** | Re-measure on production behind nginx |
| SEO-016 Google Fonts | Low | third-party stylesheet | self-hosted Roboto; CSP forbids third parties | verify-release same-origin check | **FIXED-LOCAL** | Legal owner updates cookie-policy text (still says Google Fonts) |
| SEO-017 Target size | Low–Med | — | none (needs manual WCAG 2.5.8 review) | — | **OPEN** | Manual a11y review |

## 3. Performance and rendering (lab only)

**Lighthouse 13.6 (simulated mobile / desktop preset).** "Live" = production as it stands (22 Oct build) measured from the audit host; "Local" = corrected build served on loopback behind `lab-gzip-proxy.mjs` (emulates nginx gzip). Different networks, so use the byte columns and category scores as the like-for-like signal; absolute milliseconds are indicative.

| Page / form factor | Perf | A11y | Best-prac. | SEO | FCP ms | LCP ms | TBT ms | CLS | Transfer KB |
|---|---|---|---|---|---|---|---|---|---|
| Home mobile — live | 63 | 100 | 100 | 100 | 2663 | 2663 | 1534 | 0.027 | **2207** |
| Home mobile — local | 72–75 | 100 | 100 | 100 | 959–987 | 959–987 | 1244–1750 | 0 | **576** |
| Home desktop — live | 69 | 100 | 100 | 100 | 1419 | 1419 | 394 | 0.028 | **4012** |
| Home desktop — local | 85 | 100 | 100 | 100 | 296 | 296 | 333 | 0.027 | **507** |
| Pricing mobile — live | 95 | 100 | 100 | 100 | 2385 | 2385 | 5 | 0 | 368 |
| Pricing mobile — local | 100 | 100 | 100 | 100 | 952 | 952 | 22 | 0 | 344 |
| ISO 27001 mobile — live | 95 | 100 | 100 | 100 | 2329 | 2329 | 12 | 0.027 | 378 |
| ISO 27001 mobile — local | 87–88 | 100 | 100 | 100 | 938–963 | **3795–3834** | 77–140 | 0–0.027 | 354 |

Lighthouse audits that failed on live and no longer fail locally: `valid-source-maps` (soft-404 `.map` responses) and `label-content-name-mismatch` (WCAG 2.5.3 on the logo and audience cards).

**Homepage transfer (headless Chrome, gzip proxy, same method as the original lab):** mobile 1607 → **383 KB**, desktop 2360 → **477 KB**; image bytes on the desktop homepage ≈ 2.0 MB → **160 KB**. Platform page desktop 365 KB (was dominated by a third 1.27 MB PNG). JavaScript is unchanged in order of magnitude (≈ 210–221 KB gzip per page, mostly React/router/hydration). Fonts: 66 KB, all same-origin, `font-display: swap`.

**Known remaining lab issue (not fixed):** on the ISO 27001 page the lab LCP element is the **cookie-consent banner paragraph**, which paints only after hydration (first-visit banner), pushing lab LCP to ≈ 3.8 s even though FCP is 0.94 s. Returning visitors with a stored choice do not see it; the page's own content paints early. Options for a follow-up (design/legal review needed): render the banner after the LCP window, or make its text smaller than the hero copy. Other open items: render-blocking CSS (~120–250 ms potential), ~51 KiB unused JavaScript, homepage main-thread work (TBT 1.2–1.7 s simulated mobile) — hydration cost of a 600 KB-raw shared chunk; route-level code splitting is the lever.

**Mobile and layout:** no horizontal overflow at 390 px on 11 pages; CLS ≈ 0.03 (< 0.1) throughout. Tablet width and mobile-menu interaction are not covered by the scripted checks (NOT TESTED).

**Accessibility regression checks:** Lighthouse accessibility 100 on all runs; label-in-name fixed; the earlier DOM checks (contrast 0/932, focus indicators, reduced motion) were not repeated beyond what Lighthouse covers. Manual WCAG 2.2 AA testing remains required.

## 4. Pricing, subscription and journey checks (local; no payments, no Stripe objects created)
- `main` source is what the corrected site is built from; relative to live it contains the updated plan cards, USD pricing text, plan-specific CTAs and the `plan`+`billing_cycle` hand-off (see Implementation §1).
- `verify-release` crawled all 69 sitemap pages: **7 external URLs, all on nova.eredox.com**; registration links are `https://nova.eredox.com/register` and `…/register?plan=<free|launch|growth|professional|business>&billing_cycle=monthly` — only governed plan slugs and billing interval, never prices or personal data; Enterprise stays on `/request-quote?plan=enterprise`; footer links to Terms, Privacy and Cookie policy resolve (200).
- `signup-journey.test.ts`, `pricing.test.ts`, `canonical-plan-manifest.test.ts` pass (no free-trial wording; links from one builder).
- Defect found and fixed: `/start` (Free access) would have told visitors Free includes "One active framework" (stale fallback) while the 2026-10-26 manifest gives all available frameworks.
- **Cannot be validated here (needs an approved TEST environment):** that the NOVA application at `/register` honours `plan` and `billing_cycle`; the Odoo/Stripe commercial authority path; that the live backend manifest is 2026-10-26 (the website now claims "all available frameworks" for every plan); the annual billing toggle end-to-end. No Stripe price, product, or checkout service was created or changed.
