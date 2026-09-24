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
NOVA_CRM_ENQUIRY_URL=<authenticated server-side CRM/Odoo bridge endpoint>
NOVA_CRM_ENQUIRY_TOKEN=<optional server secret>
```

Port 465 is implicit TLS and must remain paired with `EREDOX_SMTP_SECURE=true`.
The mail `From` address is fixed by configuration to the NOVA Compliance
mailbox; the visitor address is used only as `Reply-To`.

The CRM bridge receives JSON containing `source: "nova-public-website"`, the
form type, visitor details and booking details where supplied. It must return a
2xx response after creating the enquiry. The website deliberately does not
guess an Odoo database, model, or authentication scheme: the bridge owns that
integration contract.

## Controlled verification

After the runtime variables and CRM bridge are configured on the server, submit
one controlled test form with an approved test visitor address. Verify the TLS
connection, CRM record, mailbox delivery, `From`, `Reply-To`, and the absence of
credentials from browser source, API responses and normal logs. Do not include
the SMTP password in test payloads or diagnostics.
