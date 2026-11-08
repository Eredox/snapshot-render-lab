# NOVA-WEB-PREFLIGHT-005 — Enquiry-form delivery and security-contact verification

Date 2026-11-08. Server1 was **read only** in this package (the one attempted write — a restricted configuration file — was refused by the session's safety classifier and not made; see §1.4). No real credential value was printed, stored in the repository or sent anywhere. No live public form was submitted; no real CRM record or e-mail was created.

## 1. Website enquiry delivery

### 1.1 The existing integration (no new CRM, e-mail provider or workflow was introduced)
| Part | Fact | Evidence |
|---|---|---|
| Endpoint | same-origin `POST /api/forms` (contact, quote, framework, support enquiries and demo booking) | `src/lib/forms-server.ts`, `docs/forms-runtime.md` |
| Order | 1) signed request to the CRM bridge; 2) only if the CRM returns a validated success object, a notification e-mail through Brevo's HTTPS API (`api.brevo.com`) | `handleFormsRequest()` |
| CRM | Odoo module `nova_website_intake`, `https://crm.nova.eredox.com/nova_website_intake/v1/enquiries`, HMAC-SHA256 signed. The host resolves to `152.42.232.214`, i.e. **not Server1**; it answers (HTTP 303 on `/` — read-only HEAD). It is part of the separate Odoo/CRM estate and was not touched | DNS, HEAD `/` |
| E-mail | Brevo transactional API. The domain `eredox.com` is already set up for Brevo: `brevo-code` TXT record, DKIM selectors `brevo1/brevo2._domainkey` CNAME to `*.dkim.brevo.com`, DMARC reports to `dmarc.brevo.com` | public DNS |
| Required variable **names** | `BREVO_API_KEY`, `NOVA_FORM_FROM_EMAIL`, `NOVA_FORM_TO_EMAIL`, `NOVA_CRM_ENQUIRY_URL`, `NOVA_WEBSITE_INTAKE_KEY_ID`, `NOVA_WEBSITE_INTAKE_KEY_SECRET` (optional: `NOVA_FORM_ALLOWED_HOSTS`) | `forms-server.ts`, `docs/forms-runtime.md` |
| Secure mechanism on Server1 | The application's secrets live in `/opt/nova/secrets/` (`root:novaops`, mode 0770 with an ACL for `novaops`) and are injected with compose `env_file`. The website container is started by `docker run` and has **no** env file | `docker inspect` (names/labels only); `ls -ld`, `getfacl` |

### 1.2 Why production cannot deliver today
* The running website container (`nova-public-website:69543cb1…`, started 2026-10-22) carries none of the six variables.
* Of the 28 website containers still on Server1 (names only inspected), **exactly one** ever carried them: `nova-public-website-rollback-27518b31` (created 2026-09-24, all six present). Every later container, including the running one, has none. The configuration was therefore **lost when the website was redeployed after 24 Sep** (a `docker run` without the variables), not never provisioned. The 24 Sep values are the only copy visible on the host.
* Non-secret values in that container match the documentation: sender and destination are both `compliance@eredox.com` and the CRM URL is the one above. The three secrets are present with plausible lengths (Brevo key 89 characters, intake key id 23, intake secret 64). **Whether those secrets are still valid is not known** — only a real delivery proves that.
* Effect today: a visitor who submits a form receives "Form delivery is temporarily unavailable" (HTTP 503; confirmed on the final image with the variables absent). No enquiry is lost silently, but none is delivered. This predates the release and is unchanged by it.

### 1.3 Defect found and fixed in the website (pre-existing since the original forms)
The demo-booking form's "anything specific" box is optional, but the server required a non-empty message, so **a booking submitted without notes was rejected (HTTP 400) and the visitor saw "We could not send your booking"** — even with delivery fully configured. Found by the unstubbed browser test. Fix (`src/lib/forms-server.ts`): the message is optional for `demo-booking` only (a fixed line "Demo booking request - no additional notes provided." is sent so the CRM and the e-mail always have text); all other forms still require a message. Unit test added; no other behaviour changed.

### 1.4 Restoring the configuration — prepared, not applied
I tried to stage a root-group-only file `/opt/nova/secrets/nova-public-website.env` (mode 600) built server-side from the 24 Sep container's environment without printing any value. The session's safety classifier **refused the remote write**, so nothing was written to Server1 and I did not try to work around it. The step is therefore an operator action in the release runbook (D3b). It reads the six variables from that container straight into a 0600 file (no value is displayed), prints only the variable names, the file mode and a short checksum, and must be refused if the file already exists (never overwrite). Alternative: the Founder/operator supplies the values from the Brevo dashboard and the Odoo `nova_website_intake` key page; either way the values never go in chat or the repository. The new container then starts with `--env-file /opt/nova/secrets/nova-public-website.env`.

### 1.5 Verification performed (exact release image, synthetic data, local, nothing sent to a real service)
Harness: `scripts/forms/run-delivery-harness.sh` — the real image (read-only, non-root, all capabilities dropped) with a mock CRM bridge that verifies the exact HMAC canonical contract and a mock Brevo that checks the `api-key` header and message shape. The only test-time code is a preload that redirects `api.brevo.com` to the mock; it is not in the image.

