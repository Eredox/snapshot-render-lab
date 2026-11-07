# NOVA-WEB-AUDIT-001 — Report B: Independent Website Security Assessment

**Client:** Eredox Pty Ltd · **Target:** https://www.nova.eredox.com (public same-origin routes only) · **Date:** 2026-11-07
**Type:** defensive, non-invasive, read-only (bounded GET/HEAD/OPTIONS, repository inspection, static and dependency analysis)
**Labels:** CONFIRMED · LIKELY · NOT VERIFIED · NOT TESTED · NOT APPLICABLE · **Severity:** CRITICAL / HIGH / MEDIUM / LOW / INFORMATIONAL (qualitative, with reasoning; CVSS quoted only where it comes from a published advisory)
The security rating below is **independent of, and not combined with, the SEO score** in Report A.

---

## 1. Executive security summary

* **Overall posture: reasonable for a static-content marketing site, with no CRITICAL or demonstrated-exploitable HIGH issue found.** No cookies are set, no authenticated surface exists on this origin, no secrets or source maps are exposed, no CORS headers are emitted, HTTPS is enforced, and HSTS/XFO/nosniff/Referrer-Policy/Permissions-Policy are present.
* **The two previously reported HIGH findings are NOT VERIFIED.** The original scanner report was not available to us (no tool name, test, URL or evidence), so we have not guessed their nature. We list, in §4, the live conditions that a generic scanner could plausibly have rated HIGH, and what we found for each; Eredox should supply the original report for a one-to-one retest.
* **Most important findings (all MEDIUM):**
  1. **SEC-001 — Content-Security-Policy is absent in production** although the repository's own edge vhost (`ops/nginx/www.nova.eredox.com.conf`) defines one → configuration drift between source and live edge. CONFIRMED (headers observed from two clients on the audit host).
  2. **SEC-002 — Vulnerable framework version:** `@tanstack/react-start 1.168.32` / `@tanstack/start-server-core 1.169.17` are affected by **GHSA-qx66-fv34-fjm8** (reflected XSS via server-function responses; advisory rating CVSS 9.3, fixed in react-start ≥ 1.168.60 / start-server-core ≥ 1.169.39). **Contextual exposure is LOW today** — the application defines no server functions and `/_serverFn/*` returns 403 — so we rate it MEDIUM (patch promptly) rather than HIGH.
  3. **SEC-005 — `/api/forms` has no abuse controls** (no rate limit, CAPTCHA/honeypot, Origin or Content-Type enforcement; fans out to a CRM and Brevo e-mail). Source-confirmed; **not tested live** (form submission is prohibited).
* **Release integrity:** production is a ~22 Oct 2026 build, behind `origin/main` (2 Nov). Combined with the missing CSP this suggests the deployment/edge-config process is not reproducibly driven from the repository (SEC-007).
* **TLS posture is NOT VERIFIED** from the audit host: it sits behind Avast Web/Mail Shield TLS inspection, so the certificate and cipher data seen are Avast's, not the origin's. Per engagement rules we did not bypass it.

---

## 2. Test scope, methods and constraints

**In scope (live):** `https://www.nova.eredox.com` same-origin routes. **Out of scope (not crawled/tested):** `nova.eredox.com` (NOVA app, registration), `crm.nova.eredox.com`, `ai.nova.eredox.com`, payment/identity providers, Brevo, Google. 

**Performed**
* 82-URL bounded crawl (GET, 0.45 s spacing, descriptive UA, robots.txt respected) + ~25 targeted probes (Report C).
* Response-header inspection on `/`, `/robots.txt`, `/sitemap.xml`, assets, 404s and redirects; CORS probe (`Origin: https://example.org`); `OPTIONS /api/forms` (no body); one benign `GET /_serverFn/audit-nonexistent`; `.map` and security.txt existence probes.
* Static review of `origin/main` (`c01d8f6`), including `src/lib/forms-server.ts`, `src/server.ts`, `src/start.ts`, `src/routes/__root.tsx`, booking flow, cookie consent, Dockerfile, `.dockerignore`, `ops/nginx/*`, CI workflow.
* Dependency analysis: `osv-scanner 2.4.0` over `bun.lock` (502 packages). **Note:** osv-scanner sends package names/versions (not secrets, not source) to osv.dev.
* Secret scanning: `gitleaks 8.30.1` on the exported tree and on the full `origin/main` history (216 commits) — **0 findings**; regex scan of all 83 production JS/CSS assets and 82 HTML pages for key/token/webhook patterns — **0 findings**.
* Headless-Chrome rendering of 7 public pages (no input, no form interaction).

