# NOVA-WEB-RELEASE-002 — Security and deployment-artifact verification

Date 2026-11-08 · Code under test: branch `remediate/nova-web-remediate-001` at `c01e4e6` · Image `nova-web-rc:c01e4e6` (local, not pushed; ID `sha256:fa9bb9952936e1fcb2468c6041c6c7ff2834fd543b2982bc46b99e55587b6854`, 89.6 MB content size). **Server1 was not accessed.** Nothing was installed on any server. All containers below were disposable and have been removed.

## 1. Docker engine status (Phase G)
Earlier in the REMEDIATE-001 package the Docker API timed out. Checked once at the start of this package: `docker info` returned server **29.7.2** and Docker Desktop's WSL VM was running, so the Docker-backed tests were executed. One environmental limit: creating a user-defined network failed ("all predefined address pools have been fully subnetted" — the workstation has exhausted its Docker address pools). I did not prune anyone's networks; the edge test used the default bridge with `--add-host` instead. **Docker-backed checks: EXECUTED. No BLOCKED items remain in this phase.**

## 2. Image build and artifact (exact `Dockerfile`)
| Check | Result |
|---|---|
| `docker build` of the repository `Dockerfile` (bun build stage, `node:24-bookworm-slim@sha256:01d566e8…70e9` runtime) | **PASS** (built twice: working tree, then committed HEAD) |
| Runs read-only, `--cap-drop ALL`, `no-new-privileges`, tmpfs `/tmp`, uid **10001** (non-root) | **PASS** |
| `HEALTHCHECK` | **healthy** within 25 s |
| Patched TanStack code **in the deployable artifact** | `MAX_PENDING_SERIALIZATION_RECORDS` present in `.output/server/_ssr/server-*.mjs`; `getDefaultSerovalPlugins` (vulnerable code) present in **0** files — checked inside the container |
| Dependency versions | `bun.lock` frozen: react-start 1.168.60, start-server-core 1.169.39, react-router 1.170.41, router-plugin 1.168.42, seroval 1.7.7, vite 8.3.6. `bun install --frozen-lockfile` clean. (The Docker build stage uses floating `oven/bun:1`; CI pins bun 1.2.17 — both read `lockfileVersion 1`.) |
| `osv-scanner scan source -L bun.lock` | **No issues found** |
| `bun audit` | **No vulnerabilities found** (458 packages) |
| gitleaks (248 commits) | **no leaks found** |
| Environment configuration | No new required variables. `BREVO_API_KEY`, `NOVA_FORM_*`, `NOVA_CRM_ENQUIRY_URL`, `NOVA_WEBSITE_INTAKE_KEY_*` untouched and **absent** from the test container (so forms could not deliver anywhere). Optional `NOVA_FORM_ALLOWED_HOSTS` |
| Full release verification against the container (`verify-release.mjs --browser`, 69 sitemap pages + headless Edge) | **103 / 103 PASS** (`evidence/verify-release-container-image.txt`) |
| Not done | Image digest from a registry (not pushed); SBOM/provenance; scanning the OS layer of the image (e.g. Trivy/Grype — not installed); multi-arch |

