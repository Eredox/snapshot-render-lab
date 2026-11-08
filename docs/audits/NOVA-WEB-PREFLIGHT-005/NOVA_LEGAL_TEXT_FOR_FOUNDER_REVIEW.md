# NOVA-WEB-PREFLIGHT-005 — Legal Path A: exact final legal text for Founder review and publication approval

Date 2026-11-08 · Branch `remediate/nova-web-remediate-001` · Founder decision: **Legal Path A**. The wording below is committed on the release branch (commit `f5b2cd3`, carried in the release commit `affb00c`) and is built into the new release image. **Nothing is published**: it goes live only with a separately instructed production release. The Founder is the recorded approver (`src/data/legal-inventory.ts`: Terms and Privacy "Founder-approved"); no other legal owner is named in any repository.

## 1. Decision requested and the effective-date rule
**Founder direction received (2026-11-08):** Legal Path A; the Google Fonts, Brevo, CRM, booking-privacy and abuse-control corrections are accepted *in principle*; final approval is recorded only after this exact wording is presented and the absence of unrelated changes is confirmed (§2a). **Effective date rule:** 8 November 2026 is used only if the site is published on that date; otherwise the **actual publication date** is used. Nothing is being published on 8 November (no deployment is authorised), so the value currently in the source, `2026-11-08` for both documents (version 1.1), is a **placeholder that must be replaced with the real publication date** in `src/data/legal.ts` (the `effectiveDate` and `lastReviewed` of the Cookie Policy and of the Accessibility Statement — four strings) before the release image is built. Because the date is part of the image, the commit, image ID and archive checksum are re-recorded at that point; the runbook step D0 checks this and refuses to continue while the placeholder is unconfirmed. This is the only change the date requires.

## 2. What was checked against what actually runs
| Statement in the text | Verified against | Result |
|---|---|---|
| Fonts (Roboto), scripts, styles and images come from `www.nova.eredox.com`; no third-party domain is requested on page load; no analytics or marketing provider | built image: `verify-release --browser` (CSP, external-destination checks, desktop+mobile console) and the discovery check; no `fonts.googleapis`/`gstatic` reference in served HTML (0 matches on `/legal/cookies`) | **True** — this corrects the old Google Fonts statement |
| "Add to Google Calendar" opens Google only if selected; passes title (with framework), date, time and a short fixed description; not name, e-mail or company | `src/routes/book-demo.confirmed.tsx:35–49` (`action, text, dates, ctz, details` only) | **True** |
| Booking details are kept in the browser's history entry for that tab, not in a cookie/local/session storage, not in the URL, not sent with later requests | `src/lib/booking-confirmation.ts`; journey suite J1–J6 (27/27 PASS on the final image) | **True** |
| Enquiry forms (contact, request a quote, framework, support) and the demo-booking form send name, work e-mail, company, message (+ framework, team size, preferred date/time for bookings) and the source page to a same-origin endpoint | `ContactForm.tsx` (used on contact, quote, framework and support pages), `BookingForm.tsx`, `crmPayload()` (`source_path`, `submitted_at`) | **True** |
| Forwarded to Eredox's CRM and a notification e-mail with the same details is sent to an Eredox mailbox through Brevo; visitor address is the reply address | `forms-server.ts`: CRM call, then `sendBrevoEmail()` (`replyTo`); synthetic delivery harness | **True** |
| Rate-limit address and duplicate fingerprint are kept in memory only; logs hold only a non-reversible reference; web server keeps standard access logs | `form-guards.ts` (`logFormEvent`, in-memory limiters/fingerprints); website log scan = 0 personal strings; nginx log format includes address and user agent | **True** |
| "Where enquiry delivery is enabled" | Production's website container currently has **no** delivery configuration (see the form-delivery document); the wording is true whether or not delivery is enabled | Deliberately conditional |

Not asserted because it cannot be verified from the repositories: where Brevo and the CRM host process data (country), Brevo's contracting entity, retention periods, and whether the Privacy Policy and the Subprocessors register should also name Brevo. **Those are Founder decisions** and do not block this release; the cookie-policy wording does not depend on them.

## 2a. Confirmation: no unrelated legal provision was modified
Programmatic comparison of every document, section and paragraph in `src/data/legal.ts` between the pre-change commit `82770c8` and the release commit (`evidence/legal-unrelated-provisions-check.txt`):
| Document | Sections | Changed | Unchanged |
|---|---|---|---|
| Cookie and Similar Technologies Policy | 14 | 2 ("Cookies and similar technologies": +1 paragraph, the 2 existing paragraphs kept verbatim; "Third-party technologies": 2 paragraphs replaced by 4) | 12 |
| Accessibility Statement | 11 | 1 ("Downloads, external and third-party content": the four words "the Google Fonts resource," removed) | 10 |
| Data Processing Addendum | 9 | 0 | 9 |
| AI Features | 7 | 0 | 7 |
| Subprocessors | 3 | 0 | 3 |
Document set and order are identical; titles, summaries, status and section headings are unchanged. Metadata changed only for the two edited documents (version, effective date, last reviewed). `src/data/legal-published.ts` (Terms of Service and Privacy Policy), the legal routes and `src/config` have **no** diff; `src/data/legal-inventory.ts` changes exactly two version labels (1.0 → 1.1). Nothing in pricing, registration, billing or subscription files changed.