**Deviations to disclose (no harm done):**
1. While checking apex/www canonicalisation one **HEAD request was sent to `https://nova.eredox.com/`** (out-of-scope host, root document headers only). No further requests were made to it and nothing from it is assessed here.
2. `OPTIONS /api/forms` and `GET /_serverFn/audit-nonexistent` touch application endpoints; both carried no payload and changed no state.
3. Lab rendering generated ~45 page loads over ~10 minutes in addition to the crawl (still low-rate).

**Not performed (prohibited without separate authorisation):** active scanners (Nuclei/ZAP/Burp), fuzzing, brute forcing, port sweeps, load testing, authentication attacks, form submission, exploit payloads. **No account, payment, or destructive operation occurred; no production configuration, DNS, server, container, repository, branch or secret was modified.** All artefacts were written to the scratch area and to the audit folder only.

**Vantage-point limitation (TLS):** `openssl s_client` and the OS trust store on the audit host present a leaf certificate `CN=www.nova.eredox.com` **issued by "Avast Web/Mail Shield Root"** (valid 2026-09-20 → 2026-12-19). That is Avast's locally generated interception certificate, not the origin's. Therefore: origin certificate chain/issuer/expiry, supported protocol versions and cipher suites are **NOT VERIFIED**. (TLS 1.0/1.1 "no protocols available" errors were client-side, not server evidence.) Headers/bodies were still received, but a transparent AV proxy sits in the path; we assume it did not remove response headers (none of its known behaviours do) and rate header findings CONFIRMED with that caveat. Re-run SEC-001 and SEC-008 checks from an uninspected network.

---

## 3. Findings

Severity reflects actual exposure on a static public marketing site with no sessions, not scanner labels. Source references are to `origin/main` unless noted.

### Summary table

| ID | Severity | Title | Status | Confidence |
|---|---|---|---|---|
| SEC-001 | MEDIUM | No Content-Security-Policy in production (repo defines one) | CONFIRMED | High |
| SEC-002 | MEDIUM | TanStack Start/Router XSS advisory GHSA-qx66-fv34-fjm8 in installed version | CONFIRMED (version) / LIKELY not exploitable | High / Medium |
| SEC-003 | LOW | seroval 1.5.6 advisories (SSR serializer) | CONFIRMED (version) / LIKELY not exploitable | Medium |
| SEC-004 | LOW | Other lockfile advisories (build/dev toolchain; zod, nanoid) | CONFIRMED (version) / runtime reach NOT VERIFIED | Medium |
| SEC-005 | MEDIUM | `/api/forms` lacks rate limiting / anti-automation / Origin & content-type checks | CONFIRMED (source) / NOT TESTED (live) | High (source) |
| SEC-006 | LOW | Personal data placed in URL query string after booking | CONFIRMED (source) | High |
| SEC-007 | MEDIUM | Production build and edge config drift from `main`/repo | CONFIRMED | High |
| SEC-008 | NOT VERIFIED | Origin TLS certificate / protocols / ciphers | NOT VERIFIED | — |
| SEC-009 | INFO | HSTS present; not preload-eligible | CONFIRMED | High |
| SEC-010 | LOW | Missing COOP/CORP, no `Cache-Control` on HTML/media; X-Frame-Options only (no `frame-ancestors`) | CONFIRMED | High |
| SEC-011 | INFO | `Server: nginx/1.27.5` version disclosure | CONFIRMED | High |
| SEC-012 | LOW | No `security.txt`; soft-404 200 responses can be misread by scanners as present | CONFIRMED | High |
| SEC-013 | LOW | Supply-chain hygiene: floating base images/tags, no dependency audit in CI, template remnants | CONFIRMED (source) | High |
| SEC-014 | INFO | Positive controls observed | CONFIRMED | High |

