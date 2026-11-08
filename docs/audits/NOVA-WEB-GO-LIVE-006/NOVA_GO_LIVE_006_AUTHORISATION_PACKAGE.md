# NOVA-WEB-GO-LIVE-006 — Public website launch: authorisation package

Date 2026-11-08 (Sunday) · Branch `remediate/nova-web-remediate-001` · This is a **website-content and technical-improvement release**. It is not a declaration that paid subscriptions are operational. **Nothing was merged, pushed, published or deployed; Server1 was only read** (and one earlier attempted configuration write was refused and not made).

## 1. Result
**HOLD for activation; READY for Founder authorisation.** Every item that can be completed and verified without touching production is done. Activation waits for three things that are yours to give or confirm; none needs engineering:
| # | Needed before activation | Who | Status |
|---|---|---|---|
| A1 | **Written production-release authorisation** naming the window, with an operator who has `sudo` on Server1 (the live `nginx.conf` is `root:root`) | Founder | not given — this package asks for it (§9) |
| A2 | **Security contact check passes**: a person who reads `compliance@eredox.com` confirms receipt of the 10-minute test message (`docs/audits/NOVA-WEB-PREFLIGHT-005/NOVA_FORM_DELIVERY_AND_SECURITY_CONTACT.md` §2.1) and names the monitoring owner | Founder / mailbox owner | **domain-level reachability verified (§5); human receipt not yet** — it can be done in the first 15 minutes of the window, before D1 |
| A3 | **Awareness of finding F1** (§4): the pricing/entry-journey content already on this branch is not what is live today | Founder | needs a yes in the authorisation |
Forms are **not** declared operational until gate G1 (a real, approved, synthetic enquiry reaching `compliance@eredox.com` and the CRM) passes in the window (§6). If G1 fails the site is still safe to run: forms then answer "temporarily unavailable" exactly as they do today.
**Closed by your direction:** H2 (paid-checkout limitation accepted as a separately managed commercial-workstream limitation; not changed, not represented as resolved) and H4 (legal wording finalised; effective date set to the planned publication date, see §3).

## 2. What each scope item resulted in
| # | Scope | Result |
|---|---|---|
| 1 | Latest verified release candidate | `8d7c7d5` (§3). Commits after it add only documentation, evidence and the smoke script; `git diff 8d7c7d5 HEAD -- src public ops package.json bun.lock Dockerfile vite.config.ts` is empty and the runtime image contains only the build output (checked) |
| 2 | Finalise legal wording incl. browser-history clarification with the actual publication date | Wording as presented on 2026-11-08 (no change) in `NOVA_LEGAL_TEXT_FOR_FOUNDER_REVIEW.md`; version 1.1; effective and last-reviewed date **2026-11-10**, the proposed publication date. **If publication happens on another day, step D0 changes four strings and rebuilds before anything is deployed.** No unrelated provision changed (comparison evidence in PREFLIGHT-005) |
| 3 | Rebuild and verify the exact production image | Rebuilt; new identity (§3). All gates re-run on it (§7) |
| 4 | Preserve pricing, subscription, registration, Odoo, Stripe, billing | Nothing in those areas was modified by this work. **But see F1** |
| 5 | Blog / Knowledge Centre unchanged beyond accepted SEO corrections | Confirmed: since the live build the `resources.*` route changes are page titles, noindex handling of empty listings (case studies, webinars, product updates) and one pricing-FAQ sentence in `resources.ts`; no article content changed |
| 6 | 69 indexable pages, sitemap, crawler permissions, structured data | Sitemap = 69 URLs, every one 200; discovery check PASS (61 checks, 0 FAIL) incl. canonicals, headings, JSON-LD; robots policy test PASS (Founder decision: GPTBot/ClaudeBot/Google-Extended allowed, CCBot disallowed, search/AI-search/user crawlers allowed) |
| 7 | Contact address reachable; enquiry-delivery path; real form delivery | §5. Path established and reachable; **real delivery to be proven by G1; not declared operational yet** |
| 8 | Verify Server1, backup, apply only validated nginx changes | Re-verified read-only today (§5). Backup and apply are steps D5 in the window, with checksums; only the 19 validated added lines change |
| 9 | Preserve previous container; rollback | Previous image `69543cb1…` (ID `sha256:dad65566…0073`) is on the host; D4 renames, never deletes; rollback §6 of the runbook, under 5 minutes |
| 10 | Full smoke, SEO, header, sitemap, crawler, application-host checks | Scripted (`scripts/release/post-deploy-smoke.sh`), passes 25/25 on the release image behind the patched live nginx; production baseline captured; crawler verification plan in the runbook §9 |
| 11 | Search Console, Bing, IndexNow preparation | Checklist (runbook §8); IndexNow dry run OK with the live key file; URL lists prepared |

