# NOVA-WEB-RELEASE-003 — AI search and AI discovery readiness

Date 2026-11-08. Vendor facts below come from the vendors' own crawler documentation as summarised by search results on 2026-11-08 (Anthropic, OpenAI and Perplexity crawler pages; Google and industry reporting on `llms.txt`; indexnow.org). Crawler names, user-agent strings and IP-list locations change; **re-read the vendor pages when activating**. Nothing here claims any ranking, citation or visibility outcome.

## 1. Four purposes, decided separately
| Purpose | Crawlers (robots.txt tokens) | Current robots.txt policy | Change in this package | Decision owner |
|---|---|---|---|---|
| **Search indexing** | Googlebot, Bingbot, DuckDuckBot, Applebot, YandexBot, Baiduspider (and any other standards-compliant crawler via `*`) | Allow | none (Googlebot, Bingbot already explicit) | settled — broad discovery is the objective |
| **AI search and answer citations** | OAI-SearchBot, Claude-SearchBot, PerplexityBot | Allow | **Claude-SearchBot made explicit** (it was allowed only through `*`) | settled |
| **User-initiated page retrieval** | ChatGPT-User, Claude-User, Perplexity-User | Allow | **Claude-User and Perplexity-User made explicit** | settled. Vendors state these fetchers act for a person and may not follow robots.txt; allowing them is consistent with that |
| **Generative-AI model training** | GPTBot, ClaudeBot, Google-Extended (+ Applebot-Extended, others unnamed) | **GPTBot Allow, ClaudeBot Allow, Google-Extended Allow, CCBot Disallow** | **none** | **Founder** |

**Why the separation matters (vendor documentation):** Anthropic documents three independent tokens — ClaudeBot (training), Claude-User (live user requests) and Claude-SearchBot (search quality); blocking one does not block the others and blocking ClaudeBot does not stop Claude citing a site. OpenAI separates OAI-SearchBot (ChatGPT search), GPTBot (training) and ChatGPT-User (user-initiated). Perplexity separates PerplexityBot (index) and Perplexity-User (user-triggered) and says neither is used to train foundation models. Google-Extended is a robots token that controls use of content for Gemini training/grounding; it does not change Search indexing. The deprecated Anthropic tokens `Claude-Web` and `anthropic-ai` have no effect on current crawlers (the existing `Claude-Web: Allow` line is kept as it was, harmless).

### Existing training policy — documented, not changed
Before this package `public/robots.txt` already **allowed** GPTBot, ClaudeBot and Google-Extended and **blocked** CCBot. That is the recorded policy. The brief's objective is "broad public discovery, not automatically unrestricted AI training", so the Founder should confirm whether permitting training use is intended. Options for that decision (not implemented): (a) keep as is; (b) `Disallow: /` for GPTBot, ClaudeBot, Google-Extended (and add Applebot-Extended, Meta-ExternalAgent, Bytespider, etc.) while keeping every search and user-initiated token allowed; (c) selective paths. A unit test (`src/lib/__tests__/robots-policy.test.ts`) now pins the current training policy, so any change must be a deliberate test edit. Note robots.txt is a voluntary request: it does not stop non-compliant scrapers, and it cannot withdraw content already collected.

## 2. Can AI systems understand the site without running JavaScript?
Method: raw `GET` of all 69 sitemap URLs, no script execution (`scripts/discovery/check-discovery.mjs`, plus `evidence/sitemap-url-inventory.csv`).