### SEC-001 — Content-Security-Policy absent in production — **MEDIUM**, CONFIRMED
* **Affected:** all responses from `www.nova.eredox.com` (edge nginx).
* **Evidence:** response headers on `/` (curl and an in-app Chrome `fetch`) contain only `strict-transport-security`, `x-frame-options`, `x-content-type-options`, `referrer-policy`, `permissions-policy`. No `content-security-policy`. Source `ops/nginx/www.nova.eredox.com.conf` line "add_header Content-Security-Policy … always" defines a CSP (`default-src 'self'; script-src 'self' 'unsafe-inline'; … frame-ancestors 'self'; object-src 'none'; form-action 'self'`).
* **Impact:** CSP is defence-in-depth against XSS. No XSS vulnerability was found, so the missing header alone has no demonstrated exploit; it matters because (a) the site posts personal data to `/api/forms`, (b) SEC-002 lists XSS in the framework and the advisory's own temporary mitigation is a restrictive CSP, and (c) the deployed edge does not match the repository (SEC-007).
* **Preconditions to exploit:** a separate injection flaw.
* **Note:** even the committed CSP is soft (`'unsafe-inline'` for scripts, needed for SSR JSON-LD/hydration data). A nonce/hash-based policy is the stronger end state.
* **Remediation:** deploy the repo vhost (or equivalent) to the edge; confirm no CSP violations (Google Fonts and `data:` images are allowed in the committed policy); then tighten with nonces. Do not add `unsafe-eval`.
* **Retest (non-invasive):** `curl -sI https://www.nova.eredox.com/ | grep -i content-security-policy` from an uninspected network; load key pages in a browser and review the console for violations.
* **Source ref:** `ops/nginx/www.nova.eredox.com.conf` (CSP directive); `DEPLOYMENT.md`.