## 3. Verified release (exact, immutable)
| Item | Value |
|---|---|
| Release commit | `8d7c7d5621f54749ecf39efc5ddfa7bcc136e61c`, annotated tag `rc/nova-web-release-006` |
| Image | `nova-public-website:8d7c7d5621f54749ecf39efc5ddfa7bcc136e61c` |
| **Immutable image ID** | `sha256:a49fd41f9764595e3e28d8f0defa56034b1b7d08f999b971f6dca9ad43de08c5` |
| Transport archive | `nova-public-website-8d7c7d5621f54749ecf39efc5ddfa7bcc136e61c.tar.gz`, 89,142,605 bytes, sha256 `8b1388796dd108eb8583b719ab5b7939571311ebffb14f7e4b8620296bfa2e0a` (kept in the session scratchpad, not in the repository; rebuildable) |
| Registry digest | none: not pushed. The image ID is the immutable identifier |
| nginx change | `docs/audits/NOVA-WEB-PREFLIGHT-004/nginx-www-vhost.diff`, +19/−0, sha256 `2d8f3b99160d44645e601d84e137673bbfa1c5c659c41b1b6f876ca9c5567898`. Live file `660e4f8b…2815` (unchanged since 2026-11-08 inspection) → patched `1f991770…d909` |
| Superseded, never deploy | `25aecf2` / `sha256:fdfbc406…` and `affb00c` / `sha256:34055ee7…` |
| Rollback image on host | `nova-public-website:69543cb1ea5811bee2fa89cf0c594a4aecd44f21`, `sha256:dad65566320b21676bbfc782981efede399c5ea975d7bf93f4d73c9bd6b80073` |

## 4. Finding F1 — the release publishes pricing/entry-journey content that is on the branch but not live today
The deployed build is `69543cb` (22 Oct). The branch also contains two earlier Eredox commits — `872ec5b` (24 Oct, "route NOVA pricing to governed self-service handoff") and `2ac140c` (2 Nov, "correct the customer subscription entry journey") — that were never deployed. **This work did not change them**, and the runtime-file lists since the RELEASE-002 baseline contain no pricing, registration, plan/billing-parameter, checkout, Odoo or Stripe file. But deploying the branch publishes them. Observed difference on `/pricing` (registration-link fingerprint live `2358392b0a3b87b6`, 5 links → release `2361e1d2cade707f`, 6 links):
* CTAs change from "Get Started" / "Start Free" to **"Subscribe to Launch / Growth / Professional / Business"** and **"Create Free Workspace"**; the Free plan now links to `/register?plan=free&billing_cycle=monthly` (live: the bare `/register`); Enterprise stays "Request a Quote".
* Plan copy changes ("All available frameworks"), pricing notes (USD, full annual amount charged; "Commercial confirmation remains subject to the Eredox/Odoo authority path"), six new `/plans/<slug>` pages (in the 69-page sitemap), and navigation/footer links (Free access, Compare approaches, Partners, Customer scenarios).
* The application accepts all of these registration links (verified read-only in RELEASE-002; re-verified in the smoke test: `/register?plan=growth&billing_cycle=annual` returns 200).
* Interaction with the accepted limitation: a visitor who clicks "Subscribe to …" can register but paid checkout inside the application is the known, separately managed limitation. I have **not** changed labels or flow (you prohibited modifying the subscription journey) and I make no claim that checkout works. Authorise with F1 acknowledged, or tell me to hold.

