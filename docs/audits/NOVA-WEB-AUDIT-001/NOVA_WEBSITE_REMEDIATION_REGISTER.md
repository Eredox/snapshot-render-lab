# NOVA-WEB-AUDIT-001 — Report D: Ranked Remediation Register

Audit date 2026-11-07 · Site: https://www.nova.eredox.com · Source reference base: `origin/main` @ `c01d8f6` of `Eredox/snapshot-render-lab` (deployed build is older — see SEC-007).
Effort: **S** ≤ ½ day · **M** 1–2 days · **L** > 2 days. All items **OPEN**; nothing was changed by this audit. Priority: **P1** do first · **P2** next release · **P3** backlog.
Evidence status for every row: CONFIRMED unless stated.

## A. Ranked register (security and SEO interleaved by priority)

| Rank | ID | Class | Severity / Priority | Affected page / component | Recommended action | Source-file reference | Effort | Dependency | Verification method | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | SEC-007 / SEO-003 | SEC + SEO | MEDIUM / P1 | Production build + edge config | Redeploy from current `main` via CI; stamp image/commit SHA; reconcile live nginx with repo vhost | `DEPLOYMENT.md`, `Dockerfile`, `ops/nginx/www.nova.eredox.com.conf` | M | Server1 deploy access (not held by audit); approval to release PR #16/#17 | Live HTML shows "Create Free Workspace"; asset `Last-Modified` = new build date | OPEN |
| 2 | SEC-001 | SEC | MEDIUM / P1 | All responses (edge) | Install the repo's CSP at the edge, check console for violations, later move to nonce/hash policy | `ops/nginx/www.nova.eredox.com.conf` | S | #1 (edge deploy); browser smoke test | `curl -sI` shows `content-security-policy`; no CSP violations on 10 key pages | OPEN |
| 3 | SEC-002 | SEC | MEDIUM / P1 | `@tanstack/react-start` 1.168.32, `start-server-core` 1.169.17 | Upgrade to react-start ≥ 1.168.60 (start-server-core ≥ 1.169.39); regenerate lockfile; run lint/typecheck/test/build | `package.json`, `bun.lock` | S–M | Regression test pass; #1 for release | `osv-scanner scan source -L bun.lock` no longer lists GHSA-qx66-fv34-fjm8; site renders identically | OPEN |
| 4 | SEO-001 | SEO | High / P1 | Unknown URLs, `/404`, `/index.html`, `/llms.txt`, `/security.txt`, `*.map`, missing assets | Return HTTP 404 for unknown paths and missing static-looking files (remove `$` splat/`404` routes or set status; edge `try_files` for assets) | `src/routes/$.tsx`, `src/routes/404.tsx`, `src/routes/__root.tsx`, `src/server.ts` | S | #1 | `curl -s -o /dev/null -w %{http_code}` returns 404 for 6 probe URLs; real pages unchanged | OPEN |
| 5 | SEC-005 | SEC | MEDIUM / P1 | `/api/forms` | Rate limit (edge + app); require JSON content-type and same-origin `Origin`; add Turnstile/honeypot; dedupe; return 202 only after both CRM+e-mail or make idempotent | `src/lib/forms-server.ts`, `src/server.ts`, `ops/nginx/*.conf` | M | Choice of CAPTCHA provider; CRM contract | Staging tests: text/plain POST → 4xx; foreign Origin → 4xx; burst → 429 | OPEN |
| 6 | SEO-005 / SEO-008 / SEO-014 | SEO | Medium / P1 | ~45 generic titles; 2 titles >60; 7 descriptions out of range; homepage description | Apply the title/description table in Report A §5 to priority pages first (home, frameworks hub + 8 framework pages, features, pricing, compare, FAQ), then the rest | `src/routes/*.tsx` (`head()` via `pageMeta`), `src/lib/seo.ts`, `src/data/*.ts` | M | Product/marketing sign-off on claims (readiness ≠ certification) | Re-crawl: no `Noun — NOVA Compliance` titles on priority pages; lengths 30–60 / 70–155 | OPEN |
| 7 | SEO-015 | SEO (perf) | Medium / P2 | Homepage PNG diagrams 1.29 MB + 1.64 MB; no `Cache-Control` on `/media`, `/og`, favicon | Convert to AVIF/WebP ≤1000 px with `srcset`/`sizes`; add `Cache-Control: public, max-age=…` at edge for media | `src/routes/index.tsx`, `public/media/*`, `ops/nginx/*.conf` | S–M | Design asset sources | Re-measure `/` transfer < 700 KB; headers present | OPEN |
| 8 | SEO-002 | SEO (perf/brand) | Medium / P2 | `/fonts/cirqua.woff2` (404 as HTML 200) on every page | Add the licensed font file to `public/fonts/` **or** remove preload + `@font-face` and the `--font-display` reference | `src/routes/__root.tsx`, `src/styles.css`, `public/` | S | Font licence/asset from design | Request returns `font/woff2`; no console OTS error | OPEN |
| 9 | SEO-006 | SEO | Medium / P2 | `/testimonials`, `/status`, `/resources/product-updates` (and consider `/customers`) | Add `noindex,follow` and remove from sitemap until populated (match `/resources/webinars` handling); revisit when content exists | `src/routes/testimonials.tsx`, `status.tsx`, `resources.product-updates.index.tsx`, `src/routes/sitemap[.]xml.ts` | S | — | Meta robots present; URLs absent from sitemap | OPEN |
| 10 | SEO-004 | SEO | Low–Med / P2 | Orphans `/compare`, `/start`; 1-link pages; indexable `/plans/*` outside sitemap | Link `/compare` (nav/footer/pricing); link `/start` from pricing/CTA; decide `/plans/*`: differentiate + add to sitemap, or canonicalise to `/pricing`; add contextual links between frameworks/features/solutions | `src/config/navigation.ts`, `src/components/site/Footer.tsx`, `src/routes/plans.$slug.tsx`, `sitemap[.]xml.ts` | M | Content decision on plans pages | Crawl: 0 orphans; plan pages consistent between robots/canonical/sitemap | OPEN |
| 11 | SEC-006 | SEC (privacy) | LOW / P2 | `/book-demo` → `/book-demo/confirmed?name=…&email=…` | Stop placing PII in URLs (use router state or a booking reference) | `src/components/site/BookingForm.tsx`, `src/routes/book-demo.confirmed.tsx` | S | — | Booking on staging: confirmation URL has no name/email | OPEN |
| 12 | SEO-016 | SEO/PRIV | Low / P2 | Google Fonts CSS (render-blocking, third-party) | Self-host Roboto (woff2, `font-display: swap`), drop `fonts.googleapis.com`/`gstatic` from CSP; update privacy/cookie text | `src/routes/__root.tsx`, `src/styles.css`, `src/data/legal*.ts`, `ops/nginx/*.conf` | S | Legal text review | No third-party requests in network trace | OPEN |
| 13 | SEO-007 | SEO (content) | Medium / P3 (strategic) | Topical authority, "GRC", "compliance automation" | Content programme: 6–8 intent-led articles/guides, framework pages expanded (GDPR/PCI/HIPAA/CMMC to ≥1,200 words), comparison & checklist assets; keep readiness-vs-certification language | `src/data/resources.ts`, `src/data/framework-detail.ts` | L | Subject-matter review; editorial calendar | New URLs in sitemap, indexed (verify in GSC), tracked queries | OPEN |
| 14 | SEC-004 | SEC | LOW / P3 | Build/dev toolchain advisories (vite, vitest, launch-editor, shell-quote, brace-expansion, minimatch, js-yaml, source-map-js, nanoid, zod) | Refresh lockfile within ranges; re-scan; confirm none ship in `.output` | `package.json`, `bun.lock` | S | #3 | osv-scanner clean or accepted with rationale | OPEN |
| 15 | SEC-003 | SEC | LOW / P3 | `seroval` 1.5.6 | Verify fixed ≥ 1.6.10 after #3, else override | `bun.lock` | S | #3 | Lockfile shows seroval ≥ 1.6.10 | OPEN |
| 16 | SEC-012 | SEC | LOW / P3 | `/.well-known/security.txt` | Publish RFC 9116 `security.txt` (Contact, Expires, Policy, Preferred-Languages) | `public/.well-known/security.txt` (new) | S | Decide security mailbox | `curl` returns `text/plain` file; scanners parse it | OPEN |
| 17 | SEC-013 | SEC | LOW / P3 | Docker/CI supply chain | Pin base image digests and GitHub Actions SHAs; add `osv-scanner`/`bun audit` to CI; Dependabot; remove template remnants (`tanstack_start_ts`, `.lovable`, shim) | `Dockerfile`, `.github/workflows/website-ci.yml`, `package.json`, `.lovable/project.json` | M | — | CI shows audit step; digests pinned | OPEN |
| 18 | SEO-017 | SEO/A11Y | Low–Med / P3 | 25–34 interactive targets/page < 24 px (footer, breadcrumbs) | Manual WCAG 2.2 SC 2.5.8 review; enlarge footer/breadcrumb link hit areas (`min-h-6`, padding) | `src/components/site/Footer.tsx`, `src/components/ui/breadcrumb.tsx`, `src/components/site/primitives.tsx` | S–M | Manual a11y test | Re-run target-size script; manual check passes | OPEN |
| 19 | SEO-009 | SEO | Low / P3 | Sitemap lacks `<lastmod>` for 64 static URLs | Emit `lastmod` from build time or content `modified` dates | `src/routes/sitemap[.]xml.ts` | S | — | Sitemap shows lastmod | OPEN |
| 20 | SEO-011 | SEO | Low / P3 | `/pricing/` → 307 | Make trailing-slash redirect permanent (301/308) | router/server config (TanStack `trailingSlash`/edge rewrite) | S | — | `curl -I /pricing/` → 301/308 | OPEN |
| 21 | SEO-012 | SEO | Low / P3 | Structured data polish | `BlogPosting`: add `image`, link `publisher` to Organization `@id`, Person/Org author `@id`; add Organization `sameAs`/`contactPoint` only for real profiles; keep FAQPage (no rich-result expectation); never add ratings/reviews | `src/lib/seo.ts`, `src/components/site/ResourceArticle.tsx` | S | — | Schema validator clean | OPEN |
| 22 | SEO-013 / SEO-010 | SEO | Low / P3 | `<html lang>`, OG image per page, `book-demo?framework=<long name>` links | Use `en-AU`; per-section OG images (frameworks/pricing); use short slugs in `?framework=` | `src/routes/__root.tsx`, `src/lib/seo.ts`, framework page CTAs | S | Design | HTML lang `en-AU`; shorter URLs | OPEN |
| 23 | SEC-010 / SEC-011 | SEC | LOW–INFO / P3 | Headers | Add `COOP: same-origin`, `CORP: same-site`; `server_tokens off`; cache headers for HTML policy | `ops/nginx/*.conf` | S | #1 | `curl -sI` | OPEN |
| 24 | SEC-009 | SEC | INFO / backlog | HSTS preload | Decide whether to pursue preload for the apex+subdomains | edge | S | Business decision | hstspreload.org status | OPEN |
| 25 | SEC-008 | SEC | NOT VERIFIED / P1-verify | TLS cert/protocols/ciphers | Test from an uninspected network (or with approval, SSL Labs); record issuer/expiry/protocols | n/a | S | Network without TLS inspection; authorisation | Report with issuer = public CA, TLS 1.2/1.3 only | OPEN |
| 26 | — (data) | SEO | UNAVAILABLE | Search Console / Bing / analytics / CrUX | Grant read access (or export reports) to establish true index coverage, queries, CWV field data | n/a | S | Eredox admin | GSC "Pages" and "Core Web Vitals" reports | OPEN |
| 27 | — (data) | SEC | NOT VERIFIED | Two earlier HIGH findings | Supply the original scanner report; retest each individually | n/a | S | Report from prior assessor | Per-finding retest table | OPEN |

## B. Dependencies / ordering

```
#26 and #27 (information) ─ any time, unblock measurement and closure
#3 (dep upgrade) ─┐
#4,#6,#8,#9,#11,#12 (code) ─┼─► single release ─► #1 (deploy) ─► #2 (CSP), #7 (cache headers), #23, #25 (re-verify)
#5 (forms hardening) ─┘ (edge limit_req needs #1)
```

## C. Suggested next implementation package: **NOVA-WEB-REMEDIATE-001** (≈4–5 engineering days)

1. Dependency bump (SEC-002/003/004) + lockfile + tests.
2. Real 404 handling (SEO-001) + security.txt (SEC-012).
3. Metadata pass on ~20 priority pages (SEO-005/008/014) and noindex/sitemap clean-up for placeholder pages (SEO-006/004).
4. Homepage image + font fixes (SEO-015/002/016).
5. Forms hardening and booking-URL privacy fix (SEC-005/006).
6. Release from `main`; apply CSP and header changes at the edge (SEC-001/007/010/011); re-run this audit's retest commands and update this register.
Then a second package for the content programme (SEO-007) once Search Console data (rank 26) provides a baseline.