| Criterion | Result |
|---|---|
| Meaningful server-rendered text | **PASS** — minimum 242 words of body text on any page; pages are server-side rendered (TanStack Start SSR) |
| Semantic headings | **PASS** after one fix — exactly one `<h1>` per page and no skipped heading level on all 69 (was 68; `/features/framework-management` skipped `h2`) |
| Titles / descriptions | **PASS** — unique, 20–60 and 70–160 characters |
| Language / canonical / identity metadata | `<html lang>` set; canonical self-referencing; Open Graph URL equals canonical |
| Meaningful internal links | **PASS** after one fix — all 69 pages reachable from `/` by HTML links alone (the Industries section previously was not); pages with only one inbound link are listed in the inventory (`/plans/*`, `/solutions/auditors`, `/solutions/executives`) — acceptable, they are linked from the pricing/solutions hubs |
| Content hidden behind interaction | Page content is all in the initial HTML. The header mega-menu does **not** render every item until opened (for example `/features/controls` is not an `<a>` on the homepage source), so individual feature pages are reached through the hub pages (`/features`, `/platform`, `/frameworks`, `/solutions`, `/industries`, `/resources`, `/trust`), which are plain HTML links on every page. The HTML-only walk from `/` reaches all 69 URLs, so nothing depends on a click or script. A possible improvement (not a defect): list feature pages in the footer for one-hop reach |
| Company / product identity | **PASS** — "Eredox Pty Ltd" and "NOVA Compliance" appear in the server-rendered text of every page; the About page states that NOVA is built by Eredox; the Terms identify Eredox Pty Ltd (ABN 32 634 165 941) as the operator; JSON-LD now encodes the same (Organization `legalName`, `brand` NOVA Compliance, ABN `identifier`, WebSite, SoftwareApplication `publisher`) |

### Content accuracy review (what I checked and what I did not)
* Reviewed by reading rendered text and source: homepage, platform, features, framework pages, solutions, About, Security/Trust. The earlier packages removed a quantified claim from the illustrative customer scenario and keep the readiness-versus-certification disclaimer (`site.frameworkDisclaimer`) on framework pages.
* **No features, certifications, testimonials, customer counts, awards or security guarantees were added.** The empty testimonials / case-study / product-update sections remain `noindex` and out of the sitemap.
* Not done: a line-by-line factual audit of all 69 pages against the product (needs a product owner), review of third-party-facing claims such as framework coverage "Available now / roadmap" badges beyond what the data files state.

## 3. `/llms.txt` investigation
| Question | Finding |
|---|---|
| What is it? | A community proposal for a Markdown file at `/llms.txt` listing key pages for LLMs. Not an IETF/W3C standard |
| Do major platforms recognise it? | **No platform has documented or confirmed using it for discovery or ranking.** Google's search relations contacts have said publicly it is not used for Search, AI Overviews or AI Mode and that AI services have not said they use it; independent log studies report most domains see zero bot requests for it. OpenAI, Anthropic and Perplexity crawler documentation does not mention it. Absence of announcement is not proof that no system reads it, but there is **no demonstrated benefit** |
| Cost / risk | Low (a static file) but not zero: a second place to keep in sync with the site; risk of publishing statements that drift from the pages |
| Current state | `GET /llms.txt` → **404** on the release candidate (and a soft 200 on the unfixed production site) |
| **Decision** | **Not implemented.** The brief says to avoid experimental features without demonstrated benefit, and `llms.txt` is neither a standard nor an indexing requirement. The server-rendered pages, sitemap and structured data are the supported mechanisms. Revisit if a major vendor documents support; if so, generate it from the same data files that drive the sitemap (title, canonical URL, description) so it cannot drift, link only to canonical public pages, and publish no private documentation |

## 4. Other AI-specific mechanisms considered
| Mechanism | Verdict |
|---|---|
| `Sitemap:` in robots.txt | Present and verified |
| Structured data (Schema.org JSON-LD) | Implemented/validated — see `NOVA_STRUCTURED_DATA_VALIDATION.md`; no vendor guarantees its use for AI answers |
| `ai.txt`, `TDM-Reservation` / `tdmrep.json`, `noai` meta tags | Not implemented: informal or not recognised by the vendors reviewed; adopting one would also be a training-permission statement (Founder decision) |
| IndexNow | Prepared; relevant for Bing-family engines and those that consume IndexNow, **not Google** — see the activation plan |
| Paid/partner AI integrations, data feeds | Out of scope |

## 5. What cannot be claimed
No statement is made that NOVA will be indexed, ranked, or cited by any search engine or AI product. The site is *technically eligible and readable*; outcomes depend on the engines. Citation or answer-engine presence can only be measured after release (server logs of verified crawler addresses, Search Console, Bing Webmaster Tools, and manual prompts recorded with date and platform).
