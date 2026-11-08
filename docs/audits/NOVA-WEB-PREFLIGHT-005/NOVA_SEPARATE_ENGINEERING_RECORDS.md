# NOVA-WEB-PREFLIGHT-005 — Records for separate owners (nothing here was changed by the website release)

Date 2026-11-08. These items belong to other engineering owners or to the Founder. They are recorded so they are not lost; none is a website change.

## R1. Paid checkout inside the NOVA application — commercial dependency (subscription project)
* **Untouched in this package:** pricing cards, labels, registration links, `plan` / `billing_cycle` parameters, the application, Odoo, Stripe and billing. `git diff 86455be affb00c --stat -- src public ops package.json bun.lock Dockerfile vite.config.ts` lists 16 files (robots.txt, discovery metadata and JSON-LD in `seo.ts`/`about`/`contact`/`__root`, a footer link, the ABN constant, the legal text, the booking message rule and their tests, the Dockerfile digest pins); **none is a pricing, registration, plan/billing-parameter, checkout, Odoo or Stripe file**. Since PREFLIGHT-004's `25aecf2` only the legal text, the booking-form message rule and test tooling changed.
* **Known limitation (unchanged from PREFLIGHT-004 §3):** the application's paid checkout is not an approved production capability (application release records: global Odoo integration disabled, no general checkout, no Stripe live mode, Payment Terms legal document and platform administrator not in place as of 1–4 Nov; production state not re-verified because that needs an authenticated session and no payment or account is created by this work). A visitor who chooses "Subscribe" can register and reach the checkout step, where the application is expected to stop with "Odoo checkout is not configured."
* **Owner / decision:** Founder with the subscription engineering team. Release-risk decision H2 stays open; either outcome reopens no website work.

## R2. Application `celery_worker` crash loop — for the application engineering owners
* Observed read-only on 2026-11-08 (Server1): container `nova_compliance_celery_worker` status *restarting*, exit 1, **5,577 restarts**.
* Cause shown in its log: `kombu.exceptions.VersionMismatch: Redis transport requires redis-py versions 6.1.0 or later. You have 5.2.1`.
* The application repository's candidate `f6663d3` lists a "Celery Redis compatibility fix" (`NOVA-CHECKOUT-007F`); it is not deployed. `celery_beat` was also restarting. Effect: the application's background tasks are not processed in production.
* **Not changed, not restarted, not touched** by this work; it does not affect the website container, nginx or the website's forms (the forms call the CRM and Brevo directly).
* Suggested handover text: "celery_worker is crash-looping on a redis-py/kombu version mismatch (redis-py 5.2.1, kombu requires ≥ 6.1.0); 5,577 restarts as of 2026-11-08; candidate fix f6663d3 not deployed."

## R3. TLS certificate renewal check — scheduled before 19 November 2026
* `www.nova.eredox.com` certificate (Let's Encrypt, ECDSA) expires **2026-12-19**; automatic renewal begins about **2026-11-19**. `snap.certbot.renew.timer` is active, but the www deploy hook (copies the renewed pair into the nginx certificate mount and reloads) could not be read by the unprivileged `novaops` user, so it is **unverified**.
* Required of an operator with `sudo`, before 2026-11-19: `sudo certbot renew --dry-run`; `sudo ls -l /etc/letsencrypt/renewal-hooks/deploy/`; confirm the www hook (`ops/server1/nova-public-website-certbot-deploy-hook.sh`) is installed and executable; after renewal confirm `notAfter` on the served certificate.
* **Scheduled:** a one-time reminder, task `nova-www-tls-renewal-check`, fires **Monday 16 Nov 2026 09:00 (local, UTC+10)** in this app (it runs only while the app is open, otherwise on next launch, and only reminds: it performs no server action). This does not replace the operator check.

## R4. Mail authentication (DNS) — for the domain owner
Public DNS shows `eredox.com` has no SPF record (only a Brevo verification TXT), Brevo DKIM is configured, DMARC is `p=none`. Informational; no DNS was altered. See `NOVA_FORM_DELIVERY_AND_SECURITY_CONTACT.md` §2.

## R5. Other carried-forward items
* The `www.nova.eredox.com` blocks live only in a release-directory copy of the application's `nginx.conf`; an application release that moves the mount must carry them across (`DEPLOYMENT.md`).
* GitHub Actions run with the pinned Action SHAs has not happened (nothing pushed). The same steps pass locally under bun 1.2.17.
* The two original externally reported HIGH findings remain **NOT VERIFIED**: the scanner report was never supplied; no conclusion is drawn about them.
