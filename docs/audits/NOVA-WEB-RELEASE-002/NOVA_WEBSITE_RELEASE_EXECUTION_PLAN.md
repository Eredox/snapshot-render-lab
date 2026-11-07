# NOVA-WEB-RELEASE-002 — Production release execution plan

**Status: PREPARED, NOT AUTHORISED, NOT EXECUTED.** Every step that changes production needs the named person's explicit go at the moment of execution. This plan changes nothing by itself. It reuses the application team's governed path (`NOVA-SIGNUP-001_Coordinated_Deployment_And_Acceptance.md`, `NOVA-DELIVERY-002`) and the website's `DEPLOYMENT.md`; where they differ this plan states which wins.

## 1. Release manifest (what is being released)
| # | Item | Value | Status |
|---|---|---|---|
| 1 | Website source | `remediate/nova-web-remediate-001`, code identical from `c01e4e6`; documentation commits after it. Base `origin/main` `c01d8f6`. Proposed tag after approval: `release/nova-web-<date>` on the approved commit | local only, unpushed |
| 2 | Application source | `origin/main` `6ae312e` contains the signup contract. **Release record on file:** `nova-main-f6663d3-ci-41740000023` (backend `sha256:5394c2c6…d1f4`, frontend `sha256:572ad704…d3dc4`, no migration, Alembic head `f6c8d0e2a4b3`), "production approval pending" | the website does **not** need this record deployed for registration |
| 3 | Required application / backend manifest | Plan manifest **2026-10-26**, SHA-256 `4361bfe4df719a85519cc4cef96bbf56fd7161f29209dd7e0a6d1e3607b692cf` (identical in website and application source). Production backend value **NOT VERIFIED** — confirm with `scripts/operations/inspect-production-readonly.sh` on Server1 before step 3 | open |
| 4 | Compatibility dependencies | Application `/register` & `/login` honour `plan`+`billing_cycle` — **VERIFIED live 2026-11-08**. Checkout available — **NOT AVAILABLE** (see §2). Application CSP/Auth0 unaffected | |
| 5 | Website deployment image | Build on the build host from the approved commit: `docker build -t nova-public-website:<commit> .` — local test image `nova-web-rc:c01e4e6` (`sha256:fa9bb995…6854`) is **not** the artifact to ship (not pushed, built on a workstation); record the production image digest at build time | to do |
| 6 | Nginx changes | `ops/nginx/www.nova.eredox.com.conf` by diff (Security doc §3.3); validated on 1.27.5 in a disposable environment only | operator, Server1 |
| 7 | Legal publication | Cookie-policy wording (Legal doc §2) published **in the same window** | legal owner |
| 8 | Subscription / checkout | §2 | Founder |
| 9 | Database / configuration | **None for the website** (no DB, no migrations). Environment: unchanged variables, never overwritten. Application side: no migration in `f6663d3`; if a different application release is chosen, re-check Alembic lineage | |
| 10 | Backup & rollback evidence | §6 | to record |

## 2. Can the website go first, together, or after?
| Option | Registration | Checkout | Verdict |
|---|---|---|---|
| A. Website alone, now | Works (application already live with the contract) | Visitors reach "Odoo checkout is not configured." after signing in | Technically safe, commercially a dead end for paid plans. Only with the Founder's recorded acceptance |
| B. Website after checkout is enabled in production | Works | Works only after: Odoo integration enabled, `nova_subscription` 19.0.1.17.0 on Server2 (governed upgrade), Payment Terms legal document published, platform administrator exists (`PLATFORM_ADMIN_EMAILS`), operator approval gate (decision O-3, O-4, O-7), Stripe TEST→live approval, six-plan matrix run on the immutable images in TEST, DR-169 backup/restore gate closed. **Separate approvals — not part of this package** | Recommended default |
| C. Website with paid CTAs temporarily replaced by "Request access/Contact" | Works | n/a | Needs a code change and new tests — **not built**; offer only if the Founder wants a staged launch |
| D. Website before the application release | — | — | Not applicable: the application release carrying the contract is already live |

**Recommendation:** B; if time-to-market matters, decide between A and C explicitly. The website must **not** be published on the assumption that checkout works.

