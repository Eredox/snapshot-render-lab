# NOVA-WEB-BUYNOW-001 Completion Report

**Repository:** `Eredox/snapshot-render-lab`
**Worktree:** `C:\Users\alfde\AppData\Local\Temp\snapshot-render-lab-main`
**Branch:** `codex/nova-web-checkout-001`
**PR:** #16
**Status:** Local implementation verified; not pushed, published, deployed, or enabled for live charging.

## Executive result

The existing website acquisition routing is now labelled as directed:

| Plan | Customer action | Destination |
| --- | --- | --- |
| Free | Get Started Free | `https://nova.eredox.com/register?plan=free&billing_cycle=monthly` |
| Launch | Buy Now | `https://nova.eredox.com/register?plan=launch&billing_cycle=monthly` or `annual` |
| Growth | Buy Now | `https://nova.eredox.com/register?plan=growth&billing_cycle=monthly` or `annual` |
| Professional | Buy Now | `https://nova.eredox.com/register?plan=professional&billing_cycle=monthly` or `annual` |
| Business | Buy Now | `https://nova.eredox.com/register?plan=business&billing_cycle=monthly` or `annual` |
| Enterprise | Contact Sales | `/request-quote?plan=enterprise` |

The website sends only the governed plan slug and billing interval. It does not send a price, amount, currency, Stripe object ID, or payment authority from the browser.

This completes the website CTA and selection handoff correction. It does **not** establish that a paid Stripe transaction, Odoo invoice, accounting entry, webhook reconciliation, or entitlement projection has completed.

## Files changed

- `src/data/pricing.ts` — changed the four paid-plan primary labels to `Buy Now`.
- `src/routes/pricing.tsx` — renders the plan's governed `primaryAction.label`, so pricing cards cannot silently use a different label.
- `src/routes/plans.$slug.tsx` — keeps dedicated plan pages consistent with the pricing card labels.
- `src/data/plan-details.ts` — states that Buy Now enters the governed journey and paid activation remains subject to Eredox/Odoo authority and release controls.
- `src/data/pricing.test.ts` — adds the six-plan label contract while retaining the USD catalogue and query-parameter assertions.
- `docs/NOVA_WEB_BUYNOW_001_COMPLETION_REPORT.md` — this evidence record.

No approved HTML email assets, legal documents, production configuration, Stripe products, Odoo data, or unrelated services were changed.

## Existing backend linkage reviewed

The local checkout-003 source branch is `codex/nova-checkout-003` at `a5a679f8e3b0904e1f8bfd91d159c4be6e1fd5db`. Its existing NOVA application contracts are:

- `POST /api/v1/checkout/preview`
- `POST /api/v1/checkout/initiate`
- `GET /api/v1/checkout/{attempt_id}`

The corresponding local Odoo controller contracts are:

- `POST /api/v1/nova-commercial/checkout/preview`
- `POST /api/v1/nova-commercial/checkout/initiate`
- `POST /api/v1/nova-commercial/checkout/status`

The website does not bypass these contracts or create a parallel Stripe path. The existing registration/login handoff in the NOVA application preserves `plan` and `billing_cycle` and routes an authenticated user to `/subscription`.

## Release blockers found in the existing purchasing path

These are specific integration blockers, not reasons to create new infrastructure:

1. The authenticated NOVA route currently reached after registration/login is the existing subscription-management page. It does not yet present a customer-facing payment-element checkout that calls the checkout preview/initiation contract.
2. Odoo checkout initiation requires an existing authoritative `nova.commercial.acceptance.acceptance_id`. The NOVA legal-acceptance event ID is a different record type and must not be substituted. No verified customer-facing NOVA-to-Odoo acceptance binding endpoint was found in the reviewed source.
3. The custom Odoo checkout response returns a Stripe client secret and return URL, but not the non-secret publishable key/configuration needed by a NOVA-hosted native Stripe Payment Element. The NOVA frontend has no Stripe.js dependency or payment-element component in the reviewed branch.
4. The checkout-003 branch is local and its implementation is not the same as the website PR #16 head. No evidence was available in this task that PR #179 or the deployed NOVA application contains the complete payment UI and acceptance bridge.
5. No live or sandbox payment was executed here. Therefore there is no processor transaction, Odoo invoice, USD transaction record, AUD accounting representation, webhook verification, or signed Odoo-to-NOVA projection evidence to authorize paid release.

The website must not present an operational chargeable journey until these gates are resolved and tested through the existing Odoo authority. The `Buy Now` label is a navigation correction, not a claim that payment is enabled.

## Verification performed

Executed in the PR #16 website worktree with existing dependencies and no external service calls:

| Check | Result |
| --- | --- |
| `npm run test` | **PASS** — 16 files, 75 tests passed |
| `npm run lint` | **PASS** — 0 errors, 7 existing Fast Refresh warnings |
| `npm run typecheck` | **PASS** |
| `npm run build` | **PASS** — existing route-tree, font and chunk-size warnings only |
| `git diff --check` | **PASS** — only Git line-ending warnings |

The tests cover the Founder-approved USD values, Free's non-billed monthly handoff, paid monthly/annual selection, exclusion of client-supplied price/amount/currency parameters, Enterprise quote routing, and the new six-plan acquisition labels.

## Published versus local

The verified website PR #16 baseline was `e1fb6f6e591062e56fe5e3a23cb830d78de545ad` before this correction. The correction is committed locally on `codex/nova-web-checkout-001` as `8aaf21b41dca7ca3d40d2af31f3b39aeda2cb5a5`; it has not been pushed, merged, deployed, or published by this task.

The NOVA checkout source was inspected in its existing local checkout only. No NOVA branch, Odoo runtime, production database, Stripe account, webhook, customer record, credential, or entitlement was accessed or changed.

## Exact next execution stage

After the existing NOVA/Odoo owners provide the governed acceptance-binding contract and the verified native Stripe presentation configuration, implement the smallest frontend checkout surface against the existing `/checkout/preview`, `/checkout/initiate`, and `/checkout/{attempt_id}` contracts. Then run isolated mocked failure/replay/idempotency tests followed by one separately authorised Stripe Sandbox Launch transaction with Odoo invoice/accounting and signed projection evidence.

Until that evidence exists, keep paid checkout and entitlement activation behind the existing release, legal, accounting, communications, DR, and Lifecycle Master Section 30 gates.
