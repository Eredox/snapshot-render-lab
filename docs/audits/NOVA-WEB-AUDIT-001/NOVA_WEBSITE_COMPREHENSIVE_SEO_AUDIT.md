# NOVA-WEB-AUDIT-001 — Report A: Comprehensive SEO, Content, Performance and Accessibility Audit

**Client:** Eredox Pty Ltd · **Product:** NOVA Compliance · **Site:** https://www.nova.eredox.com
**Audit date:** 2026-11-07 (observations taken 08:55–09:35 UTC) · **Mode:** read-only, non-destructive, public same-origin GET/HEAD only
**Companion reports:** B (security), C (page inventory CSV), D (remediation register), E (executive summary)
**Status labels used:** CONFIRMED · LIKELY · NOT VERIFIED · NOT TESTED · NOT APPLICABLE. "Measured" = observed directly; "Inferred" = reasoned from observations; "Unavailable" = needs access we do not have.

---

## 1. Executive summary

* **The earlier "five-page, ~80%" result is not representative.** The public site has **73 distinct canonical pages** (72 indexable + 1 deliberately `noindex`), 66 of them in the XML sitemap. We evaluated all 73, plus 9 parameter variants and ~25 non-page/probe URLs (Report C: 108 rows). **No internal link is broken** (0 non-200 among 82 crawled URLs).
* **Our independent, transparent score is 73 / 100** (method in §10), with strong fundamentals (clean canonicals, valid sitemap, server-rendered HTML, one H1 per page, complete OG/Twitter tags, valid JSON-LD, good accessibility basics) and weaknesses in **soft-404 handling, keyword-light titles, thin placeholder pages, topical depth, homepage image weight, and release/deployment drift**. The previous ~80% cannot be reproduced (tool, weighting and page set are unknown); it is **plausible as a sampled "on-page hygiene" score but not a measure of whole-site SEO health**.
* **Search-index reality is UNAVAILABLE.** A Google Search Console verification file exists on the site, but we had no Search Console / Bing data. Index coverage, impressions, rankings and traffic are **NOT VERIFIED** and nothing in this report asserts them.
* **Deployment drift (CONFIRMED):** production is a build from ~22 Oct 2026 (assets `Last-Modified: Thu, 22 Oct 2026 09:09 GMT`; copy still says "Start Free"), **not** `origin/main` (merge of PR #17, 2 Nov 2026, which says "Create Free Workspace"). Findings are therefore stated for the *deployed* site, with source references taken from `origin/main` where unchanged.

### Top SEO findings (ranked)

| # | ID | Finding | Sev | Status |
|---|----|---------|-----|--------|
| 1 | SEO-001 | **Soft 404s**: unknown URLs, `/404`, `/index.html`, `/llms.txt`, `/security.txt`, `*.map` and missing assets return **HTTP 200** (noindex meta mitigates indexing, not crawl waste/Search Console "soft 404") | High | CONFIRMED |
| 2 | SEO-005 | **~45 pages use generic "Noun — NOVA Compliance" titles** with no category/intent terms (e.g. `SOC 2 — NOVA Compliance`, `Features — NOVA Compliance`) | Medium | CONFIRMED |
| 3 | SEO-007 | **Thin topical authority**: 1 blog post, 1 guide; "GRC" appears on 2 pages; "compliance automation" on 0; no intent-led landing pages | Medium | CONFIRMED (content) / inferred (impact) |
| 4 | SEO-006 | **Placeholder/empty pages are indexable and in the sitemap** (`/testimonials`, `/status`, `/resources/product-updates`; `/customers` is illustrative) while equivalent empty sections (`/resources/webinars`, `/resources/case-studies`) are correctly `noindex` | Medium | CONFIRMED |
| 5 | SEO-015 | **Homepage weight**: two un-optimised PNG diagrams (1.29 MB + 1.64 MB, 1672 px) → 1.6 MB mobile / 2.4 MB desktop transfer vs ~0.33 MB on other pages; no `Cache-Control` on images | Medium | CONFIRMED |
| 6 | SEO-002 | **Broken brand font**: `/fonts/cirqua.woff2` returns an HTML 200 page; file absent from repo; preloaded and `@font-face`d on every page (display font silently falls back to Roboto) | Medium | CONFIRMED |
| 7 | SEO-003 | **Release/deployment drift** (live ≈ 22 Oct build vs main 2 Nov; repo edge config ≠ live) | Medium | CONFIRMED |
| 8 | SEO-004 | 2 orphans (`/compare`, `/start`), 7 pages with a single internal link, 6 indexable `/plans/*` pages outside the sitemap | Low–Med | CONFIRMED |
| 9 | SEO-008/014 | Title/description length and quality issues (2 titles >60, 7 descriptions outside 70–160, homepage description = generic tagline) | Low | CONFIRMED |
| 10 | SEO-016 | Google Fonts third-party stylesheet is render-blocking and discloses visitor IPs to Google (privacy policy does mention it; self-hosting is cleaner) | Low | CONFIRMED |

### What is genuinely good (CONFIRMED)

HTTPS-only with single-hop 301; every page has a self-referencing absolute canonical; sitemap is valid, absolute, https/www-consistent; robots.txt is clean and sitemap-referenced; pages are server-rendered (content visible without JavaScript); one `<h1>` on every page; all 72 indexable pages have unique titles and descriptions; OG + Twitter tags on every page; 100 % of images have `alt`; BreadcrumbList on all inner pages; no cookies set; `lang="en"`; no horizontal overflow at 390 px; no contrast failures in 932 sampled text nodes; focus indicators present; `prefers-reduced-motion` honoured. Copy is unusually disciplined about **not** claiming certification ("It does not issue certifications or guarantee compliance outcomes").

---

## 2. Audit environment, source and deployment

| Item | Observation |
|---|---|
| Source repository | `https://github.com/Eredox/snapshot-render-lab` (remote `origin`; **CONFIRMED** it builds this site: TanStack Start + Nitro `node-server`, Dockerfile, `DEPLOYMENT.md` names `www.nova.eredox.com`, `ops/nginx/www.nova.eredox.com.conf`) |
| Local checkouts found | 7 under `C:\Eredox\Projects\snapshot-render-lab*`. The primary checkout is on branch `codex/snapshot-render-lab-env-protection` @ `01db67a` (clean) — **3 commits ahead of, and missing PRs #16/#17 from,** `origin/main`. We did not switch branches, fetch or modify it. |
| Source reviewed | `origin/main` @ `c01d8f6` (merge of PR #17, 2026-11-02), exported read-only with `git archive` to a scratch directory. Delta vs the deployed build (`69543cb`, 2026-10-22) is 23 files, mostly pricing/CTA copy (`Start Free`→`Create Free Workspace`), plan pages and tests. |
| Deployed build | **LIKELY `69543cb`** (assets built 22 Oct 2026 09:09 GMT = 19:09 AEST, 18 min after that commit). **CONFIRMED not `c01d8f6`**: live HTML contains `Start Free` (0× `Create Free Workspace`) and the pre-PR #17 `/contact` pricing disclaimer. Deployment records/CI logs were **NOT accessible**. |
| Frontend / build | React 19, TanStack Start 1.168.32 / Router 1.170.18, Vite 8.1.5, Tailwind 4, Bun lockfile, Nitro `node-server` preset; multi-stage Docker (`oven/bun:1` → `node:24-bookworm-slim`, non-root) |
| Hosting | nginx/1.27.5 edge → Node app. TLS terminates at edge (per `DEPLOYMENT.md`). Edge config on the server was **not readable**; only the repo copy was reviewed. |
| Existing tests | `src/lib/__tests__/` (launch-invariants, image-accessibility, nova-ai-copy, signup-journey …), CI workflow `website-ci.yml` (lint, typecheck, test, build). **NOT TESTED** here (running them requires installing/altering the working tree). |
| Tools used | Python 3.12 stdlib crawler (GET, 0.45 s delay, descriptive UA); curl; Node 24 + system Chrome 156 headless via DevTools protocol (synthetic lab — **not Lighthouse**, which is not installed); osv-scanner 2.4.0; gitleaks 8.30.1; openssl. |
| Vantage point | One Windows host behind **Avast Web/Mail Shield TLS inspection** (see Report B §2): response headers/bodies were observed through it; origin TLS certificate/ciphers are therefore **NOT VERIFIED**. |

---

## 3. Scope and page coverage

| Metric | Count |
|---|---|
| URLs discovered (sitemap 66 + link-discovered 16) | **82** crawled, all HTTP 200, all HTML |
| Distinct canonical pages | **73** (72 indexable, 1 `noindex,follow`: `/resources/case-studies`) |
| Parameter variants (`/book-demo?framework=…` ×8, `/request-quote?plan=enterprise`) | 9 — all canonicalise correctly |
| Evaluated in full (HTML parsed, metadata, links, JSON-LD) | **82 / 82** |
| Excluded by policy | Authenticated/application areas and other Eredox services: `https://nova.eredox.com` (+`/register…`), `crm.`/`ai.` subdomains — linked from every page, **not crawled** |
| Inaccessible | **0** |
| Extra probes (non-crawl) | robots, sitemap, favicon, OG image, verification files, http→https, trailing-slash, case variant, unknown paths, `/404`, `/index.html`, `/security.txt`, `/llms.txt`, `.map`, `/api/forms` (GET/OPTIONS only), `/_serverFn/…` (benign GET), `/resources/webinars`, `/book-demo/confirmed` |
| Source-defined routes not in public navigation | `/resources/webinars` (+`$slug`), `/resources/case-studies/$slug`, `/resources/product-updates/$slug`, `/book-demo/confirmed`, `/404`, splat `$` — no published items exist for the dynamic ones |
| Broken internal links | **0** |
| Orphaned pages (0 internal links) | `/compare`, `/start` (both in sitemap) |
| Weakly linked (1 internal link) | `/customers`, `/testimonials`, `/partners`, `/request-quote`, `/solutions/executives`, `/solutions/auditors`, `/resources/product-updates` |
| Duplicate routes | `/Pricing`≡`/pricing` (200, canonical → `/pricing`); `/pricing/`→307→`/pricing`; `/book-demo?framework=*`→canonical `/book-demo` |
| Crawl method | Respected robots.txt (`User-agent: *  Allow: /`); ≤ ~2 req/s; no forms submitted; no state-changing requests |

Full per-URL data: **Report C** (`NOVA_WEBSITE_PAGE_INVENTORY.csv`).

---

## 4. Technical SEO assessment

### 4.1 Crawling and indexing

| Check | Result | Status |
|---|---|---|
| robots.txt | 200, text/plain; allows Googlebot/Bingbot/social/AI-search bots; `Disallow: /` for `CCBot` only; `Sitemap:` present | CONFIRMED |
| XML sitemap | 200, valid `urlset`, 66 absolute `https://www…` URLs, all 200 and equal to their canonicals; no `<lastmod>` on 64 static URLs (only blog/guide have it) | CONFIRMED (SEO-009) |
| Sitemap coverage | 66/72 indexable pages. Missing: 6 `/plans/*` pages (code deliberately excludes the prefix, yet pages are indexable and linked from `/pricing`) | CONFIRMED (SEO-004) |
| noindex / nofollow | Only intended: `/resources/case-studies`, `/resources/webinars` (`noindex,follow`), `/book-demo/confirmed`, 404 pages. No accidental noindex found. | CONFIRMED |
| HTTP/HTTPS | `http://www…` → 301 → https (single hop, path+query preserved) | CONFIRMED |
| www / non-www | `https://nova.eredox.com/` is a *different* service (the NOVA application, with `X-Robots-Tag: noindex`); not part of this audit. No www/apex duplicate-content risk observed. | CONFIRMED (limited — see Report B §2 note) |
| Trailing slash | `/pricing/` → **307** (temporary) → `/pricing` | CONFIRMED (SEO-011, Low) |
| Case sensitivity | `/Pricing` serves 200 with canonical → `/pricing` (mitigated) | CONFIRMED |
| Redirect chains/loops | None found | CONFIRMED |
| **Soft 404s** | `/this-page-does-not-exist-audit`, `/404`, `/index.html`, `/llms.txt`, `/security.txt`, `/.well-known/security.txt`, `/assets/*.map`, `/fonts/cirqua.woff2` → **200 text/html**. Only `/resources/blog/<unknown>` returns a true 404. The splat route renders "Page not found" with `<meta name="robots" content="noindex">` but status 200. | CONFIRMED (SEO-001, **High**) |
| JS-rendered content | Pages are SSR'd; titles, H1, body copy and JSON-LD are all present in the raw HTML (verified on all 82). Hydration payload adds ~20–60 KB of inline JS per page. | CONFIRMED |
| Internal links to non-indexable pages | Links to `/resources/case-studies` (noindex) exist from 2 pages — acceptable (`follow`). | CONFIRMED |
| Crawl-path hygiene | 8 `book-demo?framework=<very long encoded name>` links on framework pages generate parameter URLs; canonicalised, so harmless but avoidable (use a short slug). | CONFIRMED (Low) |
| Google/Bing index coverage | **NOT VERIFIED — no Search Console/Bing data.** `google09b7….html` and an IndexNow key file exist, indicating properties were set up. | UNAVAILABLE |

**SEO-001 recommendation:** delete `src/routes/$.tsx` and `src/routes/404.tsx` (or have them `throw notFound()` / set status 404 in the server entry) so the root `notFoundComponent` is returned with HTTP 404; return a real 404 for non-route static-looking paths (`.map`, `.woff2`, `.txt`). Retest: `curl -s -o /dev/null -w "%{http_code}" https://www.nova.eredox.com/zz-test` → `404`.

### 4.2 Hosting-layer observations that affect SEO

* Compression: gzip on HTML/JS/CSS (`Content-Encoding: gzip`). Brotli not observed. (Low)
* Caching: `/assets/*` → `public, max-age=31536000, immutable` ✔. **HTML, `/media/*`, `/og/*`, favicon → no `Cache-Control`** (ETag only). (SEO-015)
* Server response time (TTFB, headless Chrome, uncached): **174–359 ms** across 7 page types ✔.
* `nginx/1.27.5` version in `Server` header (informational; Report B).

---

## 5. Metadata (every indexable page evaluated — details in Report C)

| Check | Result |
|---|---|
| Title present / unique | 72/72 present, **72/72 unique** |
| Title length | 70 of 72 within ≤60 chars; **over 60:** `/pricing` (63), `/frameworks/hipaa` (65) |
| Title quality | **~45 pages** use `<Noun> — NOVA Compliance`; separator style mixes `—` and `|` (SEO-005/008) |
| Meta description | 72/72 present and unique. **Under 70 chars:** `/legal/terms` (58), `/features/ai-assistant` (61 — it is the site tagline, not a description). **Over 160:** 5 `/plans/*` pages (161–165). Homepage description = generic site tagline (85 chars) |
| Canonical | 72/72 absolute, https, www, self-referencing; variants canonicalise to base |
| `<html lang>` | `en` everywhere (WebSite JSON-LD says `en-AU`; consider `en-AU` on `<html>`) (Low) |
| Open Graph / Twitter | `og:title/description/type/site_name/url/image(+w/h)`, `twitter:card=summary_large_image/title/description/image/site` on all 82. **All pages share one OG image** (`/og/nova-share.jpg`, 1200×630, 61 KB). `og:type` is `article` on the blog post/guide and `website` elsewhere (correct). |
| `<meta name="author">` | present |

### Recommended replacement titles/descriptions (verify against framework availability status before publishing; wording preserves "readiness support ≠ certification")

| Page | Proposed title (≤60) | Proposed description (≤155) |
|---|---|---|
| `/` | NOVA Compliance \| Compliance Management Software with AI | Manage frameworks, controls, evidence and risk in one governed workspace. NOVA AI assists readiness work; your people make every decision. |
| `/frameworks` | Compliance Frameworks: SOC 2, ISO 27001, ISO 42001 \| NOVA | See which frameworks NOVA supports — SOC 2, ISO/IEC 27001, ISO/IEC 42001, Essential Eight and more — with availability and readiness views. |
| `/frameworks/soc-2` | SOC 2 Readiness Software \| NOVA Compliance | Map Trust Services Criteria to controls, collect reviewed evidence and track SOC 2 readiness. The attestation remains with your independent auditor. |
| `/frameworks/iso-27001` | ISO 27001 Compliance Software \| NOVA Compliance | Manage ISO/IEC 27001 controls, risks, policies and evidence in one workspace to prepare for audit. Certification is issued by an accredited body. |
| `/frameworks/iso-42001` | ISO 42001 AI Governance Software \| NOVA Compliance | Prepare for ISO/IEC 42001 with AI governance controls, policies and evidence. NOVA supports readiness; certification is issued by an accredited body. |
| `/frameworks/essential-eight` | Essential Eight Compliance Software \| NOVA | Assess and evidence the ACSC Essential Eight by maturity level with owned controls and reviewer-validated evidence. |
| `/frameworks/hipaa` | HIPAA Compliance Software \| NOVA Compliance | (keep current description) |
| `/frameworks/pci-dss` | PCI DSS v4.0.1 Compliance Software \| NOVA | (keep current description) |
| `/features` | Compliance Management Features \| NOVA Compliance | Frameworks, controls, evidence, policies, risk, reporting and an auditor portal — with NOVA AI as your compliance teammate. |
| `/features/evidence` | Compliance Evidence Management \| NOVA Compliance | (keep) |
| `/features/risk-management` | Compliance Risk Management Software \| NOVA | (keep) |
| `/features/ai-assistant` | NOVA AI: AI Compliance Assistant \| NOVA Compliance | NOVA AI helps interpret requirements, summarise evidence and draft policy and control text — with human approval at every decision. |
| `/pricing` | NOVA Compliance Pricing \| Free to Enterprise Plans | NOVA Compliance plans in USD, with monthly and annual billing, feature comparison and support levels. Enterprise is quoted. |
| `/compare` | NOVA vs Spreadsheets and Checklists for Compliance | (keep current description) |
| `/integrations` | Compliance Integrations and Evidence Connectors \| NOVA | (keep) |
| `/resources/faq` | Compliance Software FAQ \| NOVA Compliance | (keep) |
| `/solutions/startups-saas` | Compliance for Startups and SaaS \| NOVA Compliance | (keep) |
| `/plans/<plan>` | keep titles | shorten each to ≤155 chars (drop the repeated "Review NOVA <plan> plan entitlements, framework scope, evidence workflow and next steps." suffix) |

---

## 6. Structured data (measured on all 82 pages; parsed as JSON — 0 invalid)

| Type | Where | Assessment |
|---|---|---|
| Organization (`@id` …/#organization, logo) | all pages | Valid. Could add `sameAs` (only profiles that genuinely exist) and `contactPoint`. |
| WebSite (`@id`, `inLanguage en-AU`, publisher) | all pages | Valid. No `SearchAction` (correct — no site search). |
| SoftwareApplication (`@id`) | `/`, `/pricing` | Valid; deliberately has **no `offers`, `aggregateRating` or `review`** — correct, nothing invented. (Not eligible for the software-app rich result without those; do not add unsupported ratings.) |
| BreadcrumbList | all inner pages | Valid; positions and absolute URLs correct. |
| FAQPage | `/pricing` (6 Q), `/resources/faq` (~20 Q) | Valid and matches visible content. Per Google's published guidance, FAQ rich results are limited to well-known government/health sites, so **expect no rich-result benefit**; harmless, keep for machine readability. *(Based on Google documentation as known to the auditor; re-check current guidance.)* |
| BlogPosting | blog post, guide | Valid. Missing `image` and `author` as a Person/with `@id`; `publisher` is an un-linked Organization node (should reference `…/#organization`). (Low) |
| Product / Offer / Review / Rating | none | Correctly absent (a Product snippet schema was previously removed in commit `6de1883`). |

---

## 7. Content and keyword assessment (inferred — not rank data)

**Positioning.** The homepage communicates purpose well to a human ("compliance management, evidence, controls and human decisions together in one governed workspace for growing and regulated organisations") and is honest about demo data and human authority. For search, however, the H1 ("Build Trust. Prove Compliance. Move Forward.") and `<title>` carry little category language; "compliance management" appears in a supporting sentence only.

**Keyword presence across the 73 pages (term-frequency scan of rendered text):**

| Target topic | Occurrences / pages | Reading |
|---|---|---|
| compliance management | 75 / 73 | Present everywhere (mostly boilerplate) |
| SOC 2 | 55 / 26 | Strong; dedicated page ~1,527 words |
| ISO/IEC 27001 (+"ISO 27001") | 60 / ~25 | Strong; dedicated page ~1,552 words |
| ISO/IEC 42001 | 31 / 14 | Dedicated page ~1,414 words |
| Essential Eight | 42 / 21 | Dedicated page ~1,519 words |
| AI governance | 14 / 7 | Present on platform, responsible-AI, iso-42001, homepage |
| **GRC** | **2 / 2** | **Underused** (platform title, one blog page) |
| **compliance automation / security compliance automation** | **0** | **Absent** (the page text uses "evidence workflow", "automat*" in other senses) |
| risk management | `/features/risk-management` | Single feature page |
| policy and evidence management | `/features/policies`, `/features/evidence` | Dedicated feature pages (~500–590 words) |
| multi-framework | `/platform`, `/solutions/technology-smes`, blog | Covered, not a landing page |

**Assessment**
* **Primary targeting:** one page per framework and per feature is a sound information architecture. GDPR/PCI DSS/HIPAA/CMMC pages are ~800 words (adequate but shallower than the "big four" at ~1,500).
* **Cannibalisation:** low. Industry (≈360 words) and solution (≈700 words) pages follow a shared template; the `/plans/*` pages (≈460 words each) are near-duplicates of each other and of `/pricing` — decide index (add to sitemap, differentiate) or canonical to `/pricing`.
* **Thin / placeholder content:** `/testimonials` (73 unique words), `/status` (78), `/resources/product-updates` (62), `/support` (60 + form) and illustrative `/customers` (166). `/status` is honest ("A live monitoring feed is not currently connected") but a status page with no status is a crawl/UX liability.
* **Topical authority:** 1 blog post (5 Aug 2026) and 1 guide; no comparison/"how-to" content; no content freshness signals other than those two dates. This is the largest organic-growth gap.
* **Trust signals:** exemplary candour on certifications and AI authority (`/trust`, `/security`, `/responsible-ai`). No fabricated testimonials, ratings, logos or awards were found. One item to review: `/customers` illustrates "halving the evidence duplication" — a specific quantified outcome inside an "illustrative" scenario; remove or soften to avoid an implied performance claim. `/security` makes unevidenced infrastructure statements ("network segmentation", "hardened defaults") that Eredox should be able to substantiate on request.
* **Calls to action:** consistent (Book a demo / Start Free / plan CTAs). Conversion pathways are clear; `/start` (the free-access entry) is an orphan with no internal links.
* **Readability/heading structure:** 1 H1 per page ✔; no heading-level skips found on the 7 sampled pages; copy is plain-English.

**Content recommendations (no keyword stuffing; preserve readiness-vs-certification language)**
1. Rewrite homepage H1/sub-head/description to include the category ("compliance management software"/"GRC") while keeping the brand line as the eyebrow.
2. Publish 6–8 intent-led, evidence-based articles/guides: *What is a GRC platform (and do growing teams need one)*, *SOC 2 readiness checklist*, *ISO 27001 vs SOC 2*, *Essential Eight maturity levels explained (Australia)*, *ISO/IEC 42001: AI governance in practice*, *Reusing evidence across frameworks*, *What "audit-ready" does and does not mean*.
3. Add a "compliance automation" explainer that is explicit about human review (matches NOVA's stance).
4. Give `/plans/*` unique value or canonicalise; add them to `/pricing` internal links and the sitemap if kept.
5. Interlink: framework ↔ feature ↔ solution pages (currently the 4 non-flagship frameworks have 3 inbound links each).
6. Add `lastmod` to the sitemap and visible "last reviewed" dates on framework pages (freshness signal).

---

## 8. Mobile and performance results

> **Synthetic lab data, not real-user data.** Headless Chrome 156 on the auditor's Windows host via DevTools protocol, cache disabled, median of 3 runs, 7 page types. Mobile profile = 390×844 @2×, 4× CPU slowdown, 1.6 Mbps/150 ms RTT (Lighthouse-mobile-like, **not** an official Lighthouse run). Desktop = 1350×940, 10 Mbps/40 ms. **Real-user Core Web Vitals (CrUX/RUM, incl. INP) are UNAVAILABLE.**

| Page | Profile | TTFB ms | FCP ms | LCP ms | CLS | TBT ms | Requests | Transfer KB |
|---|---|---|---|---|---|---|---|---|
| `/` | mobile | 343 | 4228 | 4228 | 0.026 | 8508 | 24 | **1607** |
| `/` | desktop | 359 | 1092 | 1092 | 0.028 | 3700 | 28 | **2360** |
| `/pricing` | mobile | 226 | 2128 | 2128 | 0.026 | 275 | 22 | 327 |
| `/frameworks/iso-27001` | mobile | 208 | 2312 | 4344 | 0.026 | 1436 | 24 | 338 |
| `/resources/faq` | mobile | 183 | 1884 | 3888 | 0.026 | 508 | 22 | 326 |
| `/contact` | mobile | 193 | 2356 | 2356 | 0.026 | 1685 | 23 | 323 |
| `/book-demo` | mobile | 185 | 1804 | 1804 | 0.026 | 1541 | 22 | 323 |
| `/features/evidence` | mobile | 179 | 2728 | 2728 | 0.026 | 333 | 23 | 324 |
| Inner pages | desktop | 174–208 | 740–916 | 740–916 | ≤0.028 | 0–94 | 22–24 | 323–338 |

Interpretation
* **TTFB, CLS and desktop LCP are good** (TTFB < 360 ms; CLS ≈ 0.03 vs 0.1 threshold; desktop FCP/LCP < 1.1 s on inner pages).
* **Mobile (throttled) LCP is 1.8–4.3 s** — borderline vs the 2.5 s "good" threshold on several page types. The LCP element is text (`<h1>`/`<p>`), so improving render-blocking resources (Google Fonts CSS, 104 KB/21 KB-gzip app CSS, 248 KB-gzip JS) matters more than images on inner pages.
* **Homepage is the outlier** (3× transfer, TBT 3.7–8.5 s under throttling). Cause: two PNG diagrams (`nova-ai-governance-human-review-workflow.png` 1.29 MB, `nova-evidence-automation-human-review-workflow.png` 1.64 MB, natural width 1672 px, displayed far smaller, no `srcset`, no AVIF/WebP) plus four WebP team photos of 133–225 KB each. Expected benefit of converting PNGs to AVIF/WebP at ≤1000 px with `srcset`: **−2.5 to −2.8 MB** on desktop home (~85–90 % of image bytes) — measured sizes, projected savings.
* **JavaScript:** 83 build assets, 1.07 MB raw / 373 KB gzip across all routes; shared `index-*.js` 608 KB raw / 211 KB gzip (React, router, hydration). Per page ≈ 248–260 KB gzip JS. No unused-code coverage was measured (NOT TESTED).
* **Fonts:** `fonts.googleapis.com` CSS (render-blocking third-party) + broken `/fonts/cirqua.woff2` (SEO-002). Roboto is served via Google; self-hosting removes a third-party round trip and the IP disclosure.
* **Caching/CDN:** immutable assets ✔; HTML/media/OG/favicon have no `Cache-Control`; **no CDN** observed (single nginx origin — acceptable at current scale; AU-centric origin latency to overseas users is NOT TESTED).
* **Lazy loading:** below-the-fold images use `loading="lazy"` ✔; hero shield is eager ✔; images carry `width`/`height` ✔ (CLS-safe).
* **Mobile rendering:** `viewport` meta correct; scrollWidth = 390 (no horizontal overflow) on all 7 sampled pages at 390 px. **Tablet (768 px) and mobile-menu interaction: NOT TESTED** in this run.
* Lighthouse scores, INP, unused-JS/CSS percentages and per-resource render-blocking audits: **NOT TESTED** (tool unavailable offline; installing it would have been an unapproved download).

---

## 9. Accessibility observations (reference: WCAG 2.2 AA — automated/semi-automated only)

> No claim of conformance is made. Automated checks find roughly a third of issues; manual keyboard, screen-reader (NVDA/VoiceOver) and zoom/reflow testing remain **NOT TESTED**.

| Check (5–7 representative pages, desktop 1350 px unless stated) | Result |
|---|---|
| `<html lang>`, `<main>`, skip link | present on all |
| Heading structure | 1 × H1 each; 0 level skips |
| Image alt | 0 of 180 `<img>` elements (all 82 crawled pages) lack an `alt` attribute; informative alt text is descriptive |
| Form labels (`/contact`, `/book-demo`) | 0 unlabelled inputs |
| Links/buttons without accessible name | 0 |
| Colour contrast (computed, text nodes with solid backgrounds) | **0 failures / 932 nodes** across `/`, `/pricing`, `/contact`, `/frameworks/iso-27001`, `/book-demo`; 0 inconclusive. Hover/focus/disabled states and image/gradient backgrounds not assessed. |
| Visible keyboard focus (first 25 focusable elements/page) | 0 elements without an indicator |
| Reduced motion | CSS `prefers-reduced-motion` present; running animations drop to 0 when emulated (home: 10→0) |
| Touch/pointer target size (WCAG 2.2 SC 2.5.8, 24×24 px) | **LIKELY issue:** 25–34 interactive elements per page are < 24 px in at least one dimension (footer links e.g. "Cookie Policy" 83×17 px, breadcrumb "Home" 38×17). Many may satisfy the spacing/inline exceptions — needs manual review. (SEO-017, Low–Med) |
| Mobile (390 px) horizontal overflow | none |
| Accessible errors on forms, mobile-menu keyboard operation, focus order/trap, zoom to 400 %, screen-reader semantics | **NOT TESTED** |
| Accessibility statement | `/legal/accessibility` exists (indexable) |

---

## 10. Overall score and methodology

**Method.** Nine categories, weights chosen to reflect search-readiness for a B2B SaaS marketing site. Each category's points are the sum of sub-checks scored 0–full from the evidence above. *Measured* = direct observation; *Inferred* = judgement from observed content; *Unavailable* = would require Search Console/analytics. The security rating is **kept separate** (Report B) and is not blended into this score.

| Category | Weight | Score | % | Basis | Sub-check arithmetic |
|---|---|---|---|---|---|
| Technical SEO | 15 | **11.5** | 77 | Measured | HTTPS/redirects 2/2 · canonicals 3/3 · no broken links/errors 2/2 · redirect quality 0.5/1 · host canonicalisation 1/1 · compression+caching 1/2 · SSR/rendering 2/2 · font/assets 0/1 · deploy parity 0/1 |
| Crawl / index readiness | 15 | **10.7** | 71 | Measured (index state Unavailable) | robots 2/2 · sitemap validity 4/4 · coverage 66/72 → 3.7/4 · soft-404 handling 0/3 · empty-section consistency 1/2 |
| On-page metadata | 15 | **12.6** | 84 | Measured | titles present/unique 3/3 · descriptions 3/3 · length compliance 2.6/3 · keyword relevance of titles 1.5/3 · OG/Twitter 2.5/3 |
| Content quality | 15 | **8.8** | 59 | Inferred | positioning clarity 3/4 · framework depth 2.5/4 · topical authority 0.5/3 · thin/placeholder pages 1/2 · trust/claims discipline 1.8/2 |
| Internal linking | 8 | **6.0** | 75 | Measured | global nav/footer 3/3 · contextual depth 2/3 · orphans/weak links 1/2 |
| Structured data | 7 | **5.5** | 79 | Measured | valid JSON-LD 2/2 · entity set 2/2 · software/FAQ eligibility 1.5/2 · article completeness 0/1 (sub-scores scaled to 7) |
| Mobile usability | 7 | **5.0** | 71 | Measured (partial) | viewport/overflow ✔; tablet + menu interaction not tested; tap-target concerns |
| Performance | 10 | **6.0** | 60 | Measured (synthetic only) | TTFB/CLS good; mobile LCP borderline; homepage weight; no image optimisation; font failure |
| Accessibility | 8 | **6.5** | 81 | Measured (automated) | capped below full: no manual/AT testing; target-size LIKELY issues |
| **Total** | **100** | **72.6 ≈ 73** | | | |

**Is the earlier ~80% credible?** *Plausible but unverifiable and not comparable.* A five-page, on-page-hygiene scan of well-built pages could reasonably score ~80 %; our whole-site, nine-category result is 73. We do **not** reproduce 80 %, because neither the tool, the weighting nor the page set is known. The difference is explained mainly by site-wide items a five-page scan would not weigh (soft 404s, thin/placeholder pages, topical depth, deployment drift).

---

## 11. Priority recommendations and expected business impact

| Priority | Action | Expected benefit (qualitative unless stated) |
|---|---|---|
| P1 | Return real HTTP 404 for unknown URLs and static-looking paths (SEO-001) | Removes soft-404 reports and crawl waste; prevents scanners misreading `/security.txt`, `*.map` as present (also helps security reporting accuracy) |
| P1 | Redeploy from current `main` and reconcile edge config in repo vs live (SEO-003/SEC-001) | Live copy matches approved pricing/CTA language; restores CSP the repo already defines |
| P1 | Rewrite titles/descriptions for ~20 priority pages (SEO-005/008/014) | Better SERP relevance/CTR for category and framework queries (magnitude NOT measurable without GSC baseline) |
| P2 | Optimise homepage images (PNG→AVIF/WebP, `srcset`, ≤1000 px) and add `Cache-Control` for `/media`, `/og`, favicon (SEO-015) | −2.5–2.8 MB home transfer (projected from measured sizes); faster mobile LCP/TBT |
| P2 | Fix or remove the Cirqua font (SEO-002); self-host Roboto (SEO-016) | Removes a wasted request on every page and one render-blocking third-party; correct brand typography |
| P2 | `noindex` + drop from sitemap: `/testimonials`, `/status`, `/resources/product-updates` until populated; decide on `/plans/*` (SEO-004/006) | Cleaner index; focus crawl budget on 60+ substantive pages |
| P2 | Link `/compare` and `/start`; strengthen links to 1-link pages (SEO-004) | Equity distribution; discoverability |
| P3 | Publish intent-led content programme (§7) with `lastmod` (SEO-007/009) | Largest long-term organic upside; needs Search Console baseline to quantify |
| P3 | Permanent (308/301) trailing-slash redirect; sitemap `lastmod`; `en-AU`; schema polish (SEO-009/011/012) | Hygiene |
| P3 | Manual WCAG 2.2 AA audit incl. target size (SEO-017) | Conformance evidence for `/legal/accessibility` claims |

---

## 12. Coverage gaps and tool limitations

* No Search Console / Bing Webmaster / analytics / CrUX access → index counts, rankings, traffic, real-user CWV, INP: **UNAVAILABLE**.
* Lighthouse and axe-core not run (not installed; installing was outside approved scope). Equivalent lab metrics were gathered through headless Chrome and DOM-level checks; they are indicative, not Lighthouse-comparable.
* Performance was measured from one location/network; global/CDN behaviour NOT TESTED.
* Tablet viewport, mobile navigation interaction and screen-reader testing NOT TESTED.
* Existing repo tests were not executed.
* Source analysis used `origin/main` as exported; the production build is older (see §2).