## 3. CSP and response headers (Phase D)
### 3.1 Application (container, direct)
* **Unique nonce per response:** three consecutive requests produced three different nonces (`bTFt2B…`, `uZZSee…`, `tck8bd…`); verified again through the edge (`h7Sr7y…`, `I92nCc…`).
* **Propagation:** every inline `<script>` (hydration, JSON-LD) carries the response's nonce; no un-nonced inline script or style; headless Edge on 11 pages × desktop/mobile: **0 CSP violations, 0 console errors, 0 failed requests, same-origin only**.
* **SSR compatibility:** nonce is supplied to TanStack through `router.options.ssr.nonce` from an AsyncLocalStorage hook per request; verified by the above.
* **Policy content:** `script-src 'self' 'nonce-…'` — no `unsafe-eval`, no script `unsafe-inline`, no wildcard, `frame-src 'none'`, `object-src 'none'`, `connect-src 'self'`. The only inline allowance is `style-src-attr 'unsafe-inline'` (React `style=` attributes; cannot execute script).
* **Cache reuse — defect found and fixed:** HTML responses carried **no `Cache-Control`**, so a shared cache (a CDN or an nginx `proxy_cache` added later) could store one visitor's page together with its nonce and replay it to others. The app now sets `Cache-Control: private, no-cache` on every nonce-bearing response unless the handler chose its own (e.g. `no-store` on `/api/forms`). Static files (`/assets`, `/fonts`, `/media`) bypass this and keep `public, max-age=…`/immutable. The current vhost has **no** `proxy_cache`.
* **Duplicate / conflicting headers — defect found and fixed:** through real nginx, `X-Content-Type-Options` and `Referrer-Policy` each appeared **twice** (once from nginx, once from the app's fallback). The app now adds those two fallbacks only when `X-Forwarded-Proto` is absent (direct access). Through the edge every security header now appears **exactly once**: CSP, COOP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, Cache-Control.
* **Checkout navigation:** registration/checkout links are plain `<a>` navigations to `nova.eredox.com`; `form-action 'self'` does not apply to link navigation, and the site has no form that posts cross-origin. The application has its own CSP (`default-src 'self'; script-src 'self'; frame-ancestors 'none'` as observed on `nova.eredox.com`).
* **Analytics / legitimate scripts:** none exist (`analyticsConfig.enabled = false`; consent record only in `localStorage`). Nothing third-party is loaded, so nothing is blocked. If an analytics tag is ever added it must be added to the CSP deliberately.
* **CDN compatibility:** a CDN that caches HTML must be configured to bypass the cache for HTML (now also signalled by `private, no-cache`) and must preserve `X-Forwarded-Proto` and the client IP header (see §5).

### 3.2 nginx edge (real `nginx:1.27.5`, vhost = `ops/nginx/www.nova.eredox.com.conf`, throw-away self-signed certificate, app container behind it)
| Check | Result |
|---|---|
| `nginx -t` | **syntax is ok / test is successful** |
| `Server` header | `nginx` (no version) — `server_tokens off` effective |
| `/pricing/` | **301** → `https://www.nova.eredox.com/pricing` |
| Unknown path, `/index.html` | **404** with CSP and HSTS present |
| `/.well-known/security.txt` | 200 `text/plain` |
| `http://` | 301 to https |
| Static font via edge | 200, `cache-control: public, max-age=2592000`, HSTS present |
| `/api/forms` edge rate limit (`limit_req` 6 r/m, burst 3) | 6 rapid POSTs → `403 403 403 403 429 429` (first four reached the app, which refused the foreign Origin with 403; then nginx answered 429) |
| `/api/forms` body cap (40 k) | 50 KB body → **413** at the edge |
| App limiter key | log lines show a stable 8-hex salted client hash, i.e. the app receives `X-Real-IP` from nginx |
| What this does **not** prove | The **live** Server1 vhost, TLS chain, certbot hook, HTTP/2 tuning, other server blocks on the same nginx, or the fact that `limit_req_zone` (an `http{}`-level directive) is accepted where the file is included — it **was** accepted here because the file was included under `conf.d`. |

### 3.3 Deployment configuration change (exact, for Server1) — NOT applied
The change to the live edge is the diff of the vhost against `origin/main`:
```bash
git diff origin/main -- ops/nginx/www.nova.eredox.com.conf
```
Summary: (1) remove any `Content-Security-Policy` `add_header` (the live vhost has none today; if one exists it must go, or two policies apply); (2) `server_tokens off`; (3) `rewrite ^/(.+)/$ /$1 permanent;`; (4) `limit_req_zone … nova_forms` at `http{}` level; (5) `location = /api/forms` with `limit_req … burst=3 nodelay`, 429, 40 k cap, proxy headers. **Procedure on Server1** (operator): copy the dated current vhost; install the new file; `nginx -t` against the real certificates; reload; run the §6 probes. **Mandatory pre-check:** compare the live vhost with `origin/main`'s version — the live one is known to differ (production serves no CSP although the repo's earlier file carried one; its other directives were never seen), so merge by diff, never by overwrite. Production reports `nginx/1.27.5`, the version used for this test. The deployed container must also be on the private edge network with its port **unpublished**.

