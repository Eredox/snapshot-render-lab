# NOVA-GO-LIVE-CLOSURE-001 — Website closure evidence

Status: **HOLD — source branch updated; no merge or deployment performed**

## Source changes

- `/start` now links **Create Free workspace** to the application route `https://nova.eredox.com/register`.
- Public wording now describes the verified source-level Free registration/onboarding path instead of presenting a disabled or disconnected control.
- Website CI pins Bun to `1.2.17` and the runner to `ubuntu-24.04`; it does not use an unbounded Bun `latest` toolchain.

## Verification

| Check | Result |
|---|---|
| Typecheck | PASS |
| Lint | PASS — 0 errors, 7 existing Fast Refresh warnings |
| Unit/route tests | PASS — 17 files, 97 tests |
| Production build | PASS — existing route-scan/font/bundle warnings remain |
| Live production content | NOT rechecked after source change; branch is not deployed |
| Browser matrix and axe | BLOCKED — no in-app browser runtime available |
| Lighthouse lab | BLOCKED — no approved browser lab/runtime available |
| CSP on live edge | BLOCKED — CSP exists in source Nginx config but was not deployed |
| Production mutation | NO |

The application route itself is implemented on the paired application branch, but the end-to-end Start Free journey remains a review/deployment gate until both branches are merged into an authorised test environment and exercised with disposable data.
