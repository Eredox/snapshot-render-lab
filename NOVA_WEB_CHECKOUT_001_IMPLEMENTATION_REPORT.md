# NOVA-WEB-CHECKOUT-001 Implementation Report

Date: 2026-10-19  
Status: **UI routing implemented; governed commercial handoff implemented; payment integration not complete**

## Scope and source ownership

The public pricing page is owned by `Eredox/snapshot-render-lab`, not by the
authenticated NOVA application repository. The documented public site is
`novadatatrust.com`; the application registration and authenticated subscription
journey are served by NOVA.

Repositories and commits used for this change:

| Repository | Branch | Baseline | Implementation commit |
|---|---|---|---|
| `Eredox/snapshot-render-lab` | `codex/nova-web-checkout-001` | `ee67bdb0fb5a02f404dc3d2871a90f763d19cde9` | recorded after this report is committed |
| `Eredox/nova-compliance-os` | `codex/nova-comm-001-stage1` | `509bdcdabfff0e7acf3171c6f24112890b8d59bb` | `ec8eeffaaef2a179af2e5e5b01404cda149484b7` |

The NOVA worktree also contains five pre-existing untracked governance and
discovery documents. They were not staged or modified.

No provider requests, live payments, production changes, credentials, pushes,
merges or deployments were performed.

## Implemented changes

### Public website

Changed files:

- `src/data/pricing.ts`
- `src/config/site.ts`
- `src/routes/pricing.tsx`
- `src/routes/plans.$slug.tsx`
- `src/data/pricing.test.ts`
- `src/lib/__tests__/launch-invariants.test.ts`

The public catalogue now presents the Founder-approved USD values:

| Plan | Monthly | Annual | CTA |
|---|---:|---:|---|
| Free | $0 | $0 | Get Started Free |
| Launch | $99 | $990 | Get Started |
| Growth | $249 | $2,490 | Get Started |
| Professional | $499 | $4,990 | Get Started |
| Business | $799 | $7,990 | Get Started |
| Enterprise | Custom | Custom | Contact Sales |

Annual display remains the full annual charge; the monthly equivalent is not
used as the amount to charge.

For Free and the four paid plans, the pricing page now links to the NOVA
registration entry point with only validated intent:

`?plan=<plan-slug>&billing_cycle=<monthly|annual>`

The public site does not send an amount, currency, Stripe object ID, customer
identifier or entitlement state. Free is normalised to the non-billed monthly
path. Enterprise remains `/request-quote?plan=enterprise` and is not routed to
self-service registration. The billing toggle has explicit accessible labels
and `aria-pressed` state.

Plan-detail CTAs use the same routing contract, so the pricing page and detail
pages cannot silently diverge.

### NOVA application

Changed files:

- `frontend/src/services/planSelection.ts`
- `frontend/src/services/planSelection.test.ts`
- `frontend/src/pages/Register.tsx`
- `frontend/src/pages/Register.test.tsx`
- `frontend/src/pages/Login.tsx`
- `frontend/src/pages/Subscription.tsx`

The application validates the plan and billing cycle against the five allowed
self-service plans. Enterprise, unknown plans and invalid cycles are rejected.
Registration and login preserve the validated selection into
`/subscription?plan=...&billing_cycle=...`. The subscription screen presents the
existing governed plan-change confirmation flow; no API call is made merely by
following a link, and the existing Odoo-authoritative entitlement boundary is
unchanged.

The implementation deliberately ignores client-supplied prices. It does not
add a public checkout-session creator or a second billing authority.

## Existing backend boundaries verified