## 4. Dependency advisory (SEC-002)
GHSA-qx66-fv34-fjm8 (TanStack Start server-function reflected XSS, advisory score 9.3) is **cleared in the deployable artifact** (§2). Exploitability before the fix was assessed in REMEDIATE-001 as likely nil (no `createServerFn` in source; `/_serverFn/*` returns 403; no cookies on the origin). Re-scan on the day of release; new advisories appear daily.

## 5. Form rate limiting vs the real topology (Phase D)
| Topic | Finding |
|---|---|
| Scope | Limiters (`SlidingWindowLimiter`) are **in-process memory**: per client 20 attempts and 5 deliveries / 10 min, global 120 deliveries / hour, duplicate suppression 15 min. State resets on restart. |
| Multiple processes / instances | **Not safe to scale out unchanged**: N replicas multiply every limit by N and duplicate suppression is per-replica. Today's topology is one container `nova-public-website` (source: `DEPLOYMENT.md`; compose files are not in the repo — **NOT VERIFIED on Server1**). The Nitro `node-server` preset runs one process; no cluster module is used. The nginx edge `limit_req` is the cross-instance backstop (per source IP, shared by all replicas behind it). |
| Trusted proxy handling | The client key is `X-Real-IP`, else the last `X-Forwarded-For` entry, else a shared "unknown" bucket. nginx sets `X-Real-IP $remote_addr` and **overwrites** (not appends) it, and appends to `X-Forwarded-For`. Because the container port is unpublished, only nginx can reach it, so these headers are trustworthy. **If the port were ever published, or another proxy/CDN were put in front of nginx**, either clients could forge `X-Real-IP` (bypassing per-client limits) or all visitors would share the CDN's IP (so one noisy visitor trips the limit for everyone). In that case configure nginx `real_ip_header`/`set_real_ip_from` for the CDN ranges and re-test. |
| Residual | Without CAPTCHA a distributed low-rate attacker can still deliver up to 120 enquiries/hour overall (bounded). Decision pending: Turnstile/hCaptcha. |

## 6. Post-deployment probes (GET/HEAD only) — unchanged from REMEDIATE-001 §8, plus
```bash
curl -sI https://www.nova.eredox.com/ | awk -F: 'tolower($1)~/^(content-security-policy|x-content-type-options|referrer-policy|strict-transport-security|x-frame-options|cross-origin-opener-policy|cache-control)$/{c[tolower($1)]++} END{for(k in c)print k,c[k]}'   # each must be 1
curl -sI https://www.nova.eredox.com/ | grep -i '^server'                  # no version
```

## 7. Status
| Item | Status |
|---|---|
| CSP nonce uniqueness / propagation / SSR | **PASS** |
| No cache reuse of a nonce | **FIXED-LOCAL** (`c01e4e6`) |
| No duplicate / conflicting security headers | **FIXED-LOCAL** (`c01e4e6`), verified through nginx |
| nginx config validation | **PASS** (`nginx -t` 1.27.5, disposable) — **live Server1 file NOT inspected** |
| Image build, startup, health, non-root, patched artifact | **PASS** |
| Production Server1 configuration | **NOT VERIFIED** (not accessed) |
| TLS from an uninspected network (SEC-008), HIGH #1/#2 external findings | **NOT VERIFIED** (unchanged) |
