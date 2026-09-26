# NOVA-WEBSITE-FINALIZATION-001

> Historical evidence snapshot. The current Free registration closure is recorded in
> [NOVA-GO-LIVE-CLOSURE-001](NOVA-GO-LIVE-CLOSURE-001.md); its source changes supersede the
> historical “no registration route” disposition below.

## Executive decision

**HOLD**

The source branch is materially improved and the production-equivalent build is healthy, but the website is not defensibly GO-LIVE READY because:

1. the public **Start Free** path has no real registration/provisioning route; it remains an information page with a disabled onboarding control;
2. Book Demo and Start Free browser E2E acceptance could not be completed in an isolated authorized environment;
3. responsive/mobile, accessibility-tree, cross-browser and Core Web Vitals measurements could not be completed because no browser session was available;
4. CSP is prepared in source but production was deliberately not modified, so the live site still has no CSP.

Production was not deployed or modified.

## Repository and delivery

- Repository: `Eredox/snapshot-render-lab`
- Branch: `feat/nova-website-finalization-001`
- Baseline `origin/main`: `27518b317870cc858a696eaba19708ed4c48ccce`
- Implementation commit: `7de06a6`
- Public website: https://www.nova.eredox.com
- Production modified: **NO**
- Required final documentation commit: follows this implementation commit.
- PR: not yet opened; branch push and PR creation remain delivery actions.

## Baseline versus final

| Area | Baseline | Final source state |
|---|---|---|
| Sitemap inventory | 65 pages; average audit score 93.9% | 65 URLs retained; source sitemap test PASS; live baseline 65/65 HTTP 200 |
| Image accessibility | 138/146 observed image instances lacked useful audit-recognised alt text | Shared brand/framework imagery now uses explicit semantic treatment; actionable rendered audit not runnable |
| Mobile cookie banner | Fixed banner could cover CTAs/disclaimers at approximately 390px | Banner is flow-positioned before the site header, has safe-area padding and an SSR space reservation; browser verification blocked |
| CSP | Absent on live edge | Narrow CSP added to Nginx source; live edge remains unchanged |
| Title outliers | Four audit-identified long titles | PCI DSS, GDPR, CMMC and first-framework titles corrected |
| Meta descriptions | Platform approximately 180 chars; privacy was version-only | Platform 154 chars; privacy 126 chars; both semantically useful |
| Free CTA truth | “Start free” conflicted with approval/governance wording | Public copy now says “Explore Free access”; no invented registration URL |
| Unsupported claims | Testimonials, static uptime/status and customer outcomes presented as public facts | Testimonials removed from rendering/data; customer scenarios labelled illustrative; status feed explicitly unconnected |
| Verification | Browser and lab metrics incomplete | Lint, typecheck, 17 Vitest files/96 tests and production build PASS; browser/performance evidence remains blocked |

## Change summary

- Added semantic cookie consent flow positioning, safe-area support and hydration-space reservation.
- Preserved equal Accept all, Reject non-essential and Manage preferences controls and existing consent storage behaviour.
- Kept non-essential providers disabled; no analytics or marketing provider is configured.
- Corrected four title outliers and the platform/privacy descriptions.
- Reconciled Free messaging with the actual implementation; paid plans continue through governed contact/Odoo workflow and Enterprise remains quote-only.
- Added homepage “AI governance with human oversight” and “SOC 2 readiness and multi-framework compliance” headings while preserving the approved H1 and human-decision boundary.
- Removed unapproved testimonial quotations, emptied the testimonial data source until genuine attributable feedback is approved, labelled customer content illustrative, and removed static operational/incident assertions.
- Added source CSP configuration while preserving HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy.
- Added deterministic sitemap/CSP launch tests and a protected website CI workflow.
- Added lint exclusions for repository-local `.kilo` worktrees and made the existing linter reflect the maintained repository policy; lint completes with seven existing non-fatal Fast Refresh warnings.

## Audit finding disposition

