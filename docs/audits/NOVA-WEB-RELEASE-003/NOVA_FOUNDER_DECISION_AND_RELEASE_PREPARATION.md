# NOVA-WEB-RELEASE-003 — Founder decision and release preparation

## 1. Founder decision (recorded 2026-11-08)
**AI crawler policy: APPROVED — retain existing permissions.**

| Item | Decision | Implementation |
|---|---|---|
| GPTBot, ClaudeBot, Google-Extended | Allowed to access public NOVA Compliance website content for their documented AI uses | `public/robots.txt` unchanged in effect; the comment above the training section now records the decision |
| Search-engine, AI-search and user-initiated crawlers (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, ChatGPT-User, Claude-User, Perplexity-User and the rest) | Continue to be allowed | unchanged |
| CCBot and every other crawler rule | **Not changed** | verified: the parsed permission groups of `robots.txt` are identical to the previous commit (only comments differ) |
| Private application routes, source code, credentials, customer information | Must not be opened | The public website has no such routes: sensitive paths (`/.env`, `/.git/*`, `/src/*`, `/server/*`, `/.output/*`, `*.map`, `/_serverFn/*`, `/api/*`) return 404/403/405; the application lives on a separate host (`nova.eredox.com`) that is `noindex` and not part of this site's `robots.txt`; the discovery checker asserts the exposure checks on every run |
| Security and anti-abuse controls | Not weakened | CSP, headers, `limit_req` and in-app limiters untouched; no bot exemptions were added anywhere |
| Search Console generative-AI inclusion | Confirm during activation | Added as checkpoint 4a of `NOVA_SEARCH_INDEXING_ACTIVATION_PLAN.md`: confirm the property-level **"Search generative AI"** setting is **Include** for `https://www.nova.eredox.com/` and record it; per press reports of Google's 2026 control it is separate from `Google-Extended`. Current value **NOT VERIFIED** (no account access) |
| Actual crawler access | Stays **NOT VERIFIED** until corroborated | Every "access" cell in the crawler matrix remains NOT VERIFIED; the activation plan §6 lists the corroboration method per platform (verified-IP logs, Search Console, Bing Webmaster Tools) |
| Subscription, pricing, registration, billing, Odoo, Stripe | Untouched | no file in those areas changed in this package (see git diff of `af60a08`, `8b4b356`) |
A unit test (`src/lib/__tests__/robots-policy.test.ts`) pins this policy, so changing it requires a deliberate test edit plus a new Founder decision.

Residual notes for the record: robots.txt is a voluntary request and cannot withdraw content already collected or bind non-compliant scrapers; `Applebot-Extended` and other unnamed training crawlers are covered by the default `*` allow and are outside this decision.

## 2. Website-only SEO, security and release preparation completed in this step
| Item | Result |
|---|---|
| **SEC-013 supply chain** | Docker base images pinned by digest (`oven/bun:1@sha256:1d22548f…8f1d`, `node:24-bookworm-slim@sha256:01d566e8…70e9`); GitHub Actions pinned to commit SHAs (`actions/checkout` `11d5960a…7262` = v4, `oven-sh/setup-bun` `0c5077e5…57d6` = v2.2.0). The pinned image **builds and runs** (verified). The workflow change itself has **not run** in GitHub Actions (nothing pushed) — first CI run after push will prove it. Update the pins deliberately; Dependabot-style automation is a follow-up |
| **CI lockfile compatibility** | `bun install --frozen-lockfile` and `bun audit` succeed under **bun 1.2.17** (the version CI pins) in a scratch copy — closes the open question from RELEASE-001 |
| **SEO-013** `en-AU` / locale | `<html lang="en-AU">` on all pages and the error page; `og:locale en_AU` on page and article meta. Per-page share images still **OPEN** (need design assets) |
| **SEO-009** `lastmod` | Decided: omitted except genuinely dated articles (reasoning in the robots/sitemap report); editor-maintained date proposed |
| **SEO-012** structured data | Organization/WebSite/About/Contact enriched with published facts only (RELEASE-003 first step) |
| SEO-010 long `?framework=` links, SEO-017 target size | Still OPEN: not required for release; SEO-017 needs manual WCAG 2.2 review |
| Defects from step 1 | Industries reachable from the footer; heading outline fixed (already committed in `af60a08`) |

## 3. Final verification of the current candidate (HEAD `8b4b356`)
| Check | Result |
|---|---|
| Typecheck / lint | PASS / 0 errors (7 baseline warnings) |
| Unit and route tests | **PASS 122/122** (22 files) |
| Production build | PASS |
| Discovery check (robots matrix, sitemap, 69 pages: canonical, meta, headings, text, JSON-LD, reachability, exclusions, 404, private routes) | **PASS, 0 FAIL** on the local build **and on the Docker container** |
| Docker image `nova-web-rc:8b4b356` (`sha256:e242ec9e…27da`), built from the digest-pinned Dockerfile | builds; **healthy**; non-root uid 10001; read-only filesystem with `--cap-drop ALL`; patched TanStack marker present, vulnerable code absent |
| Full release verification against the container (HTTP + headless-Edge desktop/mobile, 103 checks) | **PASS, 0 FAIL** |
| nginx 1.27.5 in front of the container (disposable) | every security header exactly once (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, COOP, Cache-Control); `/pricing/` → 301; new `robots.txt` served |
| Journey, booking, responsive suite | PASS 27/27 (run on the build before the digest pin; the code paths touched afterwards are the `lang` attribute, `og:locale`, comments and CI/Docker files) |
| Dependency advisories / secrets | `osv-scanner`, `bun audit`, gitleaks: clean at RELEASE-002; no dependency change since |
| Not run | Rich Results Test and Schema.org validator (need a live URL); Search Console/Bing; real-crawler corroboration; GitHub Actions run of the pinned workflow; OS-layer image scan; Server1 anything |

## 4. Impact on the production release plan
The RELEASE-002 execution plan stands, with these updates:
1. The release artifact is now the digest-pinned Dockerfile at HEAD `8b4b356` (or the approved successor). Local test image `nova-web-rc:8b4b356`, ID `sha256:e242ec9e0bfce94c0e0cd909f45c3d0c0f519033ad35c70800b12cfb465e27da`, is **not** the artifact to ship (workstation build, not pushed to a registry).
2. Step "tag the running image for rollback" and the `nginx -t` on real certificates are unchanged.
3. Add to the post-deployment probes: `curl -s https://www.nova.eredox.com/robots.txt | grep -c Claude-SearchBot` (expect 1), `curl -s https://www.nova.eredox.com/ | grep -o '<html[^>]*>'` (expect `lang="en-AU"`), and `node scripts/discovery/check-discovery.mjs --base https://www.nova.eredox.com --live --delay 400` (expect PASS and 69 sitemap entries).
4. After deployment follow `NOVA_SEARCH_INDEXING_ACTIVATION_PLAN.md` (Search Console sitemap, **generative-AI setting check**, Bing, IndexNow dry-run then approved submission of the changed URLs).
5. The **HOLD** conditions of RELEASE-002 are unchanged: the checkout decision (Founder), legal wording incl. the cookie-policy font statement, Server1 vhost by diff and `nginx -t`, security-mailbox designation. None of them is affected by this step.

## 5. Open items that are not release blockers
Per-page Open Graph images (design), `?framework=` link shortening, manual WCAG target-size review, cookie-banner LCP, editor-maintained `lastmod`, Dependabot/Renovate for the pinned digests and SHAs, OS-layer image scanning, `sameAs` profiles for the Organization (owner to supply), real-crawler corroboration after launch.