## 5. Contact address, enquiry-delivery path and Server1 (all read-only, 2026-11-08 03:00–03:10 UTC)
| Check | Result |
|---|---|
| `compliance@eredox.com` — domain mail path | `eredox.com` MX `mail.eredox.com` (91.193.42.16) is hosted on **cPanel shared hosting** (`cpanel-002-lax.hostingww.com`, Exim 4.100.1), not on Server1 or Server2. Ports 25/587 answer with a greeting (slow: about 20–40 s on the first try), STARTTLS offered. SMTP `RCPT TO:<compliance@eredox.com>` → `250 Accepted`. **Limits:** a made-up control mailbox was also accepted, so this proves the server takes mail for the domain, **not** that the mailbox exists or is read. No message was sent |
| Is it monitored? | **Not established** — needs the human test (A2) and the register |
| Brevo path from Server1 | `https://api.brevo.com` reachable (HTTP 401 without a key, as expected). Domain `eredox.com` is already authenticated for Brevo (DKIM CNAMEs, verification TXT, DMARC reports to Brevo) |
| CRM path from Server1 | `https://crm.nova.eredox.com` reachable (HTTP 303); resolves to `152.42.232.214` (the Odoo estate, untouched) |
| Credentials | Six variables once existed in container `nova-public-website-rollback-27518b31` (24 Sep) and were dropped by a later redeploy; the running container has none. Runbook step D3b builds `/opt/nova/secrets/nova-public-website.env` (mode 0600, no value printed, never overwritten) from them; validity is proven only by G1 |
| Server1 today | running website container `69543cb1…` healthy since 2026-10-22; live `nginx.conf` sha unchanged `660e4f8b…2815`, same bind-mount path; nginx `1.27-alpine` up since 2026-09-21; certificate valid to **2026-12-19**; disk 37% used (74 GB free), 1.9 GB RAM available; application `/health` 200 |
| Application worker (not touched) | `nova_compliance_celery_worker` still crash-looping: **6,106 restarts** (was 5,577 earlier today); recorded for its owners |

## 6. Window, operators, abort and rollback (full detail: `NOVA_PRODUCTION_RELEASE_RUNBOOK.md`)
* **Proposed window:** Tuesday **10 November 2026, 10:00–12:00 AEST** (00:00–02:00 UTC). About 70 minutes of work plus buffer; 20–30 s of 502 on `www.nova.eredox.com` only (the application, Odoo and other vhosts are not stopped; nginx is reloaded gracefully). Choose another date and the legal date moves with it (D0).
* **People:** release operator with `sudo` + docker on Server1; Founder (or delegate) for the acceptance walk-through and G1; a person who can read `compliance@eredox.com` and see the CRM; workstation with this repository, Git Bash, Windows OpenSSH.
* **Abort** (any one → roll back at once): container not healthy in 60 s; `nginx -t` fails or the in-container checksum is not `1f991770…`; any of the 6 security headers 0 or 2 times; unknown URL not 404; `robots.txt`/`sitemap.xml` not 200 or sitemap ≠ 69; **any effect on the application hosts** (`nova.eredox.com/health` not 200, register page not rendering); 5xx burst; a form log line with personal data or a secret; Founder rejects the walk-through. G1 failing is **not** an abort trigger.
* **Rollback (<5 min):** (a) restore the nginx file in place from `nginx.conf.bak-$STAMP`, `nginx -t`, reload, checksum `660e4f8b…`; (b) stop/remove the new container, rename `nova-public-website-rollback-$STAMP` back, start it, reload nginx (it must re-resolve the container). No database, volume or application container is involved.

