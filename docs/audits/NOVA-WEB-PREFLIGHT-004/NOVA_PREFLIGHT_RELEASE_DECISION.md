# NOVA-WEB-PREFLIGHT-004 — Final release decision

Date 2026-11-08 · Release candidate `25aecf2` (tag `rc/nova-web-release-003`), image `sha256:fdfbc406…8262` · Nothing merged, pushed, published or deployed; Server1 only read.

## 1. Decision
**HOLD — four owner decisions/confirmations stand between this candidate and a production release. No engineering work remains.** When all four are closed the release is **GO** by the runbook in `NOVA_PRODUCTION_RELEASE_RUNBOOK.md` (about 1 hour including verification; ~30 s of 502 on `www` only).

### Genuine blockers (all non-engineering)
| # | Blocker | Owner | To close |
|---|---|---|---|
| H1 | **Written release approval and a window**, with an operator who can use `sudo` on Server1 (the live `nginx.conf` is `root:root`) | Founder | go message naming the window |
| H2 | **Paid-checkout release-risk decision** (commercial dependency, §3) | Founder | choose: accept that "Subscribe" journeys end at the application's checkout limitation for now, or hold the release until checkout is enabled |
| H3 | **Security contact**: designated, monitored, able to receive reports — not verifiable here, so held as directed (`NOVA_PREFLIGHT_LEGAL_AND_SECURITY_CONTACT.md` §4) | Founder / mailbox owner | written confirmation + one test report received |
| H4 | **Legal path**: approve the prepared wording (rebuild, Path A) **or** accept deploying first (Path B) — same document §3 | Founder (the recorded legal approver) | one-line choice; if A, 20 min to apply, rebuild and re-run gates |

### Mandatory production-safety requirements (already built into the runbook — not extra blockers)
Dated backup of the live `nginx.conf` before any change · `nginx -t` on the new file and again in the live container · in-place write (same inode) and checksum proof that the container sees the patched file · reload nginx after replacing the website container · old container kept (`rename`, not delete) with a tested rollback · abort criteria · post-deployment GET/HEAD smoke tests including the application vhosts · no change to application, database, Odoo, Stripe, DNS or other vhosts.

### Non-blocking (evidence-based; none stops the release)
| Item | Evidence | Action |
|---|---|---|
| TLS certificate expires **2026-12-19** (41 days); renewal hook unreadable by `novaops` | `openssl` on host; permission denied on hooks dir | operator runs `sudo certbot renew --dry-run` and checks the hook **before ~2026-11-19** — independent of this release but time-bound |
| Website container has **no form-delivery variables** (pre-existing; forms cannot deliver today) | `docker inspect` names only | decide whether to supply them at D4 from the secure store; release neither fixes nor worsens it |
| www vhost exists only inside a release-directory copy of `nginx.conf` | file location + repo compare | application release procedure must carry the block across (recorded in `DEPLOYMENT.md`) |
| Application `celery_worker` crash-loops (5,577 restarts, redis-py mismatch) | `docker logs` | application owners; unrelated to website |
| GitHub Actions run with pinned SHAs not yet executed | nothing pushed | first push/PR; CI steps already pass locally under bun 1.2.17 |
| Future SEO: per-page share images, editor-maintained `lastmod`, `?framework=` link shortening, target-size review, banner LCP | RELEASE-003 | later backlog; not release conditions |

## 2. Validation summary (exact release image + live nginx file)
| Area | Result |
|---|---|
| Branch / HEAD / tag / worktree | `remediate/nova-web-remediate-001` / `25aecf2` / `rc/nova-web-release-003` / clean (later commits are docs and test tooling only) |
| Prior acceptance | RELEASE-001/002/003 evidence preserved unchanged |
| CI steps under bun 1.2.17 on clean export of HEAD | **PASS** (audit 0, lint 0 errors, typecheck, 122/122 tests, build) |
| Release image: build from digest-pinned Dockerfile, health, non-root, read-only, patched TanStack code | **PASS** |
| `verify-release --browser` (CSP, headers, 404s, links, sitemap, canonical, external destinations, desktop+mobile CSP/console) | **103/103** |
| Discovery check (robots matrix incl. Claude-SearchBot/User, Perplexity, OAI; 69 sitemap URLs; canonical; meta; headings; JSON-LD; reachability; exclusions; 404; private routes) | **PASS, 0 FAIL** |
| `en-AU` | `<html lang="en-AU">` and `og:locale en_AU` confirmed in the served HTML (discovery run on the image) |
| Journey/responsive (booking, refresh, back/forward, failure, hostile state; desktop 1440/laptop 1280/tablet 820/tablet-landscape 1024/mobile 390; menu) | **27/27**, 0 console errors |
| Patched **live** `nginx.conf` + release image (nginx 1.27.5-alpine) | `nginx -t` OK; headers once each (8); `/pricing/` 301; 404 on unknown and `/.env`; `robots.txt`/`sitemap.xml`/`security.txt` 200; form limits 403…429; 413; ACME path unaffected |
| Server-side TLS (production, loopback) | TLS 1.0/1.1 refused; 1.2 and 1.3 accepted; chain verifies; HTTP/2 |
| Application journeys (live application pages, read-only) | PASS (RELEASE-002) — plan/billing parameters honoured |
Not run: Rich Results Test and validator.schema.org (live URL needed), image OS-layer scan, real-user CWV, manual accessibility, GitHub Actions execution, anything authenticated.

## 3. Separate commercial dependency: paid checkout (no website change; explicit risk decision H2)
* Website: unchanged pricing cards, labels, registration links and parameters (`plan`, `billing_cycle`); no file in those areas differs between `86455be` and the release.
* Application (live): registers and carries the selection correctly for all five self-service plans, monthly and annual; Enterprise goes to a quotation page.
* Known limitation: paid **checkout inside the application** is not an approved production capability (application release records: global Odoo integration disabled, no general checkout, no Stripe live mode, Payment Terms legal document and platform administrator not in place as of 1–4 Nov; production state not re-verified here because it needs an authenticated session and no payment or account was created). A visitor who chooses "Subscribe" can register, sign in and reach the checkout step, where the application is expected to stop ("Odoo checkout is not configured.").
* The application's `celery_worker` fault (§1, non-blocking) may also affect application background processing.
* Decision H2 — the Founder either accepts that behaviour for a defined period (the application team's own coordinated-release note calls it the "safe, expected result"), or holds the release. Either way **no website development is reopened**.

## 4. The two original externally reported HIGH findings, and other limits
* **Both remain NOT VERIFIED.** The original scanner report was never supplied, so their content, target and evidence are unknown. This package makes no claim that any change closes them and none that they are valid or invalid.
* One related *fact*, without conclusion: production's 22 Oct build answers HTTP 200 for unknown paths (soft 404), including probes such as `/.env`; the release returns real 404s (verified on the image and through nginx). Whether this relates to either report is unknown.
* Assessment limits: no authenticated testing; no payment or Stripe/Odoo test; no secrets, root-only areas, firewall or backups read; client-side TLS checks from this workstation are intercepted by Avast, so TLS was verified on the host over loopback; crawler corroboration covers 7 days of retained logs and cannot separate hosts (no `Host` in the log format); Anthropic crawlers have no official verification method found; external schema validators not run; a lab, not field, performance basis.

## 5. What happens next (when H1–H4 are closed)
`NOVA_PRODUCTION_RELEASE_RUNBOOK.md` D1→D5, abort criteria §5, rollback §6, smoke tests §7, Search Console/Bing checklist §8 (including the "Search generative AI" = Include check), crawler re-verification §9. Do not merge, push or deploy until the approval in H1 is given.