## 3. Exact final text (generated from the source file, not retyped)
Paragraph order is as published. Only the items marked below differ from the previous version; every other section of both documents is unchanged.

### Cookie and Similar Technologies Policy — version 1.1, effective 2026-11-08, last reviewed 2026-11-08

**Section "Cookies and similar technologies" (paragraphs shown in full; the third is new)**

> A cookie is a small value stored by a website in a browser and sent back with later requests. Similar technologies include browser local storage, session storage, pixels, scripts and other client-side mechanisms that remember a choice or recognise a browser.

> The public website currently uses browser local storage for its consent record. Repository inspection found no public-site session storage, tracking pixel, analytics tag, marketing tag or embedded third-party application.

> After you submit a demo-booking request, the confirmation page shows the details you entered (name, e-mail, company, framework, team size and preferred slot). To do this without placing them in the page address, the website keeps them in your browser's history entry for that tab. They are not stored in a cookie, local storage or session storage, are not sent to the website's server with later page requests, and may remain available only for as long as your browser keeps that tab's history (for example across a page refresh or a restored tab). Closing the tab or clearing your browsing history removes them.

*(new paragraph)*

**Section "Third-party technologies" (replaces the two existing paragraphs with four)**

> The public website serves its fonts (Roboto) and all of its scripts, styles and images from its own domain, www.nova.eredox.com. Loading a page does not request resources from third-party domains, and no analytics or marketing provider is configured.

> No third-party embedded forms, video players or social widgets are configured. The Sign in link opens the separate NOVA application; it is not an embedded application session on the public site. The booking confirmation page includes an optional "Add to Google Calendar" link that opens Google Calendar in a new tab only if you select it; it passes the event title (which includes the framework you chose), date, time and a short fixed description to Google, and does not include your name, e-mail address or company.

> Where enquiry delivery is enabled, the public enquiry forms (contact, request a quote, framework and support enquiries) and the demo-booking form send what you enter (name, work e-mail, company and message and, for demo requests, framework, team size and preferred date and time), together with the page you sent it from, to a same-origin server endpoint. Eredox forwards the enquiry to its customer relationship management (CRM) system and sends a notification e-mail containing the same details to an Eredox mailbox through Brevo, a transactional e-mail service provider that processes that content on Eredox's behalf in order to deliver the message. Your e-mail address is also set as the reply address of that notification.

> To protect the forms from abuse, the server temporarily keeps, in memory only, the network address of each request (to apply rate limits) and a one-way fingerprint of recent submissions (to ignore accidental duplicates). Operational logs record only a short non-reversible reference, never your name, e-mail address or message. The web server that hosts the site also keeps standard access logs that include the network address and browser user agent of each request.

### Accessibility Statement — version 1.1, effective 2026-11-08, last reviewed 2026-11-08

**Section "Downloads, external and third-party content"**

> The public site does not claim accessibility conformance for external sites, the separate authenticated NOVA application, or any future third-party content. Any downloadable or linked material should be assessed for accessibility in its source format; the Legal Centre currently presents HTML documents on the public site.


## 4. What changed, mechanically
* `src/data/legal.ts`: Cookie Policy "Cookies and similar technologies" (+1 paragraph); "Third-party technologies" (2 paragraphs replaced by 4); Accessibility Statement (the words "the Google Fonts resource," removed); both documents version 1.0 → 1.1, dates 2026-09-24 → 2026-11-08.
* `src/data/legal-inventory.ts`: the two version labels 1.0 → 1.1.
* `src/routes/__tests__/legal-publication.test.ts`: metadata expectations updated; new test asserts no Google Fonts statement, Brevo disclosed, history-state paragraph present.
* No change to the Terms, the Privacy Policy, the published-legal registry or any pricing, registration or subscription file.

## 5. Approval record (to be completed by the Founder — not pre-filled)
| Item | Value |
|---|---|
| Direction received | 2026-11-08: Legal Path A; corrections accepted in principle; final approval to be recorded after this presentation |
| Wording approved as is / amended (attach changes) | *awaiting Founder's final approval* |
| Effective date | actual publication date (8 Nov 2026 only if published that day) — *to be entered at publication* |
| Approver and date | |
| Decision on naming Brevo/CRM in the Privacy Policy and Subprocessors register | |
