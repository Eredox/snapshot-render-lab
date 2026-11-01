# NOVA-WEBSITE-SIGNUP-001: customer subscription entry journey

Targeted correction to the public website's path into NOVA. The full journey report, with the exact text shown at
every step, is `docs/operations/platform-status/NOVA_WEBSITE_SIGNUP_001_JOURNEY_REPORT_2026-11-02.md` in the NOVA
application repository.

## Changes
- `src/data/canonical-plan-manifest.ts` regenerated from the NOVA backend public manifest (version 2026-10-26, SHA-256
  `4361bfe4df719a85519cc4cef96bbf56fd7161f29209dd7e0a6d1e3607b692cf`, USD). Every plan, including Free and Enterprise,
  has all available frameworks. Never edit the values by hand; regenerate when the version changes.
- Button labels: `Create Free Workspace`, `Subscribe to Launch|Growth|Professional|Business`, `Request a Quote`.
- Registration links come from one builder (`registrationUrlFor`) and carry only `plan` and `billing_cycle`.
- The interval chosen on `/pricing` is carried to `/plans/<plan>?billing=<monthly|annual>` and on to registration; paid
  plan pages have a Monthly/Annual toggle.
- No free-trial offer anywhere in customer-facing source (enforced by `signup-journey.test.ts`); legal documents are
  governed separately and are excluded from that check.

## Release dependency
The corrected links assume the NOVA application release that reads `plan` and `billing_cycle` on `/register` and
`/login`. The 5 October production application ignores them and shows the Free workspace form for every selection, so
publish this website change only together with that application release.