## 7. Evidence on the exact release image (`evidence/`)
| Gate | Result |
|---|---|
| CI steps, bun 1.2.17, clean export of HEAD | install frozen OK · `bun audit` no vulnerabilities · lint 0 errors (7 baseline warnings) · typecheck clean · **124 tests** pass · build OK |
| Image | healthy · uid 10001 · read-only filesystem · patched TanStack code present, vulnerable code absent |
| `verify-release --browser` | **103/103** (CSP, headers, 404s, links, sitemap, canonical, external destinations, desktop+mobile console) |
| Discovery check | **PASS**, 61 checks, 0 FAIL |
| Journey / responsive (desktop, laptop, tablet, tablet landscape, mobile; booking, refresh, back/forward, failure) | **27/27**, 0 console errors |
| Patched **live** nginx.conf in front of the image | `nginx -t` OK · 8 headers once each · `/pricing/` 301 · unknown path and `/.env` 404 · `robots`, `sitemap`, `security.txt` 200 · form burst 403×4 then 429×2 |
| Smoke script on that stack | **25/25 PASS** (production baseline for comparison: 17 expected FAILs on the old build) |
| Enquiry path, synthetic sinks | **21/21 API + 5/5 real-browser** (earlier reports said 20; the harness has 21 API checks) |
| Cookie / Accessibility pages | 0 Google Fonts statement, Brevo disclosed, effective date 2026-11-10 |
Not run, unchanged: Rich Results Test and validator.schema.org (need the live URL; runbook §8), OS-layer image scan, real-user performance, any authenticated or payment test, root-only areas of Server1. The two original externally reported HIGH findings remain **NOT VERIFIED** (scanner report never supplied).

## 8. Search, Bing and IndexNow activation (after the smoke test passes; account holders)
Search Console: property check, sitemap submission (expect 69), live URL inspection of `/`, `/pricing`, `/frameworks/iso-27001`, `/industries`, **"Search generative AI" = Include** recorded with value/date, noindex pages shown excluded. Bing: confirm/import site, submit sitemap, Verify Bingbot. IndexNow: key file live; dry run lists **+6 new `/plans/*` pages and −3 now-noindex pages** against production; recommended submission is all 69 URLs once (titles/descriptions/structured data changed site-wide), conservative alternative 6; submission needs `NOVA_INDEXNOW_APPROVED=yes` and your approval. Crawler verification (official reverse-DNS / published-range methods) at +24 h, +7 d, +28 d; crawler access stays NOT VERIFIED until the post-release logs show verified hits against the new build.

## 9. Authorisation text for the Founder (copy, edit, send)
> I authorise the production release of NOVA-WEB-GO-LIVE-006: release commit `8d7c7d5621f54749ecf39efc5ddfa7bcc136e61c`, image ID `sha256:a49fd41f9764595e3e28d8f0defa56034b1b7d08f999b971f6dca9ad43de08c5`, archive sha256 `8b1388796dd108eb8583b719ab5b7939571311ebffb14f7e4b8620296bfa2e0a`, with the nginx change `nginx-www-vhost.diff` (sha256 `2d8f3b99…7898`), executed exactly as in `NOVA_PRODUCTION_RELEASE_RUNBOOK.md` v3 (document sha256 to be quoted from the delivery message), in the window **[date/time]**, operator **[name]**. I acknowledge finding F1 (the release publishes the pricing/entry-journey content already on the branch) and that the paid-checkout limitation remains. The legal effective date is **[publication date]**. The security-contact test is **[done / to be done in the window before D1]**. Gate G1 (one synthetic enquiry) is **[approved / not approved]**. Search Console, Bing and IndexNow activation are **[approved after smoke tests / not approved]**; IndexNow submission is **[all 69 / 6 new / none]**.

I will not start any production step before that message.
