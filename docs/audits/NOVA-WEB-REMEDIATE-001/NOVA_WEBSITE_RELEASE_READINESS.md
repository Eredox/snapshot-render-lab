# NOVA-WEB-REMEDIATE-001 — Release readiness (release candidate, NOT deployed)

**Release candidate:** local branch `remediate/nova-web-remediate-001`, tag `rc/nova-web-remediate-001` (local, annotated). Base `origin/main` @ `c01d8f6`. **Production deployment is not authorised and has not been performed.** Nothing was pushed or merged.

## 1. Exact source
Code is identical from commit `0a19f7c` onward; later commits add only documentation under `docs/audits/NOVA-WEB-REMEDIATE-001/` (see `git log`).

```
0a19f7c chore(release): CI dependency audit, Partners footer link, deployment notes, verify:release script
094c6ba fix(a11y): accessible names include visible text on logo and audience cards (WCAG 2.5.3)
1510a0c feat(content): GRC / compliance-automation explainer on /platform; chore(deps): drop unused zod, patch minimatch via override
cc0f544 perf: responsive integrations diagram, 320px framework logos, cache/font release checks
5f9c9a8 feat(seo,perf): keyword-aware titles/descriptions, placeholder noindex, sitemap/nav fixes, security.txt, responsive images, cache headers
fce2630 fix(security,seo): app-owned nonce CSP, genuine 404s, hardened /api/forms, no PII in booking URL, self-hosted fonts
0ce36e8 fix(security): upgrade TanStack Start to patched GHSA-qx66-fv34-fjm8 release
1d42add docs(audit): add reviewed NOVA-WEB-AUDIT-001 reports
```
Diff vs `main`: ~118 files (mostly generated image variants and docs).

## 2. Dependency versions (from `bun.lock`, frozen)
react 19.2.8 · react-dom 19.2.8 · @tanstack/react-start **1.168.60** · start-server-core **1.169.39** · react-router **1.170.41** · router-core 1.171.34 · router-plugin **1.168.42** · seroval **1.7.7** · vite **8.3.6** · vitest 5.1.0 · nitro 3.0.260603-beta (unchanged) · zod removed · `overrides`: rolldown 1.2.1, minimatch 11.0.1. Lockfile format unchanged (`lockfileVersion: 1`); generated with bun 1.4.2 (CI pins bun 1.2.17 — same format, but confirm `bun install --frozen-lockfile` passes in CI before release).

## 3. Build and verification results (local)
| Check | Result |
|---|---|
| `bun install --frozen-lockfile` / `bun run build` (clean `.output`) | pass |
| `bun run typecheck` | pass |
| `bun run lint` | 0 errors, 7 warnings (identical to baseline on `main`) |
| `bun run test` | **21 files, 116 tests passed** (baseline 17 files / 83 tests) |
| `osv-scanner scan source -L bun.lock`, `bun audit` | no issues / no vulnerabilities (baseline: 26 advisories, 1 critical) |
| gitleaks (tree) | no leaks |
| `scripts/verify-release.mjs --browser` (69 sitemap pages, 11 browser pages × desktop/mobile) | **103 checks, 0 failures** |
| Patched framework code inside the artifact | present (`MAX_PENDING_SERIALIZATION_RECORDS` marker); vulnerable code absent |
| Re-crawl vs original inventory | 73/73 canonical pages preserved; see SEO retest |
| Lighthouse 13.6 | A11y/Best-practices/SEO 100 on all sampled pages; performance and bytes in SEO retest §3 |
| `.output` fingerprint (sha256 of the sorted per-file sha256 list; informational — rebuilds may differ) | `5ba2e6f49a103939be5b7863325932b15b33c02f4f7fde2a800c4762034ebc43`, 300 files, ≈ 11.2 MB |
| **Not run** | Docker image build; `nginx -t`; Playwright suites; any test against production, staging or the NOVA application; payment/subscription flows |

