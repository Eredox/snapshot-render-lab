# NOVA public form delivery

The public website posts contact, quote and demo-booking forms to the same-origin
`POST /api/forms` endpoint. The server validates the submission, creates an
enquiry through the configured CRM bridge, and then sends an email through the
Eredox mailbox using implicit TLS/SMTPS.

## Runtime configuration

Set these variables only in the server/container secret configuration. Never put
the password or CRM token in the repository, browser bundle, image labels or
logs:

```text
EREDOX_SMTP_HOST=mail.eredox.com
EREDOX_SMTP_PORT=465
EREDOX_SMTP_SECURE=true
EREDOX_SMTP_USERNAME=compliance@eredox.com
EREDOX_SMTP_PASSWORD=<server secret>
NOVA_FORM_FROM_EMAIL=compliance@eredox.com
NOVA_FORM_TO_EMAIL=compliance@eredox.com
NOVA_CRM_ENQUIRY_URL=https://crm.nova.eredox.com/nova_website_intake/v1/enquiries
NOVA_WEBSITE_INTAKE_KEY_ID=<server-side key id>
NOVA_WEBSITE_INTAKE_KEY_SECRET=<server-side secret>
```

Port 465 is implicit TLS and must remain paired with `EREDOX_SMTP_SECURE=true`.
The mail `From` address is fixed by configuration to the NOVA Compliance
mailbox; the visitor address is used only as `Reply-To`.

The CRM bridge receives only the allowlisted Odoo intake fields. The website
server signs each request with HMAC-SHA256 using the exact canonical request
contract implemented by `nova_website_intake`:

```text
POST
/nova_website_intake/v1/enquiries
enquiry.create
<timestamp>
<nonce>
<operation-id>
<sha256-body>
application/json
<key-id>
```

The JSON body is serialized once; those exact UTF-8 bytes are hashed and sent.
Each logical submission gets one operation ID. A transport retry reuses that
operation ID and body, but generates a fresh nonce, timestamp and signature.
The shared key ID and secret are server-only and are never sent to browser
code. Bearer authentication is not used.

The bridge must return a validated CRM success object before the website sends
the SMTP notification. CRM failures do not send email or show visitor success.
Transient transport/500/503 failures use only a bounded retry policy; validation,
authentication, conflict and media-type failures are not retried.

## Controlled verification

After the runtime variables and CRM bridge are configured on the server, submit
one controlled test form with an approved test visitor address. Verify the TLS
connection, CRM record, mailbox delivery, `From`, `Reply-To`, and the absence of
credentials from browser source, API responses and normal logs. Do not include
the SMTP password in test payloads or diagnostics.
