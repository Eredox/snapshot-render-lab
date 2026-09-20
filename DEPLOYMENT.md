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
