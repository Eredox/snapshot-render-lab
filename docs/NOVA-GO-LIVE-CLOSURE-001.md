# NOVA-GO-LIVE-CLOSURE-001 — Website closure evidence

Status: **READY FOR PR #8 MERGE — source updated; website deployment not performed**

## Current launch closure

The paired NOVA application dependency is production live and its public
registration authority is verified:

- NOVA V1 application registration dependency: **PASS**
- Live registration: `https://nova.eredox.com/register`
- Founder browser UAT: **PASS**
- Website production mutation in this work package: **NO**

All customer-facing Free-registration actions now use the centralized
`appUrls.register` value and open the live registration authority directly.
The `/start` route remains an informational SEO page; its primary action is
the direct **Create Free workspace** registration action. Paid plans remain
governed through contact/commercial/Odoo authority; no Stripe checkout or plan
entitlement change is introduced.

## Source changes

- `/start` now links **Create Free workspace** to the application route `https://nova.eredox.com/register`.
- Public wording now describes the verified source-level Free registration/onboarding path instead of presenting a disabled or disconnected control.
- Website CI pins Bun to `1.2.17` and the runner to `ubuntu-24.04`; it does not use an unbounded Bun `latest` toolchain.

## Verification

| Check                   | Result                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| Typecheck               | PASS                                                             |
| Lint                    | PASS — 0 errors, 7 existing Fast Refresh warnings                |
| Unit/route tests        | PASS — 17 files, 97 tests                                        |
| Production build        | PASS — existing route-scan/font/bundle warnings remain           |
| Live production content | NOT rechecked after source change; branch is not deployed        |
| Browser matrix and axe  | BLOCKED — no in-app browser runtime available                    |
| Lighthouse lab          | BLOCKED — no approved browser lab/runtime available              |
| CSP on live edge        | BLOCKED — CSP exists in source Nginx config but was not deployed |
| Production mutation     | NO                                                               |

The website source is ready for protected PR review. The public website was not
deployed in this work package, so live website content and production-edge
browser evidence remain deployment-stage checks rather than claimed source
validation.