### SEC-002 — Vulnerable TanStack Start version (GHSA-qx66-fv34-fjm8 / CVE-2026-102989) — **MEDIUM**, CONFIRMED version, LIKELY not currently exploitable
* **Evidence:** `bun.lock`: `@tanstack/react-start@1.168.32`, `@tanstack/start-server-core@1.169.17` (affected range: ≥1.143.12 and < react-start 1.168.60 / start-server-core 1.169.39). Advisory: unauthenticated attacker crafts a URL to a **server function**; victim opening it can receive attacker-controlled HTML/JS from the site's origin. Published rating **CVSS 9.3 (Critical)** by the advisory database.
* **Exposure analysis:** `grep` of `src/` finds **no `createServerFn`**; the only server handlers are `/sitemap.xml` (static XML) and `/api/forms` (custom). A benign `GET /_serverFn/audit-nonexistent` returned **403 Forbidden**. The origin sets no cookies and holds no session, so same-origin script would reach no authenticated data (public marketing content and the user's own form input only). Hence real-world exploitability is LIKELY nil *today*, but would become HIGH the moment any server function is added.
* **Remediation:** upgrade `@tanstack/react-start` to ≥ 1.168.60 (pulls `start-server-core` ≥ 1.169.39) and regenerate `bun.lock`; rebuild and redeploy; add the CSP (SEC-001) as a second layer.
* **Retest:** `bun audit` / `osv-scanner scan source -L bun.lock` shows the GHSA gone; no server-function path (`/_serverFn/*`) behaviour change (still 403/404 for arbitrary requests).
* **Source ref:** `package.json` (`@tanstack/react-start`: `1.168.32` pinned), `bun.lock`.

### SEC-003 — seroval 1.5.6 advisories — **LOW**, CONFIRMED version, LIKELY not exploitable
* GHSA-p6vx-979v-rg4c (published CVSS 9.8: `fromJSON` thenable assimilation), GHSA-7rv5-mrxv-xcr9 (7.3), GHSA-97r2-qh9m-474h, GHSA-wp97-x4hv-qvhp, GHSA-jp82-f5mq-hwhp (DoS class), GHSA-9wx9-5pv9-3349 (4.7, `<`-in-RegExp script break-out). Fixed in seroval ≥ 1.6.10.
* **Exposure:** seroval is TanStack's SSR/hydration serializer. The advisories require attacker-influenced data to be serialised (e.g. a RegExp built from user input) or attacker-controlled serialized payloads to be deserialised. The site serialises build-time static data; request-derived data is limited to validated search params (`zod`). No RegExp-from-input pattern exists in `src/`.
* **Remediation:** resolved by the SEC-002 upgrade if the new TanStack range depends on seroval ≥ 1.6.10 (verify in lockfile).

### SEC-004 — Other dependency advisories — **LOW**, CONFIRMED versions; runtime reach NOT VERIFIED
osv-scanner reports 26 unique advisories (35 package–advisory pairs) across 13 packages; apart from TanStack/seroval:
| Package (installed) | Advisories | Likely reach |
|---|---|---|
| `vite 8.1.5` | GHSA-9jrq-w75r-8gcw (2.1), GHSA-rq7h-c2jc-7f22 (6.3), launch-editor GHSAs (6.3–7.5) | Dev-server only; production image contains only `.output` |
| `vitest`/`@vitest/mocker 5.0.0` | GHSA-qxg6-89mg-rqv8 (4.7), GHSA-xp26-3454-mjgp (5.9) | Test runner only |
| `launch-editor 2.14.1`, `shell-quote 1.10.0` (9.2), `js-yaml 4.3.0`, `brace-expansion 1.1.16/5.0.8`, `minimatch 10.2.6`, `source-map-js 1.2.1` | DoS / Windows command-injection class | Build/lint toolchain (transitive of eslint/vite/tailwind) |
| `zod 3.25.76` and `4.4.3` (GHSA-mrhx-c7xc-m3w5, 8.2) | memory exhaustion validating very large constrained collections | `zod` is bundled client-side; used for URL search-param validation with `max()` limits — exposure LOW; v4.4.3 is transitive of TanStack build plugins |
| `nanoid 3.3.16` (GHSA-2v37-7h3g-55p8, 8.2) | infinite loop for size 0 custom generator | Not called with size 0 |
* Whether any of these is bundled into `.output/server` (Nitro bundles dependencies) was **NOT VERIFIED** (no build performed). Recommendation: refresh the lockfile (`bun update` within ranges), re-run the scan, and treat only runtime-bundled items as production-relevant.

### SEC-005 — `/api/forms` has no abuse or cross-site controls — **MEDIUM**, CONFIRMED in source, NOT TESTED live
* **Evidence (source):** `src/server.ts` routes `pathname === "/api/forms"` to `handleFormsRequest` (`src/lib/forms-server.ts`). The handler: accepts any `POST`; reads `request.text()` and `JSON.parse`s it **without checking `Content-Type`** (a cross-site `<form enctype="text/plain">` POST can therefore reach it); does **not** check `Origin`/`Referer` for validity (it only uses same-origin Referer path as `source_path` metadata); has no rate limiting, CAPTCHA, honeypot or per-IP quota in code; the committed nginx vhost has no `limit_req`; each valid submission triggers an authenticated call to a CRM enquiry endpoint **and** a Brevo transactional e-mail.
* **Good:** strict field allow-list and length caps (body ≤ 32 KB, message ≤ 10 000), e-mail regex, HTML-escaped e-mail body, 15 s upstream timeouts, HMAC-signed CRM request with nonce/timestamp, generic error messages, `Cache-Control: no-store`, **no CORS headers** (OPTIONS → 204 without `Access-Control-*`, so browsers block cross-origin reads), secrets read from environment only.
* **Impact:** unauthenticated spam/lead pollution of the CRM, e-mail quota exhaustion/cost, reputational impact on the Brevo sender domain; log noise. No data disclosure or injection was identified.
* **Preconditions:** none beyond network access. **Live behaviour not tested** (form submission prohibited); `GET` → 405 and `OPTIONS` → 204 were observed.
* **Remediation:** edge `limit_req` on `/api/forms`; require `Content-Type: application/json` and a same-origin `Origin` header; add invisible CAPTCHA/Turnstile or honeypot + time-to-submit check; dedupe on (email, 10 min); alert on volume.
* **Retest (with authorisation, staging):** submit a form with `Content-Type: text/plain` and with a foreign `Origin`; both should return 4xx. Rate-limit test on staging only.
* **Source ref:** `src/server.ts:51`, `src/lib/forms-server.ts` (`handleFormsRequest`, `normaliseSubmission`, `sendBrevoEmail`, `createCrmEnquiry`).
* **Minor:** CRM is called before e-mail; if e-mail fails the client sees 502 though the lead exists, inviting duplicate resubmission.

### SEC-006 — Personal data in URL after booking — **LOW**, CONFIRMED (source)
* `BookingForm.tsx` navigates to `/book-demo/confirmed` with `name`, `email`, `company`, `framework`, `teamSize`, `date`, `timeSlot` as **query parameters**; the confirmation page (`book-demo.confirmed.tsx`) reads them (zod-validated, React-escaped, `noindex`).
* **Impact:** PII persists in browser history, nginx access logs, and any same-origin `Referer`; cross-origin Referer is trimmed by `strict-origin-when-cross-origin`. Anyone can also craft a link showing arbitrary "booking received for <name>" text (content spoofing; no script execution — React escapes).
* **Remediation:** pass state via `history.state`/session storage or show only a booking reference; drop e-mail from the URL.

### SEC-007 — Production drift from repository (build and edge) — **MEDIUM**, CONFIRMED
* **Evidence:** live static assets `Last-Modified: Thu, 22 Oct 2026 09:09:34 GMT`; live HTML text "Start Free" and the older `/contact` pricing sentence; `origin/main` (2 Nov 2026) renders "Create Free Workspace" and the new disclaimer. Live headers lack the CSP defined in the repository's vhost.
* **Impact:** security and compliance statements on the site may not match what is reviewed in source; fixes merged to `main` (including any dependency bump) will not reach customers until deployed; weakens release provenance.
* **Remediation:** deploy from a tagged commit through CI; record image digest and commit SHA in a `/version`-style internal artefact; reconcile edge config via the repo asset.
* **Cannot verify:** deployment records, container image digest, edge config on Server1 (not readable by this audit).

### SEC-008 — TLS configuration — **NOT VERIFIED**
Origin certificate, issuer, expiry, SAN, TLS 1.2/1.3 support and cipher suites could not be validated from an Avast-inspected host (§2). The repo vhost specifies `ssl_protocols TLSv1.2 TLSv1.3; ssl_ciphers HIGH:!aNULL:!MD5;` (source only). HTTP→HTTPS enforcement **is CONFIRMED** (301, single hop, query preserved; no mixed content in any of 82 pages; no `http://` resource URLs in bundles). **Next step:** run the same checks from an uninspected network, or have Eredox run `openssl s_client`/SSL Labs against the edge with approval.

### SEC-009 — HSTS — **INFORMATIONAL**, CONFIRMED
`Strict-Transport-Security: max-age=63072000; includeSubDomains` (2 years). No `preload` token; preload requires the apex and all subdomains to be HTTPS — a business decision, not a defect. `includeSubDomains` on `www.nova.eredox.com` applies to its own sub-hosts only.

### SEC-010 — Header gaps of low consequence — **LOW**, CONFIRMED
* No `Cross-Origin-Opener-Policy`/`Cross-Origin-Resource-Policy` (no cross-origin isolation need; add `COOP: same-origin`, `CORP: same-site` as hygiene).
* Clickjacking protection relies on `X-Frame-Options: SAMEORIGIN` (adequate); `frame-ancestors` is absent because CSP is absent (SEC-001).
* No `Cache-Control` on HTML (fine for public pages), `/media/*`, `/og/*`, favicon — performance not security. `/api/forms` correctly sends `no-store`.
* `/api/forms` and error responses leak no stack traces; the generic app error page (`src/lib/error-page.ts`) is static.

### SEC-011 — Server banner — **INFORMATIONAL**
`Server: nginx/1.27.5` (set `server_tokens off`). Version-specific CVE exposure for that build was not assessed from the outside.

### SEC-012 — No security.txt; scanners may misreport — **LOW**
`/.well-known/security.txt` and `/security.txt` return **200 text/html** (soft 404) rather than 404 or a real file. Automated tools that treat 200 as "found" will mis-parse it, and researchers have no disclosure contact. Publish an RFC 9116 file (Contact, Expires, Policy) and fix SEO-001 so missing files 404. (Related: `*.map` URLs also return 200 HTML — no source maps exist.)

### SEC-013 — Supply-chain hygiene — **LOW**, CONFIRMED (source)
* `Dockerfile` uses floating tags `oven/bun:1` and `node:24-bookworm-slim` (no digest pin). `website-ci.yml` pins actions by tag (`actions/checkout@v4`, `oven-sh/setup-bun@v2`) not commit SHA, uses Bun 1.2.17 while the image uses `oven/bun:1`, and has **no dependency-audit step**; no Dependabot/Renovate config. `package.json` name is the template default (`tanstack_start_ts`); `.lovable/project.json`, `@lovable.dev/vite-tanstack-config` and a Lovable error-reporting shim remain (shim is inert outside the editor preview). Runtime image runs as non-root user `app` (positive) and includes a healthcheck.
* **Remediation:** pin image digests; add `osv-scanner`/`bun audit` to CI; enable Dependabot; remove unused template artefacts.

### SEC-014 — Positive controls (CONFIRMED)
No `Set-Cookie` on any page; consent kept in `localStorage` (`nova-cookie-consent-v1`) and documented in the cookie policy; no analytics/third-party scripts (analytics disabled in `src/config/site.ts`); only third-party request is Google Fonts CSS (disclosed in the privacy/cookie text); `rel="noopener noreferrer"` on all `_blank` links (0 missing); no `dangerouslySetInnerHTML`/`innerHTML`/`eval`/`postMessage` use in application code; no open-redirect parameter handling (redirects are host-based and server_name-limited); CSRF middleware enabled for server functions (`src/start.ts`); JSON-LD built with `JSON.stringify` of static data; Docker context excludes `.env*` (in `origin/main`; the deployed Oct-22 image's context is NOT VERIFIED); no secrets in tree or 216-commit history; no public source maps; HTTP→HTTPS redirect preserves path.

---

## 4. Investigation of the two previously reported HIGH findings

| Item | Status |
|---|---|
| Original scanner report (tool, test, URL, evidence) | **Not accessible to this audit.** |
| HIGH finding #1 | **NOT VERIFIED — unverified external report.** Nature unknown; not invented. |
| HIGH finding #2 | **NOT VERIFIED — unverified external report.** Nature unknown; not invented. |

So that Eredox can map them quickly once the report is available, these are the **live conditions an external scanner could reasonably have flagged as HIGH**, each independently assessed here (this is a hypothesis list, **not** an identification of the reported findings):

| Candidate scanner trigger | Our independent result |
|---|---|
| Missing Content-Security-Policy | CONFIRMED absent → SEC-001, **MEDIUM** on this site (no XSS found) |
| Known-vulnerable JS framework / component fingerprint (TanStack Start/Router, seroval) | CONFIRMED vulnerable versions → SEC-002/003; **LIKELY not exploitable** (no server functions; `/_serverFn/*` = 403) |
| "security.txt present" / sensitive-path 200 responses (`*.map`, `/.well-known/…`, `/index.html`) | Soft 404 returns 200 HTML; no real files → SEC-012 / SEO-001; **no sensitive content exposed** |
| Weak TLS / certificate issues | **NOT VERIFIED** (Avast inspection) → SEC-008 |
| Missing HSTS / insecure cookies / mixed content / CORS wildcard | **Not present**: HSTS present; no cookies; no mixed content; no ACAO header |
| Form endpoint without anti-automation | SEC-005 (source) **MEDIUM**, live NOT TESTED |

**Request:** please provide the original report (PDF/JSON export) so each finding can be retested individually; until then both remain NOT VERIFIED.

---

## 5. Dependencies and supply chain (summary)

* Manifests: `package.json` (≈70 direct deps), `bun.lock` (502 packages). Runtime-relevant core: React 19, TanStack Router/Start, zod, Radix UI, lucide, recharts, sonner.
* Unused/oversized: the shadcn UI kit includes ~50 component files, only a subset imported by routes (tree-shaking limits shipped size; unused packages such as `recharts`, `embla-carousel`, `react-day-picker`, `input-otp` should be checked with a dependency-usage tool — NOT TESTED).
* Advisories: §3 SEC-002–004. Fixed versions known for TanStack (≥ react-start 1.168.60, start-server-core 1.169.39), seroval ≥ 1.6.10; others per OSV records in `dep/osv.json` (retained in the audit scratch area).
* Secrets: none found (gitleaks tree + history; asset regex scan).

## 6. Server and deployment posture (read-only, repository copy only)

| Area | Observation | Status |
|---|---|---|
| Reverse proxy | nginx 1.27.5 edge; repo vhost proxies `www.nova.eredox.com` → `nova-public-website:3000` on the private `nova_compliance_edge` network; HTTP-01 webroot preserved | Source only |
| TLS termination/renewal | Edge; Certbot deploy hook script reviewed (restrictive perms, validate-then-reload, rollback) | Source only; live NOT VERIFIED |
| Public routing | Only 80/443 inferred from HTTP behaviour; **no port sweep performed**; container "must not publish a host port" per `DEPLOYMENT.md` | NOT TESTED |
| Container | Non-root, healthcheck, multi-stage; base images unpinned | Source only |
| Secrets management | Form delivery credentials via environment variables (`BREVO_API_KEY`, CRM key id/secret); `.dockerignore` excludes env files; values never printed or inspected | Pattern reviewed |
| Backup/logging | Not documented in repo; nginx access logs will contain query strings (see SEC-006) | NOT VERIFIED |
| Deployment provenance | No visible build SHA/version marker on the live site; build timestamp inferable from asset `Last-Modified` only | SEC-007 |

## 7. Residual risks

* Index/ranking and many operational controls (WAF, logging, backups, patch cadence, edge config) cannot be assessed externally.
* A transparent AV proxy was in the path (TLS and possibly header fidelity).
* Live behaviour of `/api/forms` under abuse is untested by design.
* Dependency advisories dated after this audit will appear; scan on each release.
* Security statements published on `/security` (segmentation, hardened defaults, monitoring, incident response) are not verifiable externally; ensure internal evidence exists before relying on them with customers.

## 8. Non-invasive retest instructions

```bash
# SEC-001 / SEC-010 / SEC-011: headers (run from an uninspected network)
curl -sI https://www.nova.eredox.com/ | grep -iE "content-security-policy|strict-transport|x-frame|x-content-type|referrer|permissions|cross-origin|^server"
# SEC-007: deployed build marker (compare to the commit you expect)
curl -sI https://www.nova.eredox.com/assets/styles-*.css | grep -i last-modified   # use the hashed name from the page source
# SEO-001 / SEC-012: missing paths must 404
curl -s -o /dev/null -w "%{http_code}\n" https://www.nova.eredox.com/zz-test-404 https://www.nova.eredox.com/.well-known/security.txt
# SEC-002/003/004: dependencies
osv-scanner scan source -L bun.lock        # or: bun audit
# SEC-005 (staging only, with approval): Content-Type / Origin enforcement and rate limiting on /api/forms
# SEC-006: complete a booking on staging and confirm the URL no longer contains name/email
# SEC-008: openssl s_client -connect www.nova.eredox.com:443 -servername www.nova.eredox.com  (from a network without TLS inspection)
```