## 3. Sequence (assuming option A or B, after all conditions in the readiness doc §5)
| Step | Owner | Action | Gate / evidence |
|---|---|---|---|
| 0 | Founder | Written go for the window; choose option A/B/C | recorded decision |
| 1 | Engineer | CI green on the approved commit (lint, typecheck, test, build, `bun audit`) with bun 1.2.17; confirm `bun install --frozen-lockfile` passes in CI | CI run URL |
| 2 | Build host | Build image from the commit; check artifact marker `MAX_PENDING_SERIALIZATION_RECORDS` present / `getDefaultSerovalPlugins` absent; run `node scripts/verify-release.mjs --base http://<container> --browser` (expect 103 checks, 0 FAIL); record digest | outputs filed with release record |
| 3 | Operator | On Server1 **read-only**: `inspect-production-readonly.sh`; record running website image tag/digest and the live application digests, application plan-manifest version, `ODOO_INTEGRATION_ENABLED`; diff live vhost against `origin/main` | file with release record |
| 4 | Application owner | Confirm no application deployment is pending that would change `/register`; run `verify-signup-journeys.mjs` against production (without `--idp-banner`) → `RESULT PASS` | output |
| 5 | Operator | Tag the **currently running** website image (rollback), keep it untouched | `docker images` line |
| 6 | Legal owner | Approve cookie-policy text and version; the text is committed in the same release commit or a prior one | approval note |
| 7 | Operator | Install the vhost change: dated copy of current vhost → new file → `nginx -t` with real certificates → **no second CSP** → keep reload for step 9 | `nginx -t` output |
| 8 | Operator | Switch `nova-public-website` to the new image on the private edge network (port unpublished); wait for `healthy` | `docker inspect` health |
| 9 | Operator | `nginx -s reload` | |
| 10 | Engineer | Post-deploy probes (GET/HEAD): Security doc §6 and Release-readiness (REMEDIATE-001) §8; `verify-release.mjs --base https://www.nova.eredox.com` (HTTP only, no `--browser`); every security header exactly once; 4 unknown-URL 404s; `security.txt` text/plain; `/pricing/` 301 | outputs |
| 11 | Founder | Acceptance per application doc §4 (browser, no payment; stop before any "Continue" that charges); phone-width check | screenshots |
| 12 | Engineer | Submit the updated sitemap in Search Console; schedule Pages/soft-404, CWV, crawl-stats review at 1, 4 and 8 weeks. **No ranking claim is made from any local test** | |

## 4. Abort criteria (any one → roll back, do not push on)
Container unhealthy after 3 minutes · any security header duplicated or CSP absent · console CSP violations on the 11-page browser check · `/` or `/pricing` not 200 · registration links not on `nova.eredox.com` · verifier `RESULT FAIL` against production application pages · form POST test (staging only) not 202/415/403/429 as specified · Founder rejects acceptance.

## 5. Post-deployment verification (read/probe only)
As §3 step 10. **Never** submit the live contact/booking forms or any registration; use staging with disposable data for form delivery, and a Founder-owned test identity for the single manual registration if one is wanted.

## 6. Backup and rollback evidence required before step 8
* Website: previous image tag + digest recorded and still present on the host; previous vhost file copy with timestamp; environment file untouched (checksum noted, not contents).
* No database, no migrations, nothing to restore. In-memory rate-limit state resets on restart (acceptable).
* Application: unchanged by this release. If it is deployed in the same window, use the application's own rollback (**database restore plus previous image pair**; image-only rollback is **not** sufficient once migrations run — `NOVA-LIVE-006` §4), and the pre-deploy dump, which must satisfy the 24 h freshness rule; restore-test currency (168 h) was **unverified** at 1 Nov.
* Rollback command (website): switch the container back to the recorded previous image, restore previous vhost, `nginx -t`, reload, re-run probes. Time expected: minutes.

## 7. What must not be touched
Odoo CRM and Server2, Stripe (no new price/product/checkout), Auth0 tenant, DNS, production secrets and env files, live databases, the application's data and subscription authority, other services on Server1. This plan never asks for any of them to be changed.

## 8. Open decisions (owner)
Option A/B/C (Founder) · legal wording and version (legal owner) · security-contact designation (Founder/legal) · CAPTCHA decision (Founder) · whether to pin base-image digest and Action SHAs now or later (engineering) · who holds Server1 access for steps 3, 5, 7–9 (operator).

## 9. Git state at preparation time
Branch `remediate/nova-web-remediate-001`; commits since `0325f08`: `c01e4e6` (code) and the documentation commit for this folder. Tag `rc/nova-web-remediate-001` unchanged. Nothing pushed, merged or deployed. The audit folder `NOVA-WEB-AUDIT-001/` is unchanged.