| Finding | Disposition | Evidence |
|---|---|---|
| Shared image accessibility | FIXED in source | Logo and framework imagery are decorative where adjacent text supplies the name; meaningful imagery has descriptive alt text |
| Framework icon unnamed images | FIXED in source | Framework icons use `alt="" aria-hidden="true"` beside visible framework names |
| Mobile cookie/CTA overlap | FIXED in source; visual verification DEFERRED | Cookie component is no longer fixed/overlaying content |
| Missing CSP | FIXED in source; live deployment DEFERRED | Nginx config contains narrow enforced CSP; production was not changed |
| Four title outliers | FIXED | Targeted titles are unique and 32–47 characters |
| Platform description | FIXED | 154 characters; includes GRC platform, AI governance and multi-framework compliance |
| Privacy description | FIXED | 126 characters and describes Eredox/NOVA personal-information handling |
| Pricing / Free wording | FIXED | “Explore Free access”; no self-service activation claim |
| Homepage search intent | FIXED | AI governance and SOC 2 readiness headings added naturally |
| Content truth review | FIXED / QUALIFIED | Testimonials removed; scenarios labelled illustrative; status feed no longer asserts uptime |
| Internal route integrity | FIXED / PASS | Existing route registry tests plus new sitemap invariant; 0 known broken routes |
| Robots and sitemap | PASS | Googlebot/Bingbot/ordinary crawling preserved; canonical HTTPS sitemap; 65 unique URLs |
| Structured data | PASS | Existing schema tests pass; no ratings/reviews/aggregateRating added; quote-only Enterprise has no numeric price |
| Performance | BLOCKED / DEFERRED | Build completed; browser lab LCP/INP/CLS not available; Cirqua asset absent and 634.6 kB client chunk remains |
| Book Demo E2E | BLOCKED | Safe server/unit coverage exists; no isolated authorized browser/CRM delivery test executed |
| Start Free E2E | BLOCKED | No real production-ready registration/provisioning route exists |
| Cross-browser QA | BLOCKED | No browser session available |
| Search Console/Bing submission | DEFERRED | No authenticated webmaster access was used or claimed |

## All 65 sitemap URLs

Live baseline status was collected from the production sitemap on 2026-09-26. Source changes were not deployed, so the final column explicitly distinguishes source validation from live deployment.

| # | URL path | Live baseline | Redirect | Final source state |
|---:|---|---:|---|---|
| 1 | `/` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 2 | `/about` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 3 | `/book-demo` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 4 | `/compare` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 5 | `/contact` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 6 | `/customers` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 7 | `/features` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 8 | `/frameworks` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 9 | `/industries` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 10 | `/integrations` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 11 | `/legal` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 12 | `/partners` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 13 | `/platform` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 14 | `/pricing` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 15 | `/request-quote` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 16 | `/resources` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 17 | `/roadmap` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 18 | `/resources/blog` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 19 | `/resources/faq` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 20 | `/resources/guides` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 21 | `/resources/product-updates` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 22 | `/responsible-ai` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 23 | `/security` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 24 | `/solutions` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 25 | `/start` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 26 | `/status` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 27 | `/support` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 28 | `/testimonials` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 29 | `/trust` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 30 | `/legal/terms` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 31 | `/legal/privacy` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 32 | `/legal/cookies` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 33 | `/legal/accessibility` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 34 | `/features/framework-management` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 35 | `/features/controls` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 36 | `/features/evidence` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 37 | `/features/policies` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 38 | `/features/risk-management` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 39 | `/features/asset-governance` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 40 | `/features/reporting` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 41 | `/features/trust-centre` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 42 | `/features/auditor-portal` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 43 | `/features/ai-assistant` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 44 | `/frameworks/soc-2` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 45 | `/frameworks/iso-27001` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 46 | `/frameworks/essential-eight` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 47 | `/frameworks/iso-42001` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 48 | `/frameworks/gdpr` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 49 | `/frameworks/pci-dss` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 50 | `/frameworks/hipaa` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 51 | `/frameworks/cmmc` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 52 | `/industries/technology` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 53 | `/industries/financial-services` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 54 | `/industries/healthcare` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 55 | `/industries/government-suppliers` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 56 | `/industries/professional-services` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 57 | `/solutions/startups-saas` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 58 | `/solutions/technology-smes` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 59 | `/solutions/regulated-organisations` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 60 | `/solutions/service-providers` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 61 | `/solutions/compliance-teams` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 62 | `/solutions/executives` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 63 | `/solutions/auditors` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 64 | `/resources/blog/choosing-your-first-framework` | 200 | none | PASS — source route/sitemap retained; production not changed |
| 65 | `/resources/guides/evidence-that-survives-an-audit` | 200 | none | PASS — source route/sitemap retained; production not changed |