The relevant existing NOVA endpoints are:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/subscription/`
- `POST /api/v1/subscription/changes`
- `POST /api/v1/subscription/changes/{change_id}/retry`
- `POST /api/v1/billing/webhook` (server-to-server Stripe webhook only)

The subscription change path validates the request and records governed intent;
paid entitlement remains dependent on the approved Odoo commercial authority.
The billing module explicitly retires tenant-facing checkout-session and portal
creation. The preserved webhook verifies Stripe signatures but is not evidence
of a complete public purchase flow.

The Odoo integration remains the commercial and invoicing authority. No NOVA
invoice authority, parallel Stripe Billing flow, or public Odoo service-identity
endpoint was introduced.

## Before and after CTA behaviour

| Plan | Before | After |
|---|---|---|
| Free | Direct registration labelled `Start Free` | Direct registration labelled `Get Started Free`, carrying `plan=free` and monthly billing intent |
| Launch | Contact/Sales route | NOVA registration with `plan=launch` and selected interval |
| Growth | Contact/Sales route | NOVA registration with `plan=growth` and selected interval |
| Professional | Contact/Sales route | NOVA registration with `plan=professional` and selected interval |
| Business | Contact/Sales route | NOVA registration with `plan=business` and selected interval |
| Enterprise | Quote/contact route | Contact Sales quote route preserved |

## Test evidence

All tests used local code and synthetic inputs. No external provider or email
delivery was exercised.

### Website repository

- Focused pricing and manifest tests: **6 passed**.
- Full website suite after updating the affected launch invariant: **74 passed** across 16 files.
- Typecheck: **passed**.
- Lint: **passed**, with 7 pre-existing warnings and no errors.
- Production build: **passed**. Existing warnings concern route-test files being scanned as routes, a Vite path-plugin notice and runtime font resolution.
- `git diff --check`: **passed**.

### NOVA application repository

- Focused plan-selection and registration tests: **8 passed** across 2 files.
- Application production build: **passed**.
- Lint: **passed**, with 2 pre-existing fast-refresh warnings and no errors.
- Full application suite: **not a passing result**. The attempted run reported unrelated existing failures in `TrustQuestionnaires.test.tsx` (bounded page-two request) and `App.portal.test.tsx` (ordinary customer portal access), then was stopped after no further progress. It must not be represented as a full-suite pass.
- No backend test was required by this change because no backend source was modified; the existing backend authority was inspected rather than replaced.

## Security and governance assessment

Implemented:

- No trust in client-provided price or Stripe identifiers.
- Plan and interval are allow-listed and revalidated in the application.
- Enterprise cannot enter the self-service path.
- No entitlement activation from a registration link or redirect.
- Existing Odoo authority, authenticated access and confirmation flow preserved.
- No credentials or secrets added to source.
- No change to TLS, production defaults, DR holds, Stripe products or provider configuration.

Not implemented or not proven:

- No public Stripe Checkout session creation endpoint currently exists in the
  approved NOVA architecture.
- No verified Stripe Sandbox payment was executed.
- No Odoo transaction/invoice/reconciliation evidence was produced.
- Payment failure, delayed webhook, refund, cancellation and retry behaviour
  remain provider/runtime acceptance work.
- No production entitlement activation was tested.

Therefore this change is a **routing and governed handoff correction**, not a
completed payment integration and not production-release approval.

## Remaining dependencies and next stage

Before self-service paid purchasing can be declared complete, an authorised
engineering stage must provide and verify:

1. The approved Odoo-mediated checkout/payment interface, or a documented
   compatible provider adapter that does not create a parallel authority.
2. Sandbox-only Stripe product/price mapping and restricted secret injection.
3. Verified webhook endpoint, signature validation, idempotency and replay
   handling tied to Odoo commercial state.
4. Sandbox evidence for successful payment, failure, cancellation, delayed
   webhook, duplicate submission and reconciliation into Odoo/NOVA.
5. Legal/payment-term acceptance evidence and final release approval.
6. Resolution or explicit disposition of the unrelated full application test
   failures listed above.

The exact next step is a separately authorised, sandbox-only Odoo/Stripe
integration verification against the existing commercial authority. Until that
evidence exists, paid CTAs are correctly routed to the governed NOVA journey,
but the purchase flow remains not complete.

## Release status

The website branch contains only the intended pricing, CTA, routing, tests and
this evidence report. The NOVA application commit is local and unpushed. No
merge, deployment, live payment, production mutation or release approval was
performed. NOVA-COMM-001, DR-169 and DR-170 remain under their existing HOLD
gates.
