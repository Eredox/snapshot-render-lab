# NOVA Compliance marketing site — roadmap

## Standing rules
- Eredox palette only (green #3D9970 primary, orange #FF851B restrained accent, black #0B0B0B, off-white #F7F8F6, grey #E8ECEA, slate #39443F). All tokens in `src/styles.css`; never hard-code colours in components.
- Typography: **Roboto for all site text** (headings, nav, body, forms). Cirqua is reserved for the Eredox/NOVA wordmark only, once licensed files are supplied.
- All product/framework/pricing/solution/resource/legal content lives in `src/data/*`; never hard-code claims in routes.
- One central navigation + route registry: `src/config/navigation.ts`. Menus and router must not drift.
- SEO per route via `head()`: title as a meta entry, canonical on leaf routes only, relative og:url, JSON-LD via scripts.
- No invented testimonials, customers, logos, awards, certifications, stats or legal clauses. No certification seals.
- Approved statement: "NOVA supports the readiness decision. Final launch and risk decisions remain human decisions."
- Never mention AMOS or ABUS. Never expose internal IPs, ports or admin URLs.
- Prices are indicative and marked as requiring Eredox approval.

## Phase 1 — foundation (done)
- Design system, site config, data files, SEO helpers, primitives, header, footer, cookie consent, hero visual, homepage.

## Phase 2 — complete every route (done)
- Core: /platform /features /integrations /pricing /security /responsible-ai /trust /about /support /contact /book-demo /start /status /404 + catch-all
- Features: 10 detail pages via `/features/$slug`
- Frameworks: /frameworks + 7 detail pages via `/frameworks/$slug`
- Solutions: /solutions + 7 detail pages via `/solutions/$slug`
- Resources: /resources /resources/faq /resources/guides /resources/product-updates /resources/case-studies /resources/webinars + detail routes
- Legal: /legal + 7 documents via `/legal/$slug`
- Forms: contact, book-demo, request-quote, start free (client-side validation, no false success)
- /roadmap page driven by `src/data/roadmap.ts` (derived from features + frameworks availability)
- About and Contact pages fleshed out (company, product direction, enquiry guidance)
- Route-integrity test in `src/routes/__tests__/route-integrity.test.ts` passes (vitest)
- TypeScript and latest build OK

## Current
- Booking flow: form must navigate to /book-demo/confirmed showing the slot (in progress)
- Hero: rebuild with realistic computer + same feeding motion as reference image-3.png