| Check | Result |
|---|---|
| Contact enquiry → CRM record with valid key id, signature, timestamp, nonce, content-type; allow-listed fields only; source page recorded | **PASS** |
| Notification: goes to the configured destination; sender is the fixed Eredox address; visitor address is Reply-To only; message present; markup escaped in the HTML body | **PASS** |
| Demo booking (including **without** optional notes) → CRM `demo-booking` record with framework, team size, date, time; e-mail subject "NOVA demo booking enquiry" | **PASS** |
| Spam/abuse controls preserved: honeypot answered like success but nothing delivered; immediate duplicate not delivered twice; foreign Origin 403; wrong content type 415; oversize 413; invalid e-mail 400; unknown field 400; none of those reached the CRM or the mailbox | **PASS** |
| Rate limiting: per-client delivery limit engages (429) at the 6th request; edge zone (`nginx-www-vhost.diff`) 403/403/403/403/429/429 | **PASS** |
| Failure handling: CRM 500 → exactly 2 attempts, visitor sees failure (502), **no e-mail sent**; CRM 401 → not retried, no e-mail | **PASS** |
| Privacy: website log lines hold only event, status, reason and an 8-character salted hash; scan for names, e-mails, message text, markup and secrets = **0** hits | **PASS** |
| Browser end-to-end with the **real** forms (fetch not stubbed): contact form shows confirmation and delivers; booking form reaches `/book-demo/confirmed` with no personal data in the URL and delivers; with the CRM failing the visitor sees an error, never a false success | **PASS (5/5)** |
Evidence: `evidence/forms-delivery.txt`, `evidence/forms-ui-e2e.txt`, `evidence/forms-site-log.txt`.

### 1.6 What is NOT verified, and what closes it
Not verified: that the stored Brevo key and intake key are still valid; that a Brevo message reaches the mailbox `compliance@eredox.com`; that a lead appears in the production CRM. These need one real submission, which creates one real CRM lead and one real e-mail. The brief asked for an "approved environment", and none exists besides production, so I did **not** run it. Proposed gate G1 (runbook §7a): after deployment with the env file, the operator sends one request from Server1 over loopback with an obviously synthetic payload (`"NOVA-SYNTHETIC-TEST – please delete"`, a Founder-controlled address), the Founder confirms the e-mail arrived at `compliance@eredox.com` and the lead exists in the CRM, and the lead is then archived. If the Founder prefers a different environment (a staging CRM/mailbox), name it and the same script runs there.

## 2. Security contact (`compliance@eredox.com`, retained provisionally)
`public/.well-known/security.txt` is **unchanged**: `Contact: mailto:compliance@eredox.com` and the contact page; `Expires: 2027-05-01`.

| Question | Status | Evidence / reason |
|---|---|---|
| Is the mailbox monitored? | **NOT ESTABLISHED** | Nothing in any repository or on Server1 names a person or process that reads it. A monitored mailbox can only be shown by a human reading a test message |
| Can it receive external mail? | **PARTIAL (domain level only)** | `eredox.com` publishes `MX 10 mail.eredox.com` (91.193.42.16). From this workstation TCP port 25 accepted the connection but the server sent no greeting within 15 s (inconclusive: ISP filtering, tarpit or greylisting). I did not retry, and **no message was sent** |
| Harmless test report delivered? | **NOT DONE** | There is no mail route available to this session that I may use: the Brevo key and the application's SMTP credentials are secrets in root-only stores I must not read; sending from this workstation "as" `compliance@eredox.com` or any other address would be an unauthenticated spoof; no Eredox mailbox is connected to this session |
| Monitoring responsibility recorded? | **NOT RECORDED** — I will not invent an owner | register below |
**The requirement is not complete and stays an explicit release HOLD (H3).**

Domain mail-authentication observations (public DNS; not changed; informational, not a release condition): the apex has **no SPF record** (only the Brevo verification TXT); DKIM for Brevo is in place; DMARC is `p=none` with reports to Brevo. Mail sent through Brevo as `compliance@eredox.com` therefore authenticates by DKIM; other senders cannot be validated by SPF. The DNS owner should decide whether to publish SPF and tighten DMARC. No DNS record was altered.

### 2.1 Test procedure to close H3 (about 10 minutes, mailbox owner)
1. From an **external** mailbox the Founder controls (not an Eredox address), send to `compliance@eredox.com`:
   Subject `NOVA security-contact test – harmless – please acknowledge`
   Body `This is a harmless test of the security contact published at https://www.nova.eredox.com/.well-known/security.txt. No vulnerability is being reported. Please reply to confirm receipt and tell me who monitors this mailbox.`
2. The mailbox owner confirms receipt and replies. Record: send time, delivery time, the `Received:` line naming `mail.eredox.com`, who read it, and how long it took.
3. Complete the register (below), and diarise renewing `security.txt` before 2027-05-01.

### 2.2 Security-contact register (to be completed by the Founder / mailbox owner — nothing pre-filled)
| Field | Value |
|---|---|
| Designated vulnerability-disclosure contact (address) | provisionally `compliance@eredox.com` — confirm or replace (replacement requires editing `security.txt` and rebuilding) |
| Responsible person / role for monitoring | |
| Backup person | |
| Expected acknowledgement time | |
| Test message sent (date/time, from) | |
| Test message received and read (date/time, by) | |
| `security.txt` renewal due | before 2027-05-01 |
