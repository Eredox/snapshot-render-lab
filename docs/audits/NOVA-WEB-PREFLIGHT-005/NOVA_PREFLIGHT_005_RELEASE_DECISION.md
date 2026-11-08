# NOVA-WEB-PREFLIGHT-005 — Founder decision (Legal Path A) and release closure

Date 2026-11-08 · Branch `remediate/nova-web-remediate-001` · Nothing merged, pushed, published or deployed. Server1 read only (one attempted configuration write was refused by the session's safety classifier and not made). This document supersedes the identity and decision in `NOVA-WEB-PREFLIGHT-004`; the earlier reports are preserved unchanged.

## 1. Decision
**HOLD — no engineering work blocks the release; the remaining items need the Founder or a mailbox/server owner.** The engineering and verification you asked for is done (§3). Three things cannot be closed from this workstation without a credential, a mailbox or an approval that I may not take: the **security-contact delivery evidence**, the **real-service enquiry delivery test**, and the **written legal approval**. The release becomes **GO** when H1–H4 below are closed, using `NOVA_PRODUCTION_RELEASE_RUNBOOK.md` in this folder.

### 1.1 Exact remaining production blockers
| # | Blocker | Why it still blocks | Owner | To close |
|---|---|---|---|---|
| H1 | **Separate production-release instruction**, a window, and an operator with `sudo` | You said nothing is pushed, merged or deployed without it; the nginx file is `root:root` | Founder | message naming the window |
| H2 | **Paid-checkout release-risk decision** | commercial dependency, documented separately (`NOVA_SEPARATE_ENGINEERING_RECORDS.md` R1); not a website defect | Founder | accept for a defined period, or hold |
| H3 | **Security contact not established**: no delivery evidence, no recorded monitoring owner | requirement says not complete without delivery evidence; no mail route available to me (`NOVA_FORM_DELIVERY_AND_SECURITY_CONTACT.md` §2) | Founder / mailbox owner | 10-minute test in §2.1 of that document + register |
| H4 | **Legal text: final approval recorded, and effective date set to the actual publication date** | corrections accepted in principle (Founder direction, 8 Nov); exact wording and a no-unrelated-changes confirmation are presented in `NOVA_LEGAL_TEXT_FOR_FOUNDER_REVIEW.md`; the source still carries the placeholder date `2026-11-08`, which is correct only if publication happens that day | Founder | record final approval; at release set the real date (4 strings), rebuild, re-run gates — runbook step D0 |
**H5 — your choice, not a safety blocker:** enquiry delivery is **not verified against the real services**. Locally, with synthetic sinks, the whole path passes (§3), but the production credentials were lost at a redeploy after 24 Sep and could not be restored from here (write refused), and one real submission creates a real CRM lead and e-mail. Either (a) require gate G1 to pass in the go-live window (recommended; about 10 minutes, runbook D3b + §7a), or (b) accept that forms keep answering "temporarily unavailable" as they do today. The release does not make this worse in either case.

### 1.2 Mandatory production-safety requirements (already in the runbook; not extra blockers)
Dated `nginx.conf` backup · `nginx -t` on the new file and in the live container · in-place write (same inode) with checksum proof · nginx reload after the container swap · old container renamed (not deleted) and a tested rollback · abort criteria · GET/HEAD smoke tests including the application vhosts · env file mode 0600, values never printed · no change to application, database, Odoo, Stripe, DNS or other vhosts.

### 1.3 Non-blocking (evidence-based)
TLS renewal check before 2026-11-19 (reminder scheduled 16 Nov 09:00; operator still must run it) · Celery worker crash loop (application owners) · SPF absent on `eredox.com` (domain owner) · `www` vhost lives in a release-directory copy of the application's nginx.conf · GitHub Actions run not yet executed · future SEO items (per-page share images, editor-maintained `lastmod`, `?framework=` links, target-size review, banner LCP). See `NOVA_SEPARATE_ENGINEERING_RECORDS.md`.

## 2. New release identity (the PREFLIGHT-004 image is superseded — do not reuse its ID)
| Item | Value |
|---|---|
| Release commit | `affb00c4b8815de90b9f2a31546add7e40bffeac` (`affb00c`), annotated tag `rc/nova-web-release-005`. Contents versus the previous `25aecf2`: legal text v1.1 (`f5b2cd3`), demo booking accepted without optional notes, form-delivery harness, `.gitattributes` for `*.sh` |
| Image | `nova-public-website:affb00c4b8815de90b9f2a31546add7e40bffeac` |
| **Immutable image ID** | `sha256:34055ee7f2ccf29916b15f375527da5dc63443a5fbb012acb54a711fde832386` (old, superseded: `sha256:fdfbc406…8262`) |
| Transport archive | `nova-public-website-affb00c4b8815de90b9f2a31546add7e40bffeac.tar.gz`, 89,141,577 bytes, **sha256 `85f602c83d6966f421f19a3c003aa4683079f5e82643e065b5d79ad84138b3b6`** (old, superseded: `73757a63…42c1`); stored in the session scratchpad, not in the repository |
| Registry digest | none (not pushed); the image ID is the immutable identifier |
| nginx change | unchanged: `docs/audits/NOVA-WEB-PREFLIGHT-004/nginx-www-vhost.diff` (+19/−0, sha256 `2d8f3b99…7898`; live file `660e4f8b…2815` → patched `1f991770…d909`). No runtime file affecting nginx changed |
| Branch state | HEAD is this package's documentation commit on top of `affb00c`; documentation only (runbook step checks it) |

## 3. What was done and verified (on the exact new image)
| # | Item | Result |
|---|---|---|
| 1 | Legal Path A applied (Google Fonts statement corrected, Brevo/CRM disclosed, booking history-state, abuse controls; Accessibility Statement; v1.1) — every statement fact-checked against the code that runs; all other provisions untouched | **Done**; exact text in `NOVA_LEGAL_TEXT_FOR_FOUNDER_REVIEW.md` for approval |
| 2 | Rebuilt image; new commit, image ID, archive checksum recorded; old ID not reused | **Done** (§2) |
| 3 | CI steps under bun 1.2.17 on a clean export of HEAD | install `--frozen-lockfile` OK · `bun audit`: no vulnerabilities · lint 0 errors (7 baseline warnings) · typecheck clean · 22 files / **124 tests** pass · build OK |
| 4 | Image gates | healthy, uid 10001, read-only fs · patched TanStack code present, vulnerable code absent · `verify-release --browser` **103/103** · discovery check **PASS** (robots matrix, 69 sitemap URLs, canonicals, headings, JSON-LD, 404, private routes) · journey/responsive **27/27**, 0 console errors |
| 5 | Patched **live** nginx.conf in front of the new image (nginx 1.27.5) | `nginx -t` OK · 8 security headers, each once · `/pricing/` 301 · unknown path and `/.env` 404 · `robots.txt`, `sitemap.xml`, `security.txt` 200 · ACME path not proxied · form burst 403×4 then 429×2 · cookie policy page: 0 Google Fonts mentions, Brevo disclosed, v1.1 |
| 6 | Customer-enquiry path, synthetic sinks (CRM HMAC contract + Brevo), real image | **20/20 API + 5/5 real-browser** checks; spam protection, privacy and rate limiting preserved; **one real defect found and fixed** (a demo booking without the optional notes box was rejected) |
| 7 | Subscription separation | no pricing, registration, plan/billing, checkout, Odoo or Stripe file changed; limitation recorded separately (R1) |
| 8 | Celery failure recorded for its owners, service untouched | **Done** (R2) |
| 9 | TLS renewal check scheduled before 19 Nov | reminder task created for 16 Nov 09:00; operator action still required (R3) |
| 10 | Rollback procedure maintained | runbook §6 unchanged (container rename, nginx backup, reload); env file is left in place on rollback |

### Not done, and why (no invented results)
* **Security contact delivery evidence** — no authorised mail route available to this session; sending as an Eredox address would be a spoof; SMTP greeting from `mail.eredox.com` not received from this workstation (inconclusive). Monitoring owner not recorded because none is known. → H3.
* **Real-service enquiry delivery** — credentials not restored (write to `/opt/nova/secrets` refused by the safety classifier; I did not work around it); production CRM/Brevo not exercised because one test creates a real lead and e-mail and no approved test environment exists. Prepared: D3b and G1. → H5.
* Not run (unchanged from PREFLIGHT-004): Rich Results Test / validator.schema.org (live URL needed), OS-layer image scan, real-user performance, authenticated/payment tests, root-only areas of Server1. The two original externally reported HIGH findings remain **NOT VERIFIED** (scanner report never supplied).

## 4. Where everything is
`docs/audits/NOVA-WEB-PREFLIGHT-005/`: this decision · `NOVA_LEGAL_TEXT_FOR_FOUNDER_REVIEW.md` · `NOVA_FORM_DELIVERY_AND_SECURITY_CONTACT.md` · `NOVA_SEPARATE_ENGINEERING_RECORDS.md` · `NOVA_PRODUCTION_RELEASE_RUNBOOK.md` (v2) · `evidence/`. Tools: `scripts/forms/run-delivery-harness.sh` (set `UI=1` for the browser test).
