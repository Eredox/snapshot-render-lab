# NOVA-WEB-REMEDIATE-001 — Implementation report

Branch `remediate/nova-web-remediate-001` (local worktree `C:\Eredox\Projects\snapshot-render-lab-remediate-001`, created from `origin/main` @ `c01d8f6`). Local commits only; nothing merged, pushed or deployed. Date: 2026-11-07.

## 1. Phase 1 — preserve and reconcile

| Item | Result |
|---|---|
| Primary checkout | `C:\Eredox\Projects\snapshot-render-lab`, branch `codex/snapshot-render-lab-env-protection` @ `01db67a` (3 commits ahead of / divergent from `origin/main`; it lacks PRs #16/#17). **Untouched**; its only change is the untracked `docs/audits/` audit folder. |
| `origin/main` | `git fetch` + `git ls-remote`: `c01d8f6` (merge of PR #17, 2026-11-02) |
| Isolation | New worktree + branch from `origin/main`; the existing checkouts, branches and stashes were not modified |
| Audit preservation | Original folder left in place with all evidence and scripts. Only Reports A–E were copied into the branch (commit `1d42add`), after a credential / personal-data review. **Not committed:** `evidence/` (raw crawl, lab output, osv.json, and `crawl.py`, whose user-agent string contains an operator e-mail address). |
| Production release | **Live = a 22 Oct 2026 build.** Verified by building commit `69543cb` in a throw-away worktree (removed afterwards): the hashed app chunks `site-zTYuhHp9.js`, `pricing-Dvd4PnW4.js` and `styles-CUB98kPa.css` are identical to the ones served by www.nova.eredox.com. (The vendor chunk `index-*.js` hash differs, consistent with a different bun/resolver version at build time.) Live is therefore **not** `main`. |

### Live (`69543cb`) → current `main` (`c01d8f6`): changes to pricing, checkout, legal and registration
(from `git diff 69543cb origin/main`, 23 files)
- **Plan manifest** `canonical-plan-manifest.ts` 2026-09-22 → **2026-10-26** (SHA-256 `4361bfe4…92cf`), currency USD. **Entitlement change:** Free 1 framework, Launch/Growth 3 frameworks, Enterprise "agreed scope" → **all available frameworks on every plan**.
- CTA labels: `Start Free` → `Create Free Workspace`; `Get Started` → `Subscribe to Launch|Growth|Professional|Business`; `Request a quote` → `Request a Quote`.
- Registration links are built in one place (`registrationUrlFor`) and carry only `plan` and `billing_cycle`; `/plans/<plan>` gains a Monthly/Annual toggle and `?billing=` hand-off from `/pricing`.
- Pricing wording: "indicative and subject to Eredox approval" → "Prices are shown in USD. Annual plans are charged as the full annual amount…". FAQ and plan-limitation copy now refer to the governed NOVA subscription journey and "the Eredox/Odoo commercial authority path".
- **Legal documents:** no change in this range (legal data files untouched). **Checkout/payment:** the public website contains no Stripe or Odoo code (only legal/plan copy mentions them); purchase happens in the NOVA application.
- **Release dependency recorded by the upstream change (`docs/NOVA_WEB_SIGNUP_001.md`):** these links assume a NOVA *application* release that reads `plan` / `billing_cycle` on `/register`; the 5 Oct application ignores them. And the "all frameworks" entitlement text must match the backend manifest that is actually live. Neither can be verified from this repository.

## 2. What was changed (by theme)

### Security
| Change | Files |
|---|---|
| TanStack Start → patched: react-start 1.168.32→**1.168.60**, start-server-core 1.169.17→**1.169.39**, react-router 1.170.41, router-plugin 1.168.42, seroval 1.7.7; `ErrorComponent` adapted to new `unknown` error type | `package.json`, `bun.lock`, `src/routes/__root.tsx` |
| Transitive/toolchain advisories cleared: launch-editor, js-yaml, shell-quote, source-map-js, nanoid, brace-expansion (in-range updates), vite 8.3.6, vitest 5.1, `minimatch` override 11.0.1; **unused `zod` removed** | `package.json`, `bun.lock` |
| **CSP is application-owned**, generated per request with a script nonce: no `unsafe-eval`, no script `unsafe-inline`, same-origin only (`'unsafe-inline'` only for `style-src-attr`), `frame-ancestors 'self'`, `object-src 'none'`, `base-uri/form-action 'self'`; plus COOP. Nonce reaches TanStack's hydration/`ld+json` scripts through `router.options.ssr.nonce` (AsyncLocalStorage hook, no client import) | `src/lib/security-headers.ts`, `src/server.ts`, `src/router.tsx`, `src/lib/error-page.ts` |
| nginx vhost: static CSP removed (would duplicate/force `unsafe-inline`), `server_tokens off`, permanent trailing-slash redirect, `limit_req` zone + 40 KB cap on `/api/forms` | `ops/nginx/www.nova.eredox.com.conf` |
| `/api/forms`: JSON content-type (415), Origin + Fetch-Metadata check (403), streaming 32 KB cap (413), per-client (20 attempts / 5 deliveries per 10 min) and global (120/h) limits with `Retry-After` (429), honeypot (silent 202), 15-min duplicate suppression, salted-hash privacy-safe logs, `allow` header | `src/lib/forms-server.ts`, `src/lib/form-guards.ts`, `HoneypotField.tsx`, `ContactForm.tsx`, `BookingForm.tsx` |
| Booking confirmation: details move from URL query to `history.state`; route no longer reads search params | `src/lib/booking-confirmation.ts`, `BookingForm.tsx`, `book-demo.confirmed.tsx` |
| Self-hosted Roboto (latin 400/500/700, OFL licence file) — no third-party requests | `public/fonts/roboto/*`, `src/styles.css`, `__root.tsx` |
| `security.txt` (published contact, `Expires: 2027-05-01`) | `public/.well-known/security.txt` |
| CI: `bun audit` step | `.github/workflows/website-ci.yml` |

**Header ownership finding (Phase 2.2).** Response headers on production come from the nginx edge (the Node app set none: HSTS/XFO/etc. were visible on live responses but the repo's CSP was not). The repo vhost gained its CSP on 2026-09-28 (`deb8b1c`); the live vhost on Server1 predates or differs from it, i.e. the repo file is documentation of intent, not what is deployed. Hence the CSP now travels **with the application release**, independent of edge configuration.

### Technical SEO
| Change | Files |
|---|---|
| Genuine 404s: `$` splat and `/404` routes removed; root `notFoundComponent` (+ `noindex`) answers HTTP 404; `.map`, `.woff2`, `.txt`, `/index.html` etc. 404 | `src/routes/$.tsx`, `404.tsx` (deleted), `__root.tsx`, `navigation.ts`, `sitemap[.]xml.ts` |
| Titles: all 73 canonical pages unique, ≤ 60 chars, one `| NOVA Compliance` suffix, intent-led (readiness wording, no certification claims); descriptions 70–160; central overrides for features/frameworks/industries/solutions | `src/data/seo-overrides.ts`, ~35 route files |
| Placeholder sections `noindex,follow` and out of the sitemap until content exists (testimonials, status, product updates; case-studies/webinars now conditional on published items); plan pages added to the sitemap; `/plans/<plan>` no longer 307-redirects (`billing` search param optional) | `testimonials.tsx`, `status.tsx`, `resources.*.index.tsx`, `plans.$slug.tsx`, `sitemap[.]xml.ts`, `seo.ts` |
| Orphans: footer links for `/compare`, `/start`, `/customers`, `/partners` | `src/config/navigation.ts` |
| `/start` stated "One active framework" for Free (stale fallback after the manifest change) → follows the manifest | `src/routes/start.tsx` |
| Quantified claim ("halving the evidence duplication") removed from the *illustrative* customer scenario | `src/routes/customers.tsx` |
| Accessible names include visible text on header logo and audience cards (WCAG 2.5.3; Lighthouse `label-content-name-mismatch`) | `Header.tsx`, `routes/index.tsx` |

### Performance and assets
- Homepage/platform PNG diagrams (1.29 / 1.64 / 1.24 MB) → AVIF + WebP variants (640–1672 px) in a `<picture>` with the PNG fallback and declared dimensions (`ResponsiveDiagram.tsx`); AVIF PSNR 37.5–42.5 dB, visually checked for text legibility. Audience photos get 480/960 px WebP `srcset`. Three 1254 px framework logos (~1 MB each, displayed at 72 px) → 320 px like the other five. Reproducible via `scripts/optimise-images.py`.
- Nitro `routeRules`: 30-day `Cache-Control` for `/media`, `/fonts`, `/og`; 1 day for `/favicon.ico` (hashed `/assets` were already immutable).
- Missing font: `/fonts/cirqua.woff2` never existed in the repo (licensed file "to be dropped in"). The failing preload and `@font-face` were removed (restore steps documented in `styles.css`); the wordmark continues to use the Roboto fallback as before. **No unrelated font was substituted.**

### Content
- `/platform`: new factual section on GRC, compliance management, risk/evidence management and compliance automation (only connectors that are *Available now*; human review and the readiness-vs-certification disclaimer stated). Editorial backlog for new content: `NOVA_WEBSITE_EDITORIAL_BACKLOG.md` (no new articles generated).

### Tooling added
`scripts/verify-release.mjs` (HTTP + headless-Chrome release verification, 103 checks), `scripts/lab-gzip-proxy.mjs`, `scripts/optimise-images.py`, `npm run verify:release`.

## 3. Deviations from the brief / decisions to review
1. **Playwright** is not installed in the project; the equivalent browser checks run through Chrome DevTools protocol in `verify-release.mjs`. **Playwright suites: not run.** Lighthouse 13.6 was installed in a temp directory *outside* the repo and used.
2. **Docker image build and `nginx -t` were not run:** the Docker daemon did not respond. The Dockerfile and the edited vhost are therefore unvalidated by tooling (see release readiness).
3. TanStack was moved to the **minimum patched** versions rather than latest, to limit regression surface.
4. `minimatch` is forced to a new major through an override because the only fixed version is 11.x; lint, typecheck and tests pass, but it should be reviewed (dev tooling only).
5. Not done (intentionally or deferred): sitemap `lastmod` for static pages (SEO-009), short-slug `?framework=` links (SEO-010), BlogPosting/Organization schema polish (SEO-012), `en-AU` / per-page OG images (SEO-013), image digest and GitHub-Action SHA pinning (SEC-013), CAPTCHA/Turnstile (needs a product/vendor decision), real-user Core Web Vitals (no data).
6. **Legal text not edited** (governed separately): `src/data/legal.ts:104` (cookie policy) says the site loads Roboto from Google Fonts, and `:298` mentions the Google Fonts resource; both are now out of date. Legal owner to update and re-version before release.
7. Existing test `launch-invariants` was deliberately changed: it asserted a CSP `add_header` in nginx; it now asserts the application owns the CSP and nginx must not duplicate it.

## 4. Commits (local, branch `remediate/nova-web-remediate-001`)
See `NOVA_WEBSITE_RELEASE_READINESS.md` §1 for the exact list.
