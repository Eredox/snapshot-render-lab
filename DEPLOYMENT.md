# Server1 deployment

The production build uses Nitro's `node-server` preset and starts with:

```text
node .output/server/index.mjs
```

The container listens on port `3000` and must be attached only to the
`nova_compliance_edge` Docker network. It must not publish a host port; the
Server1 edge routes `www.nova.eredox.com` to the private container alias
`nova-public-website`.

The image is built from the repository lockfile with the multi-stage
`Dockerfile`, runs as the non-root `app` user, and includes a local HTTP
healthcheck. TLS termination, HTTP-to-HTTPS redirect, and certificate renewal
remain edge responsibilities.

The source-controlled edge asset at
`ops/nginx/www.nova.eredox.com.conf` is an isolated virtual host for the
public website. It routes only `www.nova.eredox.com` to the private
`nova-public-website:3000` alias; it does not change the existing
`nova.eredox.com` or `crm.nova.eredox.com` server blocks. Install the
certificate as `www.nova.eredox.com.fullchain.pem` and
`www.nova.eredox.com.privkey.pem` in the edge certificate mount and retain the
HTTP-01 webroot location for the established renewal process.

Install `ops/server1/nova-public-website-certbot-deploy-hook.sh` as a root-only
Certbot deploy hook for the `www.nova.eredox.com` lineage. The hook discovers
the active edge certificate mount, stages the renewed pair with restrictive
permissions, validates Nginx, and sends a reload signal with restoration of
the prior pair if validation or reload fails. It is separate from the
existing NOVA certificate hook.

## Security headers, forms and release verification (NOVA-WEB-REMEDIATE-001)

**Header ownership (one source per header).** nginx sets HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy` and `Permissions-Policy`. The application (`src/lib/security-headers.ts`, applied in
`src/server.ts`) sets the nonce-based `Content-Security-Policy` and `Cross-Origin-Opener-Policy`. Do **not** add a
`Content-Security-Policy` to nginx: it would duplicate the application policy and cannot carry the per-request nonce.
The edge vhost in `ops/nginx/` also provides `server_tokens off`, a permanent trailing-slash redirect and a
`limit_req` zone for `/api/forms`; the zone declaration sits at top level of the file, so the file must be included
at `http {}` level. Run `nginx -t` on Server1 before reload.

**Forms.** `/api/forms` limits (per client: 20 attempts and 5 deliveries per 10 minutes; 120 deliveries per hour
overall) are held in process memory, which is correct for the single container behind nginx. If the site is ever
scaled beyond one replica, move the counters to a shared store or rely on the edge zone. The client address is taken
from `X-Real-IP` (set by nginx from the TCP peer); never publish the container port. Optional
`NOVA_FORM_ALLOWED_HOSTS` (comma-separated hosts) extends the permitted `Origin` hosts.

**Application dependency (verified 2026-11-08).** Plan and billing-interval links use `plan` and `billing_cycle` on
`https://nova.eredox.com/register`; the production NOVA application already reads them (read-only check of the live
pages, `scripts/journey/verify-signup-journeys.mjs`). Paid checkout inside the application is a separate commercial
dependency with its own release decision; see `docs/audits/NOVA-WEB-PREFLIGHT-004/`.

**Live edge layout (inspected read-only 2026-11-08).** The `www.nova.eredox.com` server blocks are not in the NOVA
application repository: they are appended by hand to the single `nginx.conf` that the shared `nova_compliance_nginx`
container bind-mounts from an application release directory
(`/opt/nova/app/releases/<sha>/docker/nginx/nginx.conf`, root-owned). Consequences: (1) edit that file **in place**
(`cat new > file`, never `mv`/`sed -i`, which creates a new inode the container will not see) and `nginx -s reload`;
(2) the container resolves `nova-public-website` when nginx loads, so **reload nginx after every website container
replacement**; (3) an application release that points the mount at a newer release directory must carry the www
blocks across or the website goes offline. The exact minimal change is `docs/audits/NOVA-WEB-PREFLIGHT-004/nginx-www-vhost.diff`.

**security.txt.** `public/.well-known/security.txt` expires on 2027-05-01; renew it before then and confirm the
published contact mailbox is monitored.

**Verification.** After building and starting the container locally:
`node scripts/verify-release.mjs --base http://127.0.0.1:3000 --browser` (set `MSYS_NO_PATHCONV=1` under Git Bash when
passing `--pages`). Use `scripts/lab-gzip-proxy.mjs` for transfer-size comparisons with the compressed edge.
