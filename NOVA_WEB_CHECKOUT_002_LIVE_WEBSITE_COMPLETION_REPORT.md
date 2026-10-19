# NOVA-WEB-CHECKOUT-002 Live Website Completion Report

Date: 2026-10-19  
Decision: **Not deployed; release blocked by the governed app/payment path**

## 1. Reconciled source and commits

The public website source is `Eredox/snapshot-render-lab`. The authenticated
registration and subscription authority is `Eredox/nova-compliance-os`.

| Source | Branch | Baseline | Local reviewed commits |
|---|---|---|---|
| Public website | `codex/nova-web-checkout-001` | `ee67bdb0fb5a02f404dc3d2871a90f763d19cde9` | `52aa5a3`, `b9fe860` |
| NOVA app, isolated release candidate | `codex/nova-web-checkout-002-app` | `e30be6487533e85eb846fe41e67488c35260d5b5` | `41ff812`, `8382a8b` |

The previously reported `codex/nova-comm-001-stage1` branch remains intact and
was not pushed or overwritten. Its unrelated 36 commits and five untracked
governance documents were not included in the isolated app candidate.

## 2. Changes reused and added

Reused from WEB-CHECKOUT-001:

- USD pricing catalogue and annual full-charge presentation.
- Free, paid self-service intent and Enterprise Contact Sales routing.
- Plan/interval-only registration handoff.
- NOVA registration/login interval preservation and governed subscription page.
- Existing Odoo commercial authority and fail-closed entitlement boundary.

Added in this stage:

- Remaining public commercial copy no longer describes fixed-price plans as
  indicative or sales-only.
- The isolated NOVA app candidate now exposes canonical `USD` currency metadata
  in the public plan manifest, commercial activation snapshots, subscription
  snapshots and proration output.
- Manifest version is `2026-10-19` with verified hash
  `340f92a5b9a50d9ce95bb832dde31c99718f4bc3db1397f33db1e8b40575e5ca`.

No Stripe product, price, secret, webhook, Odoo production record or payment
endpoint was created or changed.

## 3. Actual checkout capability

The current approved application has:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/subscription/`
- `POST /api/v1/subscription/changes`
- `POST /api/v1/billing/webhook` for signed server-to-server compatibility

It does not have an approved public checkout-session creator or a verified
Odoo-mediated payment initiation endpoint. The subscription change endpoint
records governed intent; it is not evidence of payment, invoice creation,
reconciliation or paid entitlement activation.

Accordingly, the live paid CTA is not yet a completed payment checkout. The
website must not be published against the current live app until the isolated
app candidate is reviewed and deployed through the application release process,
and the approved payment interface is available and tested.

## 4. Verification results

Website repository:

- Full Vitest suite: **74 passed across 16 files**.
- Typecheck: **passed**.
- Lint: **passed**, 7 pre-existing warnings, 0 errors.
- Production build: **passed**, with existing route-generator/font/chunk warnings.
- Diff check: **passed**.

Isolated NOVA app candidate:

- Focused plan-selection/registration tests: **8 passed**.
- Frontend build: **passed**.
- Frontend lint: **passed**, 2 pre-existing warnings, 0 errors.
- Disposable PostgreSQL migration upgrade to Alembic head: **passed**.
- Backend commercial/subscription tests: **53 passed**, 1 pre-existing
  Starlette/httpx deprecation warning.
- Full NOVA suite is not claimed as passing. Existing unrelated failures remain
  in `TrustQuestionnaires.test.tsx` and `App.portal.test.tsx`.

The disposable PostgreSQL, Redis and MinIO services used synthetic credentials
on loopback only. They were not production, staging or customer services.

## 5. Production and live verification

The source deployment architecture is Server1: Nitro `node-server`, container
port 3000 on the private `nova_compliance_edge` network, with Nginx routing
`www.nova.eredox.com` to `nova-public-website:3000`. The repository contains
build and edge configuration, but no authorized Server1 execution session or
deployment credential was available in this workspace.

Read-only live baseline retrieved at `2026-10-19T23:12:16+10:00` from
`https://www.nova.eredox.com/pricing` still contained the old AUD metadata and
indicative-pricing description. No live mutation was attempted.

Live verification: **NO — deployment did not occur**. There is no deployed
release SHA, live corrected pricing evidence, rollback reference for a new
release, or live checkout evidence to report.

## 6. Remaining release gates

1. Push the two isolated branches through GitHub pull requests and wait for
   required CI checks.
2. Review and approve the isolated NOVA app candidate before the website can
   depend on its query-preserving registration behaviour.
3. Provide the approved Odoo-mediated Stripe Sandbox checkout initiation
   contract, restricted configuration and verified webhook endpoint.
4. Execute authorised sandbox evidence for success, cancellation, failure,
   delayed webhook, duplicate submission and Odoo/NOVA reconciliation.
5. Complete legal, tax, payment-terms and production release approvals.
6. Obtain Server1 deployment authorization/access and perform the documented
   immutable build deployment with rollback evidence.
7. Perform read-only browser acceptance of all six plans and both intervals
   after deployment.

No live payment or production entitlement activation may occur before these
gates pass. Enterprise remains Contact Sales. Free remains non-billed.

## 7. Next single engineering action

Open reviewable PRs for the website branch and the isolated NOVA app branch,
then wait for protected CI. Do not deploy the public website until both the
application handoff candidate and the approved payment/accounting acceptance
gates are complete.
