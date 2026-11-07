# NOVA-WEB-REMEDIATE-001 — Editorial backlog (search content)

Status: **proposal for Eredox review — no new articles were generated in this package.**
Source: NOVA-WEB-AUDIT-001 Report A §7 (SEO-007). Keyword *presence* was measured on the live site; **search volume, difficulty, rankings and traffic are NOT VERIFIED** (no Search Console / keyword-tool access). Prioritise using Search Console once connected.

## Principles
- Publish only substantive, subject-matter-reviewed pieces (>= 1,200 words or a genuinely useful tool/checklist). No templated or repetitive AI-generated pages.
- Every piece keeps the product distinction: **NOVA supports readiness and evidence management; certification, attestation and regulatory conclusions belong to accredited, independent or regulatory parties.** No guarantee language.
- Describe only capabilities and plan entitlements that exist today (see `/features`, `/integrations` availability badges and the plan manifest). Frameworks appear only with their real availability status.
- Each article gets: unique title (<= 60 chars, `| NOVA Compliance`), description (70–155), one H1, BreadcrumbList + BlogPosting/Article JSON-LD (with `image` and author/publisher `@id`), `datePublished`/`dateModified`, a "last reviewed" line, and 3+ contextual links to framework/feature/solution pages (and links *from* those pages back).
- Resources are published through `src/data/resources.ts`; the sitemap, noindex rules and `lastmod` update automatically from that data.

## Backlog (ranked)

| # | Working title | Intent / target topic | Format | Links to | Notes / evidence needed |
|---|---|---|---|---|---|
| 1 | What is a GRC platform — and do growing organisations need one? | "GRC platform", compliance management software | Guide (1,500+ words) | /platform, /features/controls, /features/risk-management | Be honest about when spreadsheets are enough; SME review |
| 2 | SOC 2 readiness checklist: from scoping to evidence | SOC 2 readiness | Checklist + guide | /frameworks/soc-2, /features/evidence | Cite AICPA Trust Services Criteria; state that the report comes from a CPA firm |
| 3 | ISO 27001 vs SOC 2: which first? | ISO 27001 compliance, SOC 2 | Comparison guide | /frameworks/iso-27001, /frameworks/soc-2, blog "Choosing your first framework" | Extend (not duplicate) the existing blog post |
| 4 | Essential Eight maturity levels explained (Australia) | Essential Eight, ACSC | Guide | /frameworks/essential-eight, /solutions/regulated-organisations | Verify against current ACSC publications at writing time |
| 5 | ISO/IEC 42001: AI governance in practice | ISO 42001, AI governance | Guide | /frameworks/iso-42001, /responsible-ai, /features/ai-assistant | Align with the EU AI Act disclosure already on site; no claims of regulatory coverage |
| 6 | Reusing evidence across frameworks without double counting | multi-framework compliance | Guide | /platform, /features/framework-management | Use NOVA's shared-control model; illustrative figures must be labelled |
| 7 | Compliance automation: what to automate and what must stay human | compliance automation, security compliance automation | Explainer | /integrations, /features/evidence, /responsible-ai | Only connectors that are "Available now" |
| 8 | What "audit-ready" does and does not mean | audit readiness | Explainer | /features/auditor-portal, /trust | Builds on the existing evidence guide |
| 9 | Policy lifecycle: approval, review and attestation | policy management | Guide | /features/policies | — |
| 10 | Risk register to risk acceptance: recording decisions that survive scrutiny | risk management | Guide | /features/risk-management | — |
| 11 | Framework pages (GDPR, PCI DSS, HIPAA, CMMC) expansion to >= 1,200 words | framework long-tail | Page upgrade | existing framework pages | Reuse the structure of the SOC 2 / ISO 27001 pages; legal review for US/EU specifics |
| 12 | Case studies / testimonials | trust signals | — | /resources/case-studies, /testimonials | **Only with customer approval.** Pages are noindex until published |

## Measurement (once Search Console / Bing / analytics access exists)
1. Baseline impressions/clicks/position for the 12 target topics and the 8 framework pages.
2. Track indexing of new URLs (sitemap `lastmod`), click-through changes from the new titles.
3. Review quarterly; retire or merge pages with no impressions after two quarters.
