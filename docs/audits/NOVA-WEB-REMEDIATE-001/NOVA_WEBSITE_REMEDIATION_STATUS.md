# NOVA-WEB-REMEDIATE-001 — Remediation status

Date 2026-11-07 · Branch `remediate/nova-web-remediate-001` (local commits only; tag `rc/nova-web-remediate-001`) · Not merged, pushed or deployed.

## 1. Overall result
**PASS (local scope, conditional).** Every code-level remediation that can be verified without production access is implemented and verified: typecheck, lint (0 errors), 116 unit/route/security tests, clean production build, 103 release checks (HTTP, headers, browser/CSP, sitemap, 404s, links, journey) with 0 failures, dependency advisories cleared, artifact contains the patched framework code. **It is not a production PASS:** headers, TLS, edge limits, payments and the live application dependency cannot be verified here, and the two externally reported HIGH findings remain NOT VERIFIED.

## 2. Per-finding status
| ID | Orig. | Final technical status | Production verification still required |
|---|---|---|---|
| SEC-001 CSP | MEDIUM | FIXED-LOCAL (app-owned nonce CSP) | header live, no console violations |
| SEC-002 TanStack GHSA-qx66-fv34-fjm8 | MEDIUM | FIXED-LOCAL (1.168.60 / 1.169.39; artifact marker) | deployed image built from this lockfile |
| SEC-003 seroval | LOW | FIXED-LOCAL (1.7.7) | — |
| SEC-004 other advisories | LOW | FIXED-LOCAL (osv/bun audit clean) | re-scan at release |
| SEC-005 forms | MEDIUM | FIXED-LOCAL (no CAPTCHA) | edge `limit_req`/`nginx -t`; staging test |
| SEC-006 PII in URL | LOW | FIXED-LOCAL | staging booking test |
| SEC-007 drift | MEDIUM | OPEN — RC prepared | deployment |
| SEC-008 TLS | — | NOT VERIFIED | clean-network check |
| SEC-009 HSTS | INFO | unchanged | preload decision |
| SEC-010 COOP/CORP/cache | LOW | PARTIAL (COOP + caching; CORP deliberately omitted) | — |
| SEC-011 banner | INFO | FIXED-LOCAL (edge file only) | after nginx reload |
| SEC-012 security.txt/soft 404 | LOW | FIXED-LOCAL | monitored contact; renew by 2027-05-01 |
| SEC-013 supply chain | LOW | PARTIAL (CI audit added; digest/SHA pinning not done) | follow-up |
| SEC-014 positive controls | INFO | PRESERVED | — |
| HIGH #1, HIGH #2 (external) | HIGH | **NOT VERIFIED** (unchanged) | original scanner report |
| SEO-001 soft 404 | High | FIXED-LOCAL | 4 probes after deploy |
| SEO-002 font | Medium | FIXED-LOCAL (Cirqua file still pending licence asset) | — |
| SEO-003 drift | Medium | OPEN — RC prepared | deployment |
| SEO-004 orphans/plans | Low–Med | FIXED-LOCAL | — |
| SEO-005 titles | Medium | FIXED-LOCAL (45 → 0) | Search Console CTR (weeks) |
| SEO-006 placeholders | Medium | FIXED-LOCAL | — |
| SEO-007 authority | Medium | PARTIAL (platform section + backlog) | editorial project |
| SEO-008 lengths | Low | FIXED-LOCAL | — |
| SEO-009 lastmod | Low | OPEN | — |
| SEO-010 `?framework=` slugs | Low | OPEN | — |
| SEO-011 trailing slash | Low | PARTIAL (nginx 301 in repo file) | after reload |
| SEO-012 schema polish | Low | OPEN | — |
| SEO-013 `en-AU`/OG | Low | OPEN | — |
| SEO-014 homepage meta | Low | FIXED-LOCAL | — |
| SEO-015 weight/caching | Medium | FIXED-LOCAL (home 1607→383 KB mobile, 2360→477 KB desktop, lab) | re-measure live |
| SEO-016 Google Fonts | Low | FIXED-LOCAL | legal text update |
| SEO-017 target size | Low–Med | OPEN | manual WCAG 2.5.8 review |
New defects found and fixed during remediation: `/plans/*` 307 redirect to `?billing=monthly` (on `main`); `/start` "One active framework" stale copy (on `main`); WCAG 2.5.3 label-in-name mismatches; `/platform` third 1.27 MB PNG; three ~1 MB framework logos.

## 3. Remaining blockers (before production)
1. **Application dependency:** NOVA app release that honours `plan`/`billing_cycle` on `/register`, and a live backend manifest matching "all available frameworks" — not verifiable here.
2. **Legal text:** cookie policy still states Google Fonts is used (now inaccurate); legal owner must update/re-version.
3. **Server1:** edited vhost needs `nginx -t` and manual install; live vhost unknown; no second CSP.
4. **Docker image build** not run (daemon unresponsive); **Playwright** not available.
5. **Approvals** and a deployment window; Brevo/CRM credentials untouched.
6. **Security contact:** confirm `compliance@eredox.com` is monitored for vulnerability reports.
7. Information still missing: original scanner report (two HIGH findings), Search Console/Bing data.
8. Lab note: lab LCP on framework pages is dominated by the first-visit cookie banner (design/legal decision).

## 4. Tests passed / failed / skipped
Passed: typecheck; lint (0 errors / 7 baseline warnings); 21 test files / 116 tests (33 new); build; `osv-scanner`; `bun audit`; gitleaks; `verify-release` 103/103 (HTTP + headless Chrome desktop & mobile); Lighthouse (11 runs; one additional run failed to complete and was discarded). Failed: none outstanding (during development: 15 `verify-release` failures were fixed; `vite.config.ts` typing error fixed). Skipped / not run: Docker build, `nginx -t`, Playwright, tablet/menu interaction, manual accessibility, any production/staging/NOVA-application/payment test, real-user CWV.

## 5. Next actions
Review the branch → decide on the application-release dependency → legal text → Server1 preflight (`nginx -t`, vhost, digest) → approve and run the deployment per `NOVA_WEBSITE_RELEASE_READINESS.md` → post-deploy verification → Search Console monitoring → editorial programme.
