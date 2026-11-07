# NOVA-WEB-RELEASE-003 — Structured data (Schema.org JSON-LD) validation

Date 2026-11-08 · release candidate built from this branch, 69 sitemap pages read as raw HTML. Raw: `evidence/discovery-check-local-rc.json`, `evidence/sitemap-url-inventory.csv` (`jsonld_types` column).

## 1. Validation method — and its limit
`scripts/discovery/check-discovery.mjs` extracts every `<script type="application/ld+json">`, requires valid JSON, `@context` = schema.org, a recognised `@type`, the properties Google documents as required for that type, absolute https URLs on the canonical host, sequential breadcrumb positions, resolvable `@id` references, and **rejects fabricated-data properties** (`aggregateRating`, `review`, `offers`, `award`, `hasCredential`) unless a human reviews them. This is a *structural* check I wrote; it is **not** Google's Rich Results Test or the Schema.org validator. Those are web tools that need a public URL: **NOT RUN**. Run both on the live URLs after deployment (homepage, `/about`, `/contact`, a framework page, a resource article, `/resources/faq`).

## 2. Inventory (release candidate, 69 pages)
| Type | Pages | Source | Result |
|---|---|---|---|
| `Organization` | 69 (site-wide, `@id` `…/#organization`) | `__root.tsx` → `organizationSchema()` | PASS |
| `WebSite` | 69 (`…/#website`, publisher → organization) | `websiteSchema()` | PASS |
| `SoftwareApplication` | 2 (homepage and `/pricing`; `…/#software`) | `softwareSchema()` | PASS (valid; **not** rich-result eligible — see §4) |
| `BreadcrumbList` | 68 (every page except the homepage) | `breadcrumbSchema()` | PASS — positions sequential, items absolute canonical URLs |
| `AboutPage` | 1 (`/about`) | `webPageSchema()` — **new** | PASS |
| `ContactPage` | 1 (`/contact`) | `webPageSchema()` — **new** | PASS |
| `FAQPage` | 2 | `faqSchema()` | PASS structurally. Google restricts FAQ *rich results* to a small set of authoritative sites (government/health); the markup is still valid and describes real on-page questions |
| `BlogPosting` | 2 (the two published resources) | `blogPostingSchema()` | PASS — `datePublished` ISO, author and publisher are the organisation, URL equals canonical |
Result: **all blocks parse, 0 structural issues, 0 unresolved references, no fabricated-data properties.**

## 3. Changes made (facts only, each traceable to published text)
| Entity | Added | Source of the fact |
|---|---|---|
| Organization | `legalName` "Eredox Pty Ltd" | `site.company`; Terms |
| Organization | `brand` → Brand "NOVA Compliance" | `site.productName`; About page text "NOVA is built by Eredox" |
| Organization | `identifier` PropertyValue `ABN` = `32 634 165 941` | Terms (`legal-published.ts`); stored once as `site.abn` |
| Organization | `contactPoint` `general enquiries` → `compliance@eredox.com` | already published on the contact page (`formsConfig.fallbackEmail`). **Not** declared a security or support desk |
| WebSite | `alternateName` "NOVA" | `site.shortName` |
| About, Contact | `AboutPage` / `ContactPage` nodes: `isPartOf` → WebSite, `about` → Organization | page titles/descriptions reused from the same constants as the meta tags |
Relationship encoded: **Eredox Pty Ltd** (Organization) — `brand` → **NOVA Compliance**; SoftwareApplication `publisher`/`provider` → the same Organization; WebSite `publisher` → the same Organization. A test (`robots-policy.test.ts`) asserts these values and the absence of fabricated properties.

## 4. Deliberately not added
* **No `offers`/`Offer`/price markup, no `aggregateRating`, `review`, `award`, certification or customer counts** — none exist as verified public data, and pricing is out of scope for this package. Consequence: `SoftwareApplication` is valid Schema.org but will not qualify for software-app rich results (Google asks for an offer or rating); that is accepted.
* No `featureList`: some listed capabilities are roadmap items; markup must not claim them.
* No `sameAs`: no verified social/company profile URLs are recorded in the repository. Add LinkedIn/Companies-register URLs when the owner supplies them.
* No `address`/`foundingDate`/`founder`: not published in the site content.
* No `SearchAction` on WebSite: the site has no search.
* No `Article` schema for non-editorial pages; `BlogPosting` only on the two real articles.
* Organization/WebSite are emitted on every page (existing behaviour; harmless duplication of two small blocks). Limiting them to the homepage and About is possible but would change a working, validated pattern; not done.

## 5. Consistency checks
* All URLs in JSON-LD use `https://www.nova.eredox.com`; page-level `@id`s are `<canonical>#webpage` or the three site-wide ids. Canonical tags, `og:url` and sitemap `<loc>` agree on all 69 pages.
* Product identity string is "NOVA Compliance" everywhere; company string "Eredox Pty Ltd".
* Not checked: whether on-page visible text matches every JSON-LD value beyond the entities above (done by construction — the values are generated from the same config).

## 6. Status
| Item | Status |
|---|---|
| Structural validity of all JSON-LD | **PASS** (local) |
| Google Rich Results Test / Schema.org validator | **NOT RUN** (needs live URL) |
| Rich-result eligibility | Not claimed |
| Fabricated reviews, ratings, prices, certifications | **None present** |