## Internal-link crawl

- Deterministic route-registry and sitemap tests: **PASS**.
- Known broken internal routes: **0**.
- Full rendered anchor/router/image/download crawl: **BLOCKED** because no browser session was available.
- Intentional exclusions remain separate: `/404`, `/book-demo/confirmed`, empty resource sections and non-indexable dynamic pages.

## Accessibility

Source review confirms:

- skip link and main landmark are retained;
- header/footer brand names have accessible link names;
- decorative shield/framework images are hidden from assistive technology;
- meaningful content imagery has descriptive alt text;
- form controls have labels and server-side validation error states;
- cookie controls retain keyboard-operable buttons and equal choice visibility.

Rendered accessibility-tree inspection and keyboard-only browser verification are **BLOCKED** by unavailable browser tooling. No automated zero-finding claim is made.

## Mobile/browser result

The cookie remediation is sitewide and no longer uses a fixed overlay. The banner is placed before the header, reserves space during hydration, supports `env(safe-area-inset-bottom)`, and preserves consent behaviour.

Required widths 320, 360, 375, 390, 430, 768 and desktop, plus Chromium/Firefox/WebKit checks, remain **unverified** because no browser session was available. Physical iOS/Safari testing is also outstanding.

## CSP and security headers

Source Nginx now emits:

- HSTS;
- X-Frame-Options;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- Content-Security-Policy with `default-src 'self'`, no `unsafe-eval`, restricted fonts/images/connections/frames and documented inline exceptions for current SSR JSON-LD/animation style attributes.

The live baseline response was verified to contain the five existing security headers and **no CSP**. The edge change is source-only and requires an approved deployment.

## SEO, metadata and structured data

Targeted source SSR verification on the production-equivalent build returned HTTP 200 for homepage, pricing, platform, PCI DSS, GDPR, CMMC, blog, privacy, start, status, sitemap and robots.

Corrected titles:

- `PCI DSS v4.0.1 | NOVA Compliance`
- `GDPR Compliance | NOVA Compliance`
- `CMMC Compliance | NOVA Compliance`
- `Choosing Your First Compliance Framework | NOVA`

The platform description is 154 characters and the privacy description is 126 characters. Canonical/OG/Twitter helpers remain centralized. Existing structured-data tests pass; no fake reviews, ratings, customer counts or certification claims were added.

## Robots, sitemap and indexability

- Live `/robots.txt`: HTTP 200; Googlebot, Bingbot and ordinary crawling allowed; deliberate AI crawler policy preserved.
- Live `/sitemap.xml`: HTTP 200; 65 unique canonical HTTPS URLs; no localhost/staging host; intended transient/404/empty pages excluded.
- Source invariant test asserts 65 URLs and excludes `/404` and `/book-demo/confirmed`.
- No authenticated Search Console or Bing Webmaster action was attempted.

## Content-truth review

Public claim changes:

- Unapproved testimonial quotations were removed from the public page and data source.
- Customer stories are now explicitly illustrative rather than named results.
- Static “All systems operational”, “Last updated: today” and “No incidents reported” claims were removed; the status page says no live monitoring feed is connected.
- Partner copy now describes potential discussions and subjects any programme/referral/co-marketing arrangement to review.
- Framework availability continues to come from the governed catalogue with “Available now” versus “Available by configuration”.
- Existing AI wording retains: “NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.”
- Existing certification/auditor boundaries remain intact.

