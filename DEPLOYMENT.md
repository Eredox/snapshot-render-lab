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
