# NOVA-WEB-RELEASE-002 — Application compatibility

Date 2026-11-08 · Website branch `remediate/nova-web-remediate-001` · Evidence labels: **[LIVE]** public production page read in a browser (no form submitted, no sign-in, no payment) · **[SOURCE]** NOVA application source read from `origin/main` (`6ae312e`, read-only `git show`/`git grep`; no application worktree touched) · **[TEST]** automated test run in a scratch copy · **[DOC]** statement in an application-repository document, not re-verified here · **[NOT VERIFIED]**.

## 1. Result in one paragraph
The website's `plan` and `billing_cycle` parameters **match the live application's contract**, and the live application **honours them today** for every self-service plan, monthly and annual, with Enterprise correctly routed to a quotation. The dependency recorded in NOVA-WEB-REMEDIATE-001 ("the NOVA app must be released") was therefore **already satisfied on the registration side**: the production frontend was updated on 3 Nov 2026, after the 2 Nov journey report that described the 5 Oct release. What remains unavailable in production is **paid checkout** (Odoo integration is disabled and checkout is not authorised); see §6.

## 2. Release reconciliation (Phase A)
| Item | Finding | Evidence |
|---|---|---|
| Website repo / branch / HEAD | `remediate/nova-web-remediate-001`; HEAD was `0325f08` as expected, now `c01e4e6` plus the documentation commit that carries this folder; tag `rc/nova-web-remediate-001` still points at `0325f08` | `git log`, `git tag` |
| Nine remediation commits | Present and in order (`1d42add` … `0325f08`) | `git log --oneline` |
| Original audit preserved | `docs/audits/NOVA-WEB-AUDIT-001/` (five reports) unchanged since commit `1d42add`; the primary checkout's untracked folder with raw evidence was not touched | `git diff 1d42add HEAD -- docs/audits/NOVA-WEB-AUDIT-001` is empty |
| `origin/main` (website) | `c01d8f6` (PR #17 merge); unchanged since the remediation started | `git ls-remote` |
| Production website | **Still the 22 Oct build**: `pricing-Dvd4PnW4.js` unchanged; `/zz-live-404-check` still answers 200 (soft 404); `/.well-known/security.txt` answers 200 with HTML; no CSP header | [LIVE] 8 GETs on 2026-11-08 |
| Application `origin/main` | `6ae312e` (PR #234, 7 Nov). Contains the signup work (`2b28498`, `eb11260`, `077712c` are ancestors) | [SOURCE] |
| Application release candidate on record | `releases/nova-main-f6663d3-ci-41740000023.json` (NOVA-CHECKOUT-007F): backend `sha256:5394c2c6…d1f4`, frontend `sha256:572ad704…3944d3dc4`, Alembic head `f6c8d0e2a4b3`, no migration, status "candidate; production approval pending". Readiness snapshot of 4 Nov: **"Not ready for production mutation"** (DR-169 offsite backup/restore gate open) | [DOC] |
| Application actually in production | Frontend served at `nova.eredox.com` has `Last-Modified: Tue, 03 Nov 2026 06:30:58 GMT`, asset `index-D3eLCPLy.js`; that bundle contains the signup copy ("We could not read your plan selection", "Continue to subscribe to", "Enterprise is arranged by quotation"). The timestamp coincides with release record `nova-main-83e82d4-ci-41590147136` (NOVA-CHECKOUT-007, built 03 Nov 06:28 UTC) — **inferred, not proven**. `/health` reports version `1.0.0`, environment `production`, `/health/ready` all required checks `ok`. The exact image digests running on Server1 are **NOT VERIFIED** (no Server1 access was used) | [LIVE] 2 GETs + bundle string search |
| Backend manifest | Application source: `PUBLIC_PLAN_MANIFEST_VERSION = "2026-10-26"`, hash test `4361bfe4…92cf` — identical to the website's `canonical-plan-manifest.ts`. The manifest **running in production** has no public endpoint and is NOT VERIFIED; it is implied by the 3 Nov frontend plus the 2026-10-26 plan copy now shown on the app, but must be confirmed with `inspect-production-readonly.sh` | [SOURCE] |
| Release / rollback procedures found | Website: `DEPLOYMENT.md`, `NOVA-WEB-REMEDIATE-001/…RELEASE_READINESS.md` §6–§8. Application: `docs/operations/NOVA-SIGNUP-001_Coordinated_Deployment_And_Acceptance.md`, `NOVA-LIVE-005` §7, `deliver-nova-release.ps1` / `prepare-nova-release-preflight.ps1` / `deploy-nova.ps1 -Execute` | [DOC] |

## 3. The contract (Phase B) — what the application accepts
| Aspect | Application behaviour | Evidence |
|---|---|---|
| Plan identifiers | `free, launch, growth, professional, business` (self-service). Case-sensitive: `Growth` is rejected. `enterprise` is never self-service | `planSelection.ts`; `SELF_SERVICE_REGISTRATION_PLANS` in `services/oidc.py` [SOURCE] |
| Billing identifiers | `monthly` or `annual`; anything else (`weekly`, missing) → "We could not read your plan selection", no form. `free` is forced to `monthly` (backend rejects free+annual) | `parseSelfServicePlanSelection`; `OidcRegistrationStart._validate_free_cycle` [SOURCE] |
| Registration | `/register?plan=&billing_cycle=` → form → `POST /api/v1/auth/oidc/register/start` with `plan`, `billing_cycle`, `idempotency_key` (Pydantic `Literal` validation) | [SOURCE] |
| Persistence across authentication | The selection is stored **server-side** in the Redis OIDC transaction (`registration_plan/billing_cycle`), survives the identity-provider round trip, is bound into a one-time hand-off, and is returned by `POST /auth/oidc/complete` as `registration_selection`. The browser never has to carry it through Auth0 | `api/auth.py` L186, L286-L339, L382-L414 [SOURCE] |
| Returning customers | `/login?plan=&billing_cycle=` passes `continuation_plan/continuation_billing_cycle` (validated lower-case, same plan set, free→monthly, cannot be combined with a registration intent) through the same transaction | `oidc.py` L283-L296 [SOURCE] |
| Post-authentication navigation | `OidcCallback` → `buildCustomerJourneyPath`: Free → `/onboarding`; paid → `/checkout?plan=&billing_cycle=`; Enterprise → `/help` | `OidcCallback.tsx`, `planSelection.ts` [SOURCE] |
| Entitlement | A paid selection is **only a checkout intent**; the tenant starts on the canonical Free entitlement (`provision_oidc_registration` docstring). URL parameters are never prices or entitlement state | [SOURCE] |
| Billing configuration | Checkout requires the Odoo integration; without it the API answers "Odoo checkout is not configured." (`CheckoutError code=invalid_configuration`) | `services/checkout.py` L34, L98 [SOURCE] |
| Legal consent | Registration shows a notice with links to Terms and Privacy (informational). Checkout requires an explicit Payment Terms acceptance (`createLegalAcceptance`, scope `contractual_acceptance`) **and** a separate recurring-payment authorisation (`recurring-payment-v1`); the server rejects the request without both | `Register.tsx` L173; `Checkout.tsx` L156-L189; `checkout.py` L214-L217 [SOURCE] |

## 4. Compatibility matrix — website link → live application page
Website link column from the local release candidate (`/pricing` buttons, verifier steps "site pricing …"); application column from the live production pages ([LIVE], read-only verifier, desktop **and** 375 px mobile, 65 steps PASS desktop, 76 steps PASS mobile, 0 FAIL in both; see `evidence/app-register-verifier-*.txt`).

| Plan | Cycle | Website link target | App register page (live) | Interval stated | Button | Result |
|---|---|---|---|---|---|---|
| Free | monthly (annual toggle keeps monthly) | `register?plan=free&billing_cycle=monthly` | "Create your Free workspace" | n/a | Create Free Workspace | **PASS** |
| Launch | monthly | `…plan=launch&billing_cycle=monthly` | "Subscribe to Launch" | monthly | Continue to subscribe to Launch | **PASS** |
| Launch | annual | `…plan=launch&billing_cycle=annual` | "Subscribe to Launch" | annual | same | **PASS** |
| Growth | monthly / annual | `…plan=growth…` | "Subscribe to Growth" | monthly / annual | Continue to subscribe to Growth | **PASS** ×2 (annual also read directly in the browser pane) |
| Professional | monthly / annual | `…plan=professional…` | "Subscribe to Professional" | monthly / annual | Continue to subscribe to Professional | **PASS** ×2 |
| Business | monthly / annual | `…plan=business…` | "Subscribe to Business" | monthly / annual | Continue to subscribe to Business | **PASS** ×2 |
| Enterprise | n/a | `/request-quote?plan=enterprise` | `/register?plan=enterprise…` → "Enterprise is arranged by quotation", link to the website quote page, **no form** | n/a | Request a Quote | **PASS** |
| Invalid | — | `?plan=growth`; `billing_cycle=weekly`; `plan=gold`; `billing_cycle=annual` only; `plan=Growth` | "We could not read your plan selection", no form | — | — | **PASS** ×5 (stops instead of becoming Free) |
| Bare `/register` | — | — | explicit Free form | — | — | **PASS** |
| `/login` | Growth annual / Free / unreadable | — | "You selected Growth with annual billing. Sign in to review your order." / Free notice / warning, normal sign-in | — | — | **PASS** ×3 |

Pricing figures: website manifest (USD) Free 0, Launch 99/990, Growth 249/2,490, Professional 499/4,990, Business 799/7,990 equals the application catalogue in `docs/operations/release-candidate/NOVA_SIX_PLAN_ACCEPTANCE_MATRIX.md` [DOC]. No Stripe price, product or checkout service was created or changed by this package.

## 5. Application-side automated tests (scratch copy of `origin/main` frontend, `npm ci`, outside every worktree)
`Register.test.tsx`, `Login.test.tsx`, `Checkout.test.tsx`, `OidcCallback.test.tsx`, `planSelection.test.ts`, `Subscription.test.tsx` and `src/content/*`: **9 files, 83 tests passed**. One transient module-resolution error on the first run of `Subscription.test.tsx` (`@mui/icons-material/CheckCircle` exists on disk) disappeared on the immediate re-run (13/13 pass). Backend tests, the six-plan entitlement matrix and Alembic checks were **NOT RUN** here (they need the application's Postgres/Redis stack).

## 6. Production application dependencies still open
1. **Paid checkout is not available in production.** `ODOO_INTEGRATION_ENABLED=false` on Server1 at the last inspection ([DOC] NOVA-LIVE-006, 1 Nov); the 3 Nov release record states "global_odoo_integration: remain disabled", "no general checkout or website publication", and `nova_subscription` on Server2 was 19.0.1.16.0 vs repository 19.0.1.17.0. Result for a visitor: **Subscribe → register (works) → sign in → `/checkout` → "Odoo checkout is not configured."** The application's own coordinated-deployment document calls this the "safe, expected result"; it is nevertheless a dead end for a paying visitor. **Not verified live** (needs an authenticated session; none created).
2. Checkout needs a published **Payment Terms** legal document (legal document versions: none at 1 Nov) and Founder/platform administrator accounts (allowlist empty at 1 Nov). [DOC]
3. Stripe is in **test** mode in the production Odoo provider table [DOC]; live mode needs its own approval.
4. **Auth0 development-keys banner (finding F7)** — status NOT VERIFIED (the check requires pressing "Sign in with Eredox", which creates an identity-provider transaction in production; not done).
5. The application release that best matches "approved": record `f6663d3` (candidate, production approval pending) → it contains no migration, so website publication does not depend on it for registration, only for the checkout/TEST scope it adds.

## 7. Stripe / Odoo TEST evidence
No Stripe or Odoo TEST payment was executed in this package. The application repository's matrix lists TEST runs for Launch monthly and Professional monthly (earlier UAT, databases since replaced) and "to run" for every annual cycle, Growth and Business [DOC]. **End-to-end Stripe acceptance is therefore NOT claimed.** The approved method is `NOVA_SIX_PLAN_ACCEPTANCE_MATRIX.md` §4 on the UAT stack with Stripe TEST account and the UAT Odoo database only; that stack was not started here.
