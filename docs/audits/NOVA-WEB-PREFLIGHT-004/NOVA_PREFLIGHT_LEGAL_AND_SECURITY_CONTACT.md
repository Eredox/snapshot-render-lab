# NOVA-WEB-PREFLIGHT-004 — Legal wording and security-contact status

Date 2026-11-08. Nothing here is published. The wording is a ready-to-apply patch; legal text is not changed in the repository until the approver says so.

## 1. Who approves
The repository's own approval record (`src/data/legal-inventory.ts`) shows the Terms and Privacy Policy as **"Founder-approved; published_current"**; the Cookie Policy and Accessibility Statement as "Published public-site policy/statement" with no named approver; Subprocessors as "Approved content pending". No separate legal counsel or officer is named anywhere in the repositories reviewed. **The approver is therefore the Founder (Alf Delli Fiori)** unless the Founder names another legal owner. Publication happens by a code change to `src/data/legal.ts` (and a rebuilt image), then deployment.

## 2. Final wording (patch: `legal-text-proposed.patch`, applies cleanly to `25aecf2`; typecheck and 122 tests pass with it applied on a scratch export)
Facts behind each statement were taken from the code that runs, not from assumption.

**Cookie policy, "Third-party technologies" (replaces `legal.ts:104–105`) — corrects Google Fonts and discloses Brevo**
> The public website serves its fonts (Roboto) and all of its scripts, styles and images from its own domain, www.nova.eredox.com. Loading a page does not request resources from third-party domains, and no analytics or marketing provider is configured.
>
> No third-party embedded forms, video players or social widgets are configured. The Sign in link opens the separate NOVA application; it is not an embedded application session on the public site. The booking confirmation page includes an optional "Add to Google Calendar" link that opens Google Calendar in a new tab only if you select it; it passes the event title (which includes the framework you chose), date and time to Google, and does not include your name or e-mail address.
>
> Where enquiry delivery is enabled, the public contact, quote and demo-booking forms send what you enter (name, work e-mail, company, message and, for demo requests, framework, team size and preferred date and time) to a same-origin server endpoint. Eredox forwards the enquiry to its CRM and sends a notification e-mail to an Eredox mailbox through Brevo, a transactional e-mail service provider that processes that content on Eredox's behalf in order to deliver the message.
>
> To protect the forms from abuse, the server temporarily uses the network address of each request in memory to apply rate limits and records only a short non-reversible reference, never your name, e-mail address or message, in operational logs. The web server that hosts the site also keeps standard access logs that include the network address and browser user agent of each request.

**Cookie policy, "Cookies and similar technologies" (new paragraph after `legal.ts:41`) — browser history state**
> After you submit a demo-booking request, the confirmation page shows the details you entered (name, e-mail, company, framework, team size and preferred slot). To do this without placing them in the page address, the website keeps them in your browser's history entry for that tab. They are not stored in a cookie, local storage or session storage, are not sent to the website's server with later page requests, and may remain available only for as long as your browser keeps that tab's history (for example across a page refresh or a restored tab). Closing the tab or clearing your browsing history removes them.

**Accessibility statement (`legal.ts:298`):** delete "the Google Fonts resource," from the list of external content.

**Not in the patch, to be set by the approver when applying:** document `version`, `effectiveDate`, `lastReviewed` (they must equal the go-live date; the policy is currently v1.0, 2026-09-24).

**Privacy Policy / Subprocessors.** The Privacy Policy is the application-owned document promoted into `legal-published.ts`; I did not edit it. Brevo (and the CRM host) do not appear in it or in the Subprocessors list, which is "Approved content pending" and empty. The paragraph above is sufficient for the website's cookie policy; the Founder should decide whether the Privacy Policy and Subprocessors register also name Brevo (and its processing location, which is not stated in any repository). That is a documentation matter for the owner and **does not block deployment**.

## 3. Sequencing — the one real decision
| Path | What it means | Cost |
|---|---|---|
| **A (recommended)** | Founder approves the wording now; apply the patch, set version/dates, commit, **rebuild** the image, re-run the gates, then deploy (the runbook identity block is superseded by the new commit/image ID/checksum) | about 20 minutes of engineering; one release |
| **B** | Deploy `25aecf2` as is; publish the wording in the next release | For a short period the cookie policy says the site loads Google Fonts although it no longer does (an over-statement of third-party use; the Brevo/forms disclosure gap is the same as today). Lower risk than leaving it for long, but it is an inaccurate public statement until corrected |
Because Brevo is used only when form delivery is configured, and **production currently has no form-delivery configuration** (inspection S5), the Brevo sentence is phrased "Where enquiry delivery is enabled". If forms are enabled at deployment, publish the wording in the same window (Path A).

## 4. Security contact (`public/.well-known/security.txt`)
| Requirement | Status | Evidence |
|---|---|---|
| Contact published | **Yes** — `Contact: mailto:compliance@eredox.com` and `https://www.nova.eredox.com/contact`; `Expires: 2027-05-01T00:00:00Z`; `Policy: /security` | file in repo; served as `text/plain` by the release image |
| Address is the site's published general contact | Yes (`formsConfig.fallbackEmail`, shown on `/contact`) | `src/config/site.ts`, `src/routes/contact.tsx` |
| **Designated** as the vulnerability-disclosure contact | **NOT VERIFIED** — no document in any repository designates it; `compliance@` is a general address | repo search |
| **Monitored** | **NOT VERIFIED** — `eredox.com` publishes an MX record (`mail.eredox.com`), so mail is accepted for the domain; nothing shows that anyone reads this mailbox or acts on security reports | `nslookup` MX/DMARC; no mail sent |
| **Able to receive reports** | **NOT VERIFIED** — no test message was sent (that would be an outbound message on the Founder's behalf, and an SMTP probe proves only deliverability, not a human reader) | — |
**Result: explicit release HOLD retained**, as directed. To close it, the Founder (or the mailbox owner) must: (1) confirm in writing that `compliance@eredox.com` is the designated contact, or name a different published address (then change `security.txt`, rebuild); (2) name who monitors it and the response expectation; (3) send one test report from an outside mailbox and confirm it was received and read; (4) diarise `security.txt` renewal before 2027-05-01. No address was invented.