## 4. Deployment configuration changes
1. **App (ships in the image):** nonce CSP + COOP, 404 behaviour, forms guards, self-hosted fonts, cache headers, `security.txt`, image variants.
2. **Edge vhost `ops/nginx/www.nova.eredox.com.conf`** (must be installed by hand on Server1 — the live vhost is *not* this file today): CSP line **removed**, `server_tokens off`, `rewrite ^/(.+)/$ /$1 permanent`, `limit_req_zone nova_forms` (top-level directive → file must be included at `http {}` level) and a dedicated `location = /api/forms` (burst 3, 429, 40 KB). **`nginx -t` has not been run.** If the live vhost already carries any CSP, remove it to avoid two policies.
3. **Environment:** no new *required* variables. Optional `NOVA_FORM_ALLOWED_HOSTS`. Existing `BREVO_API_KEY`, `NOVA_FORM_FROM_EMAIL`, `NOVA_FORM_TO_EMAIL`, `NOVA_CRM_ENQUIRY_URL`, `NOVA_WEBSITE_INTAKE_KEY_ID`, `NOVA_WEBSITE_INTAKE_KEY_SECRET` are untouched and must not be overwritten.
4. **Topology assumptions:** single container, private `nova_compliance_edge` network, no published port, nginx sets `X-Real-IP`.

## 5. Production configuration differences to reconcile
- Live edge vhost vs repo vhost (CSP absent live; other directives unknown — **Server1 not inspected**).
- Live build is the 22 Oct build (`69543cb`) → this RC also ships PR #16/#17 behaviour: new CTA labels, "all available frameworks" entitlement copy, plan/billing hand-off.
- Live nginx gzip/HTTP2 settings assumed unchanged.

## 6. Production preflight checklist (before any deployment)
1. **Approval** to deploy and a maintenance/rollback window; confirm who holds Server1 access (not this session).
2. **NOVA application release** that reads `plan`/`billing_cycle` on `/register` is live (or ships simultaneously) and the backend plan manifest in production is **2026-10-26** (all frameworks per plan). Otherwise do not publish these CTAs/claims.
3. **Legal owner** updates the cookie policy (`src/data/legal.ts:104`, `:298` still describe Google Fonts) and, if required, re-versions it; confirm the consent text remains accurate (no third-party requests now).
4. Confirm the **security contact mailbox** (`compliance@eredox.com`) is monitored; diarise renewal of `security.txt` before **2027-05-01**.
5. CI green on the branch (lint, typecheck, test, build, `bun audit`) using bun 1.2.17.
6. Build the image on the build host from the tag; run `bun pm ls`/artifact marker check; record the image digest.
7. `nginx -t` against the edited vhost on Server1 with real certificates; confirm no second CSP.
8. Run `node scripts/verify-release.mjs --base <staging-or-localhost> --browser` against the container.
9. Staging form test with disposable data (valid → 202, `text/plain` → 415, foreign Origin → 403, burst → 429) and a booking flow (URL stays clean).
10. Confirm the Brevo/CRM credentials in the target environment (never copy them from here).

## 7. Rollback procedure
- Keep the currently running image (`69543cb`-era) tagged and untouched; record its digest first.
- Deploy by switching the `nova-public-website` container to the new image; if any verification fails, `docker compose up -d` with the previous image digest (config and env unchanged) and reload nginx.
- Edge: keep a dated copy of the previous vhost; revert and `nginx -s reload` if `nginx -t` or smoke tests fail.
- No database or migrations are involved; the only state is the in-memory limiter (resets on restart).
- Post-rollback: re-run the header and 404 probes and record the outcome.

## 8. Post-deployment verification (non-invasive, GET/HEAD only)
```bash
curl -sI https://www.nova.eredox.com/ | grep -iE "content-security-policy|strict-transport|x-frame|cross-origin-opener|^server"
for p in zz-test-404 index.html security.txt llms.txt; do curl -s -o /dev/null -w "$p %{http_code}\n" https://www.nova.eredox.com/$p; done
curl -s https://www.nova.eredox.com/.well-known/security.txt | head
curl -sI https://www.nova.eredox.com/pricing/ | head -3        # expect 301
curl -s https://www.nova.eredox.com/ | grep -c "Create Free Workspace"
node scripts/verify-release.mjs --base https://www.nova.eredox.com   # HTTP checks only, no --browser, bounded GETs
```
Then submit the updated sitemap in Search Console and monitor Pages/soft-404, Core Web Vitals and Crawl stats.

## 9. Readiness verdict
**Release candidate: READY FOR REVIEW — NOT READY TO DEPLOY** until the blockers in `NOVA_WEBSITE_REMEDIATION_STATUS.md` §3 (application-release dependency, legal text, Server1 vhost/`nginx -t`, Docker build, approvals) are cleared.
