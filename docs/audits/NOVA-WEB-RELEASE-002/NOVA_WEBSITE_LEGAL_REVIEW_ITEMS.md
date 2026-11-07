# NOVA-WEB-RELEASE-002 — Legal and privacy review items (for legal-owner approval)

Date 2026-11-08. **Nothing in this package edits, re-versions or publishes legal text.** `src/data/legal.ts` and `src/data/legal-published.ts` are unchanged; the proposed wording below is for the legal owner to adopt, amend or reject through the existing publication process (versioned documents, effective dates, `legal-registry.ts`). I am not giving legal advice; statements of fact below are about what the website does and each is labelled with how it was verified.

## 1. Cookie policy vs actual behaviour
Published document: **Cookie and Similar Technologies Policy v1.0**, effective and last reviewed 2026-09-24 (`src/data/legal.ts`, slug `cookies`).

| # | Policy statement (location) | Actual behaviour of the release candidate | Status |
|---|---|---|---|
| C1 | "The public website loads the Roboto font stylesheet from Google Fonts domains through a stylesheet and preconnect links." (`legal.ts:104`) | **No longer true.** Roboto 400/500/700 (latin) are served from the site's own `/fonts/roboto/`; the Google Fonts `<link>` and preconnect were removed; the CSP forbids third-party fonts. Verified: every page requested from headless Edge uses one origin only (103/103 `verify-release` checks). **Inaccurate once the release candidate is deployed**; it is *accurate* for the site as it runs today (22 Oct build still loads Google Fonts). | **Must change at the same time as deployment** |
| C2 | "…the Google Fonts resource" (accessibility statement, `legal.ts:298`) | Same | Change together with C1 |
| C3 | "No third-party embedded forms, video players, social widgets, analytics provider or marketing provider is configured. Public forms submit to a same-origin server endpoint, which can forward enquiries to configured Eredox CRM/mail systems." (`:105`) | Still true. Add the one user-initiated third-party link (C6) and name the mail provider (§3) | Adjust |
| C4 | "…the consent record is the only verified browser storage" / "No public-site sessionStorage key was found" (`:41, :56`) | Still true for cookies/localStorage/sessionStorage. **A further browser mechanism now exists:** booking confirmation details are kept in the tab's history entry (`history.state`). It is not a cookie, localStorage or sessionStorage, but the policy defines "similar technologies" broadly | Add disclosure (proposed text B) |
| C5 | Analytics/marketing: none configured (`:71-74, :89`) | Still true; the consent banner's behaviour was **not changed** (no code change to consent in REMEDIATE-001 or RELEASE-002) | None |
| C6 | — | The booking confirmation page offers "Add to Google Calendar", a link that opens `calendar.google.com` in a new tab **only if the visitor clicks it**; the URL carries the event title (including the chosen framework), date and time, not the name or e-mail | Add disclosure |
| C7 | Application cookies `nova_session`, `nova_csrf` etc. (`:57-59`) | Concern the separate application; not re-verified here. The registration links lead there | Application owner to confirm |

## 2. Proposed text (for the legal owner)
**A — replaces `legal.ts:104` (Third-party technologies, first paragraph):**
> The public website serves its fonts (Roboto) and all of its scripts, styles and images from its own domain, www.nova.eredox.com. Loading a page does not request resources from third-party domains. If you choose to follow a link to another service, that service's own cookie and privacy terms apply.

**A2 — replaces `legal.ts:105` second sentence onward (append):**
> The booking confirmation page includes an optional "Add to Google Calendar" link. It opens Google Calendar in a new tab only if you select it, and passes the event title (which includes the framework you chose), date and time to Google in the link. It does not include your name or e-mail address.

**B — new paragraph in "Cookies and similar technologies" (after `legal.ts:41`):**
> After you submit a demo-booking request, the confirmation page shows the details you entered (name, e-mail, company, framework, team size and preferred slot). To do this without placing them in the page address, the website keeps them in your browser's history entry for that tab. They are not stored in a cookie, local storage or session storage, are not sent to the website's server with later page requests, and may remain available only for as long as your browser keeps that tab's history (for example across a page refresh or a restored tab). Closing the tab or clearing your browsing history removes them.

**C — replaces `legal.ts:298` words "the Google Fonts resource":** delete the item from the list.

