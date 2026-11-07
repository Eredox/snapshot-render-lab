# NOVA-WEB-AUDIT-001 — Executive Summary for the Founder / Managing Director

**Eredox Pty Ltd · NOVA Compliance · https://www.nova.eredox.com · Audit date 2026-11-07**
Read-only audit of the public website. Nothing was changed, deployed, committed or submitted. Full evidence is in Reports A–D (same folder).

## 1. How many pages were discovered and tested?
**73 distinct pages** (72 indexable, 1 deliberately hidden from search), found via the sitemap (66) and internal links. **All 73 were tested**, plus 9 URL variants and ~25 technical probes — **108 rows** in the inventory CSV. **0 broken links.** The earlier five-page check covered about 7 % of the site and is not representative.

## 2. Does the earlier ~80 % SEO result look credible?
**Plausible, but it cannot be confirmed and it is not a whole-site number.** Our transparent, whole-site score is **73 / 100** (nine weighted categories; method in Report A §10). The gap comes from things a five-page scan misses: pages returning "OK" for URLs that do not exist, thin/placeholder pages, light content depth, and an out-of-date live build. Real Google index coverage, rankings and traffic are **not verified** — we had no Search Console access.

## 3. Were the two HIGH security findings confirmed?
**No — they remain NOT VERIFIED.** We were not given the original scanner report, so we did not guess what they were. Instead we independently checked the things scanners usually flag. Result: **nothing we found is HIGH in practice.** The closest candidates are a missing security policy header (rated MEDIUM here) and an out-of-date web framework with a serious-sounding advisory that does **not** appear exploitable on this site (rated MEDIUM, fix promptly). Please send the original report so each can be closed individually.

## 4. Most significant SEO weaknesses
1. Wrong pages "exist": made-up URLs return a normal "OK" status instead of "not found" (soft 404s).
2. Page titles are generic ("SOC 2 — NOVA Compliance"), so framework and feature pages don't speak the language buyers search.
3. Very little educational content (1 article, 1 guide); "GRC" and "compliance automation" barely appear.
4. Empty pages (testimonials, status, product updates) are offered to Google as real content.
5. The home page ships ~2.4 MB (two large unoptimised diagrams); the brand display font file is missing on every page.
6. The live site is an older build than the approved code (e.g. still says "Start Free").

## 5. Most significant security weaknesses
1. **No Content-Security-Policy on the live site**, although the repository already contains one — the live server setup has drifted from the code. (MEDIUM)
2. **Framework version with a published XSS advisory** (TanStack Start). Not exploitable today because the site defines no server functions, but should be upgraded. (MEDIUM)
3. **Contact/demo form endpoint has no anti-spam or abuse controls** (rate limits, CAPTCHA, origin checks) — spam/lead-pollution and cost risk. Source-reviewed; not tested live. (MEDIUM)
4. Booking confirmation puts the visitor's name and e-mail in the web address. (LOW)
5. **TLS certificate/ciphers could not be verified** from the audit computer because Avast inspects HTTPS traffic; this needs a check from a clean network.
Good news: no cookies, no secrets or source maps exposed, HTTPS enforced, HSTS on, no CORS openness, no leaked keys in code or history, and the copy never claims certification.

## 6. What to correct immediately
* Redeploy from current `main` and make the live server configuration match the repository (brings the CSP and current pricing/CTA copy).
* Upgrade `@tanstack/react-start` to ≥ 1.168.60.
* Make unknown URLs return a true 404.
* Add rate limiting / anti-automation to `/api/forms`.
* Rewrite titles/descriptions for the ~20 highest-value pages (suggested text in Report A §5).

## 7. What can improve organic visibility
* Keyword-aware titles, headings and descriptions for framework, features, pricing and homepage.
* A focused content programme (SOC 2 readiness, ISO 27001 vs SOC 2, Essential Eight maturity, ISO 42001 AI governance, what a GRC platform is) with dates and internal links.
* Remove or `noindex` empty pages until they have real content; link orphaned pages (`/compare`, `/start`).
* Faster mobile pages: compress the home images, fix the font, self-host Roboto.
* Connect Search Console/Bing so progress can be measured — currently impossible.
(Keep the readiness-support vs certification distinction in all new copy.)

## 8. What requires additional access or testing
* **Search Console / Bing Webmaster / analytics / CrUX** — real indexing, queries, traffic and Core Web Vitals.
* **The original scanner report** for the two HIGH findings.
* **Server1 read access** (edge nginx config, deployment record, image digest) to confirm what is actually running.
* **A network without TLS inspection** (or approval for SSL Labs) for certificate and cipher checks.
* **Staging environment + approval** to test form abuse controls safely.
* Manual accessibility testing (screen reader, keyboard, 200–400 % zoom, tablet) and a Lighthouse run.

## 9. Prioritised implementation sequence
1. **Information first (no code):** send the original HIGH-finding report; grant Search Console/Bing read access.
2. **Release package NOVA-WEB-REMEDIATE-001 (~4–5 days):** dependency upgrade → real 404s + security.txt → metadata/noindex/sitemap clean-up → image and font fixes → form hardening + booking-URL fix.
3. **Deploy from `main`** and apply the edge CSP/header changes; re-run the audit retest commands (Report B §8).
4. **Verify** TLS from a clean network; re-crawl; update the remediation register.
5. **Content programme** (Report A §7) once a Search Console baseline exists.

*Scorecards: SEO 73/100 (measured + inferred; separate from security). Security: no CRITICAL/HIGH confirmed; 4 MEDIUM, 6 LOW, 3 INFO, 1 NOT VERIFIED (TLS) — Report B.*