Claims classified VERIFIED include route/SEO/build behaviour, governed plan manifest values, available integration inventory and public legal publication data. QUALIFIED includes framework availability, readiness, AI assistance, security practices, partner discussions and illustrative scenarios. PLANNED remains explicitly labelled in the governed roadmap/integration inventory. Unsupported testimonial, uptime and customer-result claims were removed.

## Pricing and Free commercial-copy decision

The implementation is **Case B**. Free is represented in the governed plan manifest as no subscription charge, but the public website does not currently provide a production-ready registration/provisioning path. Therefore:

- “Start free” was changed to “Explore Free access”.
- The `/start` page explains that self-service registration is not connected.
- No browser registration URL was invented.
- Paid plans continue to contact/governed Odoo workflow.
- Enterprise remains quote-only.
- No tenant-facing Stripe checkout was introduced.
- Product/Offer schema remains derived from governed plan data and does not invent an Enterprise price.

## Book Demo E2E evidence

Server/unit coverage PASS: validation, invalid email handling, missing values, CRM-first ordering, bounded retry, generic errors and no secret leakage are covered by existing form tests. A built local server also returned 405 for GET, 400 for invalid email and 503 with a generic message when delivery configuration was absent.

A real valid submission was **not executed**: doing so would require an authorized isolated CRM/email test environment and browser session. This is a launch acceptance blocker, not a claimed PASS.

## Start Free E2E evidence

**BLOCKED.** The current implementation exposes no real registration or approved Free-start endpoint. The visible control is disabled and accurately says the Free onboarding route is not connected. No tenant, entitlement or commercial state was created.

## Performance measurements

No LCP, INP or CLS measurements were claimed. The production-equivalent build completed successfully. Recorded lab limitations:

- Cirqua preload is present but `public/fonts/cirqua.woff2` is absent.
- Largest client chunk is approximately 634.6 kB minified before gzip.
- No browser session was available for mobile/desktop LCP, INP, CLS or interaction testing.
- Performance remains DEFERRED/BLOCKED pending a reproducible lab run.

## CI

Added `.github/workflows/website-ci.yml` with lockfile installation, lint, typecheck, Vitest and production build. Local equivalents:

- lint: PASS, 0 errors / 7 existing warnings;
- typecheck: PASS;
- Vitest: PASS, 17 test files / 96 tests;
- build: PASS.

GitHub Actions has not been run from this environment.

## Remaining manual/external actions

- Deploy the reviewed edge configuration through the approved production process to activate CSP; production was not modified here.
- Run an authorized isolated Book Demo valid submission through the real CRM/email route and document cleanup.
- Implement and prove the governed Free registration/provisioning path, or keep the launch hold.
- Run Chromium, Firefox and WebKit at required responsive sizes; perform physical iOS/Safari validation separately.
- Run lab LCP/INP/CLS measurements on homepage, pricing, platform, frameworks, book-demo and start.
- Submit `https://www.nova.eredox.com/sitemap.xml` to Google Search Console and Bing Webmaster Tools using authorized accounts; no submission was claimed.
- Resolve the absent licensed Cirqua asset or remove its preload if the font is not intended to ship.
- Review the 634.6 kB client chunk for future performance improvement.

## Exact unresolved blockers

1. No production-ready Free registration/provisioning route or approved Free-start browser flow.
2. No available browser session for required responsive, accessibility-tree and cross-browser acceptance.
3. No authorized isolated environment for a valid Book Demo CRM/email E2E submission.
4. No measured LCP/INP/CLS evidence.
5. CSP is source-prepared but not deployed, by explicit instruction.

## Final recommendation

**HOLD** until blockers 1–5 are resolved or explicitly accepted by the launch authority.