**D — version housekeeping:** the legal owner decides whether this is v1.1 with a new effective/last-reviewed date and what change record `legal-registry.ts` needs. The wording is only accurate after the release candidate is live; **publish the cookie-policy change in the same release window as the website deployment, not before** (before, A would be false).

## 3. Related disclosures affected (Privacy Policy, Terms, Subprocessors)
The Privacy Policy and Terms are the application-repository documents promoted into `legal-published.ts` (`legal-inventory.ts`); the website `Subprocessors` document is **"Approved content pending"** with an empty `subprocessors` list.

| # | Matter | Fact | Question for the legal owner |
|---|---|---|---|
| P1 | Enquiry / demo-booking / quote forms | Fields sent to Eredox's CRM endpoint (`NOVA_CRM_ENQUIRY_URL`, signed) **and e-mailed through Brevo's transactional API** (`api.brevo.com`). Brevo and the CRM host are therefore recipients of prospects' personal data. **Brevo does not appear anywhere in the published legal text** | Is Brevo a subprocessor/recipient to be named in the Privacy Policy and the Subprocessors list? Where is it located / which entity contracts? |
| P2 | IP address and abuse controls | The app uses the client IP (from nginx `X-Real-IP`) only in memory for rate-limit windows, and logs a per-process salted 8-hex hash, never names, e-mails or message text. nginx access logs (outside this repository) record IP addresses and request paths. Retention of nginx/Docker logs is **not documented** | Add rate-limiting/security logging as a purpose; state retention |
| P3 | Honeypot field | A hidden field named `website` is used to detect bots; its content is discarded and not stored | None expected |
| P4 | Duplicate suppression | A hash of form content is held in server memory for 15 minutes to avoid duplicate deliveries | Minor; covered by P2 |
| P5 | Booking details in history state | See proposed text B | Approve text |
| P6 | Registration / checkout links | The website passes only `plan` and `billing_cycle` to nova.eredox.com; no personal data in URLs (verified). Registration itself is governed by the application's Terms/Privacy | None for the website |
| P7 | **Trial wording** | Terms §11 (and the policies) still state a 30-day self-service trial; the corrected website and application offer no trial (the application journey report registers this as F6) | Align or confirm |
| P8 | **Currency** | The free-access liability cap is stated in **Australian dollars**; plans and prices are USD | Align or confirm |
| P9 | Analytics / marketing | None configured; consent choices have no effect today | Keep policy statement true; revisit before any tag is added |
| P10 | International transfer | Brevo and the CRM/Odoo host locations are not stated in the repository | Legal owner to confirm |

## 4. Vulnerability-disclosure contact
| Question | Finding |
|---|---|
| Is `compliance@eredox.com` published as the contact? | Yes — as the site's general `formsConfig.fallbackEmail` (`src/config/site.ts`) and on the contact page; the `/security` page tells reporters to use "the address listed there" (`src/routes/security.tsx:114`). The new `security.txt` lists it plus the contact page |
| Has Eredox **designated** it as the vulnerability-disclosure contact? | **Not confirmed.** No document in the repository designates a security mailbox; it is a general compliance address. REMEDIATE-001 recorded that no dedicated `security@` exists. I did not invent one |
| Is the mailbox **monitored**? | **NOT VERIFIED.** `eredox.com` publishes an MX record (`mail.eredox.com`) and a DMARC record, so the domain receives mail; whether anyone reads `compliance@` was not tested (no message was sent, no SMTP probe was made) |
| Required action | The Founder/legal owner must (a) confirm the address is the designated disclosure contact or name another, (b) confirm who monitors it and the response expectation, (c) send **one** acknowledged test message from an authorised mailbox, (d) put a recurring reminder to renew `security.txt` before **2027-05-01**. Until then the `security.txt` is accurate but the monitoring claim is unproven; **this is a release condition, not an engineering fix** |

## 5. Decisions needed
1. Approve, amend or reject proposed texts A, A2, B, C and set version/date (legal owner).
2. Decide on Brevo/CRM disclosure and the Subprocessors list (P1, P10).
3. Resolve trial and currency inconsistencies (P7, P8) — may follow the release but should not be forgotten.
4. Designate and prove the disclosure mailbox (§4).
