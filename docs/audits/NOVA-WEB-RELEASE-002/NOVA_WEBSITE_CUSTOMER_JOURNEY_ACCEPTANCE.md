# NOVA-WEB-RELEASE-002 — Customer journey acceptance

Date 2026-11-08. **Environment:** website = local build of this branch (loopback, and the same code in the Docker image); application = **production `nova.eredox.com`, public pages only, read-only** (no form submitted, no account created, no sign-in, no payment, no identity-provider transaction). `/api/forms` was stubbed inside the test page, so nothing reached the CRM or Brevo. No disposable application stack was available: it needs the application's Postgres/Redis/identity-provider stack, which was out of scope and not started. Where the journey needs an authenticated application session the step is **NOT TESTED**, and the application's own test suite is cited instead.

Raw outputs: `evidence/app-register-verifier-desktop.txt`, `…-mobile.txt`, `evidence/website-journey-responsive.txt`. Re-runnable with `scripts/journey/*` (see the end).

## 1. The twelve steps
| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | Visitor selects a subscription | **PASS** — all five self-service cards and Enterprise on `/pricing`, monthly and annual | verifier "site pricing monthly/annual … button+link" 14 PASS |
| 2 | Correct plan carried forward | **PASS** — link `register?plan=<id>&…`; app page heading names the same plan for all five | verifier "app register … loads" |
| 3 | Billing interval preserved | **PASS** — annual toggle on `/pricing` yields `billing_cycle=annual` for paid plans; Free stays `monthly`; app page states the interval ("Growth with annual billing") | verifier "states billing interval" ×8; Growth annual also read in the browser pane |
| 4 | Registration initiated | **PASS (page)** — form, fields, terms/privacy notice and "Continue to subscribe to <Plan>" button present. **Submission NOT TESTED** (would start a production identity-provider registration). Application unit tests cover the payload `{email, full_name, tenant_name, plan, billing_cycle, idempotency_key}` | `Register.test.tsx` pass [TEST] |
| 5 | Return from authentication | **NOT TESTED live.** Source: selection held server-side in the OIDC transaction and returned by `/auth/oidc/complete`; `OidcCallback.test.tsx` passes | [SOURCE][TEST] |
| 6 | Selected plan retained | **Source-verified, not exercised live** (as 5). The retention does not rely on the URL surviving Auth0 | see Compatibility §3 |
| 7 | Application recognises the selection | **PASS (page level, live)**; post-login recognition via `registration_selection` is source/test only | |
| 8 | Correct entitlement and checkout path | **PARTIAL.** Path is correct (`/checkout?plan=&billing_cycle=`, Free → `/onboarding`, Enterprise → quotation). Entitlement is correctly **Free until payment is verified** (selection is an intent only). The checkout itself **cannot complete in production** (Odoo disabled) — see Compatibility §6 | `Checkout.test.tsx` pass [TEST] |
| 9 | Legal terms presented where required | **PASS (presence)**: registration notice with Terms/Privacy links on every form page; checkout Payment Terms + recurring-payment authorisation are server-enforced. **Content** of those documents is a legal matter (30-day trial wording in Terms §11 and the AUD liability figure are registered inconsistencies — see Legal Review Items) | [LIVE][SOURCE] |
| 10 | Returning users | **PASS (page)**: `/login?plan=growth&billing_cycle=annual` shows "You selected Growth with annual billing. Sign in to review your order."; Free notice; unreadable → warning and normal sign-in. Redirect after sign-in: source/test only | verifier "app login …" ×3 |
| 11 | Invalid parameters | **PASS** — five malformed selections (`plan=growth` alone, `weekly`, unknown plan, interval only, wrong case) show a stop page with **no form**; bare `/register` is the explicit Free form. Website side: `/plans/<slug>` with missing/odd `billing` no longer redirects (fixed in REMEDIATE-001) | verifier ×6 |
| 12 | Failed or interrupted navigation | **PASS (website)**: see §2 J6 — failed delivery keeps the visitor on the form with a message and preserved values; retry succeeds. **Application side:** unreadable link → "Choose a plan" / "Create a Free workspace instead"; OIDC error redirect → "Sign-in unavailable" with return-to-sign-in (source/test) | |

## 2. Booking confirmation and browser history state (website)
Real `BookingForm` in headless Edge against the local build (also run against the Docker image for the header/CSP suite). Disposable data only (`zed.disposable@example.test`).

| ID | Check | Result |
|---|---|---|
| J1 | Direct load / new tab / shared link of `/book-demo/confirmed` | **PASS** — generic "Your demo request is in", no personal data |
| J2 | Submit (delivery stubbed 202) | **PASS** — lands on `/book-demo/confirmed`, URL has no query/hash and no name/e-mail; details shown; they live only in `history.state`; no resource URL requested by the page contains them |
| J3 | **Refresh** | **PASS** — details survive a reload in the same tab (history.state is retained by the browser for that session entry); still nothing in the URL |
| J4 | Navigate away (`/pricing`) and **Back** | **PASS** — details restored |
| J5 | Back again to `/book-demo` | **PASS** — form usable (values are not persisted, by design) |
| J6 | Delivery failure (stub 502) → error message, values preserved → retry succeeds | **PASS** |
| J7 | Hostile `history.state` (script string, 1,000-char value, bad date/time) | **PASS** — rendered as text, bounded, no element injection |
| J8 | Not preserved when the tab is closed or the link is opened elsewhere | By design (J1) |

Observation (no leak): if the page is submitted before hydration completes, the browser performs a native GET to `/book-demo?website=`; inputs carry no `name` attribute, so **only the empty honeypot field** appears in the URL and no personal data is exposed. An early run of the suite hit exactly this timing; the suite now waits for hydration.

## 3. Responsive layout (desktop / tablet / mobile)
12 pages (`/`, `/pricing`, `/plans/growth`, `/platform`, `/frameworks`, `/frameworks/iso-27001`, `/book-demo`, `/contact`, `/start`, `/compare`, `/customers`, `/security`) at 1440, 1280, 1024, 820 and 390 px; each needs an H1 and no horizontal scroll; header menu toggle opened at every width below 1280 px and primary links visible.

* **Defect found and fixed:** at **1024–1160 px** (iPad landscape, small laptops) the header's desktop CTA group (`lg:flex`) was 1123 px wide on the live site and **1162 px** in the release candidate (the longer "Create Free Workspace" label from PR #17), so every page scrolled sideways. The inline navigation now starts at `xl` (1280 px); below that the existing menu is used. Commit `c01e4e6`. Pre-existing on production; not caused by REMEDIATE-001.
* After the fix: **all five widths PASS**, 0 console errors, 0 exceptions, 0 failed requests.
* Not covered: real devices, touch gestures, landscape phones, text-zoom, screen readers. Manual WCAG 2.2 AA testing remains outstanding.

## 4. Not tested (and why)
Authenticated journey after the identity provider; checkout preview, terms acceptance, payment, webhook, entitlement; Auth0 tenant behaviour; annual-cycle Stripe TEST payments; downgrade/upgrade paths. All need either an authenticated production session (not authorised and not appropriate) or the UAT stack (not available in this package). **No end-to-end Stripe acceptance is claimed.**

## 5. Re-running
```bash
# application pages (live, read-only) + website (local build)
NOVA_APP_URL=https://nova.eredox.com NOVA_SITE_URL=http://127.0.0.1:PORT node scripts/journey/verify-signup-journeys.mjs [--mobile]   # never add --idp-banner
SITE=http://127.0.0.1:PORT node scripts/journey/site-journey.mjs
```
