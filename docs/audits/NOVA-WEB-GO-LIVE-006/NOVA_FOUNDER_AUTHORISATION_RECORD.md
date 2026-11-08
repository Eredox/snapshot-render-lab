# NOVA-WEB-GO-LIVE-006 — Founder production authorisation (record)

Recorded: 2026-11-08 (UTC 04:57). Status: **AUTHORISED, NOT YET EXECUTED.** Nothing has been deployed, pushed or changed on Server1 at the time of this record.

## What was authorised (Founder message "NOVA-WEB-GO-LIVE-006 — FOUNDER PRODUCTION AUTHORISATION")
- Production deployment of the public website on **Tuesday 10 November 2026, 10:00–12:00 AEST** (00:00–02:00 UTC).
- Release commit `8d7c7d5621f54749ecf39efc5ddfa7bcc136e61c`; image `nova-public-website:8d7c7d5621f54749ecf39efc5ddfa7bcc136e61c` (`sha256:a49fd41f9764595e3e28d8f0defa56034b1b7d08f999b971f6dca9ad43de08c5`); archive sha256 `8b1388796dd108eb8583b719ab5b7939571311ebffb14f7e4b8620296bfa2e0a`; runbook v3 (file sha256 `62edcc1f48de271f8e2c9eb3a088e0cd73c2cf2e69a939758df5d31e2c6eca6e`).
- **F1 accepted:** updated subscription pages and buttons become publicly visible while paid checkout remains under separate development. No change to subscription, registration, pricing, Odoo, Stripe or billing.
- Instructions: operator with sudo; preserve current container, configuration and rollback; confirm `compliance@eredox.com` receives an actual security-contact test message and record its monitoring owner; restore the existing approved enquiry credentials securely; verify through gate G1 that a real enquiry reaches both the CRM and the designated mailbox; **treat failed enquiry delivery as a mandatory go-live issue — investigate within the window and do not declare success while unresolved**; complete all deployment, nginx, TLS, SEO, security and smoke tests; follow the abort and rollback procedures on a failed mandatory check; after success, Google and Bing activation and the approved IndexNow submission of the **69 sitemap URLs**; record the deployed image, evidence and final status.
- Out of scope: Knowledge Centre and public AI Sales Assistant (separate projects); no further development; no repeat of completed preflight work.

## Authorisation boundaries (how this record will be applied)
- Authorised approvals now on record: gate G1 (one synthetic enquiry creating one real CRM lead and one e-mail), the security-contact test message, IndexNow submission of all 69 URLs (`NOVA_INDEXNOW_APPROVED=yes`).
- Not on record, still required: **a named operator with `sudo` on Server1** (nginx file is `root:root`; `novaops` has docker only) and a person who can read `compliance@eredox.com` during the window. Without them the sudo steps (D5 and the certbot check) cannot run and the release is not started.
- D0 applies: if the actual publication date is not 2026-11-10, the four legal date strings are corrected and the image rebuilt and re-verified before D1, and the Founder is told the new identity.
- No action is taken outside the window.

## Execution log
Not started. To be completed at the window (image ID on host, nginx checksum, smoke result, G1 result, monitoring owner, activation steps, final GO/HOLD).
