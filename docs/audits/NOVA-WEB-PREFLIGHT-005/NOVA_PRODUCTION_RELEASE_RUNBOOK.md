# NOVA-WEB-PREFLIGHT-005 — Production release runbook v2 (executable, NOT executed) — supersedes the PREFLIGHT-004 runbook

**Do not run any step until the holds in `NOVA_PREFLIGHT_005_RELEASE_DECISION.md` are closed and the Founder has given a separate written production-release instruction naming a window.** Nothing in this package was merged, pushed, published or deployed. Server1 was only read. Changes from the PREFLIGHT-004 runbook: new release identity (Legal Path A and the booking-form fix are in the image), form configuration step D3b, delivery gate G1 (§7a), extra abort criteria. The PREFLIGHT-004 identity (`25aecf2` / `sha256:fdfbc406…`) is **superseded and must not be deployed**.

## 1. Exact release identity
| Item | Value |
|---|---|
| Repository / branch | `snapshot-render-lab` (local worktree `C:\Eredox\Projects\snapshot-render-lab-remediate-001`), `remediate/nova-web-remediate-001` |
| Release commit | `affb00c4b8815de90b9f2a31546add7e40bffeac` (`affb00c`), tag `rc/nova-web-release-005` (annotated). Later commits on the branch are documentation only: `git diff affb00c HEAD --stat -- src public ops package.json bun.lock Dockerfile vite.config.ts scripts` must be empty (check before use). Contents versus the superseded `25aecf2`: legal text v1.1 (Legal Path A), demo booking accepted without optional notes, synthetic form-delivery harness |
| Image | `nova-public-website:affb00c4b8815de90b9f2a31546add7e40bffeac`, linux/amd64, runs as uid 10001, label `org.opencontainers.image.revision` = the commit |
| **Immutable image ID (config digest)** | `sha256:34055ee7f2ccf29916b15f375527da5dc63443a5fbb012acb54a711fde832386` |
| Transport archive | `nova-public-website-affb00c4b8815de90b9f2a31546add7e40bffeac.tar.gz` (`docker save | gzip -n -9`), 89,141,577 bytes, **sha256 `85f602c83d6966f421f19a3c003aa4683079f5e82643e065b5d79ad84138b3b6`**; kept outside the repo in the session scratchpad (`…\scratchpad\`). If lost, the image is still in the local Docker store: `docker save` again and trust the **image ID**, which is what step D3 verifies |
| Registry digest | **None.** The image has not been pushed (no registry is used for this site; Server1 builds/loads locally). A registry digest exists only if the image is pushed, which needs separate approval. The content-addressed image ID above is the immutable identifier |
| Base images (digest-pinned in `Dockerfile`) | `oven/bun:1@sha256:1d22548f…8f1d`, `node:24-bookworm-slim@sha256:01d566e8…70e9` |
| Patched TanStack code in the image | present (`MAX_PENDING_SERIALIZATION_RECORDS` ×1), vulnerable code absent (×0) |
| Currently deployed (Server1, read-only) | container `nova-public-website`, image `nova-public-website:69543cb1ea5811bee2fa89cf0c594a4aecd44f21`, ID `sha256:dad65566320b21676bbfc782981efede399c5ea975d7bf93f4d73c9bd6b80073`, up since 2026-10-22, healthy → **this is the rollback image and it stays on the host** |
| nginx change | `nginx-www-vhost.diff` (+19 lines, 0 removed). Live file sha256 `660e4f8b6a29139dd3eb929d2ddc09074ccf661835540c768265c22ffa3c2815`; patched file sha256 `1f991770e209b6097a12ab0d09abcf82f5cc72fc0a4611d22aeb1306c2c4d909` |
| If the Founder amends the legal wording or effective date | change `src/data/legal.ts`, commit, **rebuild and re-test**: the commit, image ID and archive checksum above are then superseded again. Do not reuse them |

## 2. CI validation status
| Gate | Status |
|---|---|
| Workflow `.github/workflows/website-ci.yml` steps (install `--frozen-lockfile`, `bun audit`, lint, typecheck, test, build) executed with **bun 1.2.17** (the version CI pins) on a clean `git archive` of HEAD | **PASS**: 0 vulnerabilities; lint 0 errors/7 baseline warnings; typecheck clean; 22 files/124 tests; build OK (re-run for `affb00c`) |
| Same steps in GitHub Actions with the pinned Action SHAs | **NOT RUN** — the workflow triggers on `pull_request` and pushes to `main`; nothing is pushed. First run happens when the branch is pushed/PR opened (needs approval). Ready to execute: SHAs verified to resolve to real commits (`actions/checkout` `11d5960a…`, `oven-sh/setup-bun` `0c5077e5…`) |
| Image gates on the exact release image | health `healthy`; read-only fs, `--cap-drop ALL`, non-root; `verify-release --browser` **103/103**; discovery check **PASS**; journey/responsive **27/27**; synthetic form-delivery harness **20/20 API + 5/5 browser**; nginx edge test (below) — all re-run on `affb00c` |
| Edge gate: patched **live** nginx.conf, nginx 1.27.5-alpine, in front of the release image | `nginx -t` OK (baseline live file also OK in the same harness); each of 8 security headers once; `/pricing/` 301; unknown path and `/.env` 404; `robots.txt`, `sitemap.xml`, `security.txt` 200; `limit_req` 403,403,403,403,429,429; 50 KB body 413; ACME path 404 (not proxied) |
Not covered by any gate: Rich Results Test / Schema.org validator (live URL needed), OS-layer image scan, real-user performance.

## 3. Prerequisites (operator)
1. Written Founder go + window; a person with `sudo` on Server1 (the nginx file is `root:root 644`; `novaops` can run `docker`).
2. Workstation access to the archive and `ssh Server1` through the Windows OpenSSH client (`C:\Windows\System32\OpenSSH\ssh.exe`; Git Bash `ssh` cannot reach the agent).
3. Form-delivery variables (`NOVA_FORM_*`, `BREVO_API_KEY`, `NOVA_CRM_ENQUIRY_URL`, `NOVA_WEBSITE_INTAKE_KEY_*`): the running container has none, so enquiries cannot be delivered today. Step D3b prepares a restricted env file and D4 uses it. Without it the new container behaves exactly like today's (forms answer 503). Never paste values into chat or this repository.
4. For gate G1 (§7a): a Founder-controlled address for the synthetic enquiry and someone able to see the `compliance@eredox.com` mailbox and the CRM.

## 4. Deployment commands
Variables used throughout: `REL=affb00c4b8815de90b9f2a31546add7e40bffeac`, `STAMP=$(date -u +%Y%m%dT%H%M%SZ)`.

**D1 — Verify and copy the artifact (workstation, PowerShell/Git Bash)**
```bash
sha256sum nova-public-website-$REL.tar.gz     # expect 85f602c83d6966f421f19a3c003aa4683079f5e82643e065b5d79ad84138b3b6
/c/Windows/System32/OpenSSH/ssh.exe Server1 'mkdir -p ~/release-affb00c'
/c/Windows/System32/OpenSSH/scp.exe nova-public-website-$REL.tar.gz Server1:release-affb00c/
sha256sum docs/audits/NOVA-WEB-PREFLIGHT-004/nginx-www-vhost.diff         # expect 2d8f3b99160d44645e601d84e137673bbfa1c5c659c41b1b6f876ca9c5567898 (LF line endings; .gitattributes enforces eol=lf)
/c/Windows/System32/OpenSSH/scp.exe docs/audits/NOVA-WEB-PREFLIGHT-004/nginx-www-vhost.diff Server1:release-affb00c/
```
**D2 — Pre-checks on Server1 (read-only)**
```bash
docker inspect nova-public-website --format '{{.Config.Image}} {{.State.Health.Status}}'   # expect nova-public-website:69543cb1ea5811bee2fa89cf0c594a4aecd44f21 healthy
docker image inspect nova-public-website:69543cb1ea5811bee2fa89cf0c594a4aecd44f21 --format '{{.Id}}'   # expect sha256:dad65566…0073
df -h / | tail -1; free -m | sed -n 2p                                                       # >10 GB free, >1 GB available
sha256sum /opt/nova/app/releases/a215867d7206cc6179b1df8d40a5ed60e1664511/docker/nginx/nginx.conf   # expect 660e4f8b…2815 — if different, STOP: someone changed the live file; rebuild the diff
sudo certbot certificates 2>/dev/null | grep -A3 www.nova                                       # expiry 2026-12-19; confirm renewal is configured (see decision doc)
```
**D3 — Load the image and verify its identity**
```bash
cd ~/release-affb00c
echo "85f602c83d6966f421f19a3c003aa4683079f5e82643e065b5d79ad84138b3b6  nova-public-website-$REL.tar.gz" | sha256sum -c -
echo "2d8f3b99160d44645e601d84e137673bbfa1c5c659c41b1b6f876ca9c5567898  nginx-www-vhost.diff" | sha256sum -c -
gunzip -c nova-public-website-$REL.tar.gz | docker load
test "$(docker image inspect nova-public-website:$REL --format '{{.Id}}')" = "sha256:34055ee7f2ccf29916b15f375527da5dc63443a5fbb012acb54a711fde832386" && echo IMAGE-ID-OK
```
**D3b — Prepare the form-delivery configuration (operator on Server1; prints NO values; never overwrites)**
```bash
F=/opt/nova/secrets/nova-public-website.env
if [ -e "$F" ]; then echo "EXISTS - keep it, do not overwrite"; else
  ( umask 077; docker inspect nova-public-website-rollback-27518b31 --format '{{range .Config.Env}}{{println .}}{{end}}'     | grep -E '^(BREVO_API_KEY|NOVA_FORM_FROM_EMAIL|NOVA_FORM_TO_EMAIL|NOVA_CRM_ENQUIRY_URL|NOVA_WEBSITE_INTAKE_KEY_ID|NOVA_WEBSITE_INTAKE_KEY_SECRET)=' > "$F" )
fi
ls -l "$F"; cut -d= -f1 "$F" | sort; wc -l < "$F"      # expect: -rw------- , the six names, 6
```
`nova-public-website-rollback-27518b31` (2026-09-24) is the only container on the host that ever carried the six variables; they were dropped by a later redeploy. Its values are **not known to be current**: gate G1 (§7a) is what proves them. If G1 fails with a CRM 401 or Brevo 401/403, replace the affected values from their owners' consoles (Brevo → SMTP & API keys; Odoo `nova_website_intake` key) and recreate the container. If `/opt/nova/secrets` is not the place you want it, any root-restricted path works; the file must be mode 0600 and never copied into the repository, chat or an image. (An attempt to stage this file from the session was refused by the safety classifier, so it has not been created.)

**D4 — Swap the website container (≈20–30 s of 502 on `www` only)** — keeps the old container for rollback
```bash
docker stop nova-public-website
docker rename nova-public-website nova-public-website-rollback-$STAMP
docker run -d --name nova-public-website --restart unless-stopped --network nova_compliance_edge \
  --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges \
  --env-file /opt/nova/secrets/nova-public-website.env \n  nova-public-website:$REL                       # drop the --env-file line only if forms are to stay disabled (503) as today
for i in $(seq 1 12); do s=$(docker inspect nova-public-website --format '{{.State.Health.Status}}'); echo $s; [ "$s" = healthy ] && break; sleep 5; done
docker network inspect nova_compliance_edge --format '{{range .Containers}}{{.Name}} {{end}}' | tr ' ' '\n' | grep -c '^nova-public-website$'   # expect 1
```
The container name equals the DNS alias used by nginx (`nova-public-website`). The extra flags (`--read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges`) differ from the running container (which has none of them); they were tested with this image and may be dropped without functional change.

**D5 — nginx: validate, back up, apply in place, reload (root)**
```bash
R=/opt/nova/app/releases/a215867d7206cc6179b1df8d40a5ed60e1664511/docker/nginx
sudo cp -p $R/nginx.conf $R/nginx.conf.bak-$STAMP
patch -o /tmp/nginx.conf.new $R/nginx.conf ~/release-affb00c/nginx-www-vhost.diff
sha256sum /tmp/nginx.conf.new                      # expect 1f991770e209b6097a12ab0d09abcf82f5cc72fc0a4611d22aeb1306c2c4d909
# syntax-check the NEW file with the live image and real certs on the edge network (throw-away container, no listeners published)
docker run --rm --network nova_compliance_edge -v /tmp/nginx.conf.new:/etc/nginx/nginx.conf:ro -v $R/certs:/etc/nginx/certs:ro nginx:1.27-alpine nginx -t
# apply IN PLACE: same inode, so the container's single-file bind mount sees it (do NOT use mv, cp -f over, or sed -i)
sudo sh -c "cat /tmp/nginx.conf.new > $R/nginx.conf"
docker exec nova_compliance_nginx nginx -t && docker exec nova_compliance_nginx nginx -s reload
docker exec nova_compliance_nginx sha256sum /etc/nginx/nginx.conf       # expect 1f991770…d909 (proves the container sees the new file)
```
If `patch` reports any rejected hunk or the first checksum differs: stop, do not apply.

## 5. Abort criteria (any one → roll back immediately)
* New container not `healthy` within 60 s, or restarts.
* `nginx -t` fails at any point, or the in-container checksum differs from the expected patched checksum.
* After reload: `https://www.nova.eredox.com/` not 200; any of CSP / HSTS / X-Frame-Options / nosniff / Referrer-Policy / COOP appears 0 or 2 times; unknown URL does not return 404; `/robots.txt` or `/sitemap.xml` not 200; sitemap entries ≠ 69.
* **Any effect on the application virtual hosts**: `https://nova.eredox.com/health` not 200 or `/register?plan=growth&billing_cycle=annual` not rendering (the same nginx serves them; reload is graceful but verify).
* 5xx count in `docker logs --since 5m nova_compliance_nginx` greater than baseline noise.
* Founder rejects the acceptance walk-through.
* Not an abort trigger: gate G1 failing. Forms then remain non-delivering exactly as today (the visitor sees a clear error, nothing is lost silently). The Founder decides whether to proceed with delivery disabled or to fix credentials first; G1 failures never touch the rest of the site.
* Abort if the container log shows any form line containing a name, e-mail address, message text or secret (the harness proves there are none; production must match).

## 6. Rollback commands
```bash
# 6a nginx (if D5 was applied)
R=/opt/nova/app/releases/a215867d7206cc6179b1df8d40a5ed60e1664511/docker/nginx
sudo sh -c "cat $R/nginx.conf.bak-$STAMP > $R/nginx.conf"
docker exec nova_compliance_nginx nginx -t && docker exec nova_compliance_nginx nginx -s reload
sudo sha256sum $R/nginx.conf                      # expect 660e4f8b…2815 again
# 6b website container
docker stop nova-public-website && docker rm nova-public-website
docker rename nova-public-website-rollback-$STAMP nova-public-website
docker start nova-public-website
docker exec nova_compliance_nginx nginx -s reload          # nginx must re-resolve the container address
curl -sI https://www.nova.eredox.com/ | head -3           # expect 200 and the old headers (no CSP)
```
No database, no volumes and no application container are touched, so there is nothing to restore. Older images (`nova-public-website:ee67bdb0…` and earlier) remain as a second line. Record the outcome of any rollback in the release record.

## 7. Post-deployment smoke tests (GET/HEAD only; from the workstation, then server-side for TLS)
```bash
B=https://www.nova.eredox.com
curl -sI $B/ | awk -F: 'tolower($1)~/^(content-security-policy|x-content-type-options|referrer-policy|strict-transport-security|x-frame-options|permissions-policy|cross-origin-opener-policy|cache-control)$/{c[tolower($1)]++} END{for(k in c)print k,c[k]}'   # 8 lines, each 1
curl -sI $B/ | grep -i '^server'                                  # "server: nginx" (no version)
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' $B/pricing/                       # 301 https://www.nova.eredox.com/pricing
for p in zz-nope .env index.html llms.txt security.txt; do curl -s -o /dev/null -w "$p %{http_code}\n" $B/$p; done   # 404 404 404 404 404
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' $B/.well-known/security.txt       # 200 text/plain
curl -s $B/robots.txt | grep -c -E 'Claude-SearchBot|Claude-User|Perplexity-User'            # 3
curl -s $B/sitemap.xml | grep -c '<loc>'                                                     # 69
curl -s $B/ | grep -o '<html[^>]*>'                                                          # lang="en-AU"
node scripts/verify-release.mjs --base $B                                                    # HTTP checks only: "All checks passed"
node scripts/discovery/check-discovery.mjs --base $B --live --delay 400                      # RESULT PASS
node scripts/journey/verify-signup-journeys.mjs                                              # with NOVA_APP_URL=https://nova.eredox.com NOVA_SITE_URL=$B ; never add --idp-banner
# server-side TLS (workstation TLS is intercepted by Avast, so verify on the host over loopback)
ssh Server1 'for v in tls1 tls1_1 tls1_2 tls1_3; do echo | timeout 10 openssl s_client -connect 127.0.0.1:443 -servername www.nova.eredox.com -$v 2>&1 | grep -E "^New," | head -1; done'   # tls1/1_1 "(NONE)"; 1_2 and 1_3 negotiated
ssh Server1 'curl -s -o /dev/null -w "app %{http_code}\n" https://nova.eredox.com/health'      # 200 — application unaffected
ssh Server1 'docker logs --since 10m nova_compliance_nginx 2>&1 | awk "{print \$9}" | sort | uniq -c | sort -rn | head -5'   # no 5xx burst
```
Do **not** submit the live contact/booking forms from a browser, register, or sign in as part of verification. The only permitted live submission is gate G1 below, and only with the Founder's approval.

### 7a. Gate G1 — one synthetic enquiry through the real chain (needs the env file; creates ONE real CRM lead and ONE real e-mail)
```bash
# on Server1, over loopback, obviously synthetic data and a Founder-controlled address
curl -s -o /dev/null -w '%{http_code}
' --resolve www.nova.eredox.com:443:127.0.0.1 -X POST https://www.nova.eredox.com/api/forms   -H 'content-type: application/json' -H 'origin: https://www.nova.eredox.com' -H 'referer: https://www.nova.eredox.com/contact'   -d '{"name":"NOVA SYNTHETIC TEST","email":"<founder-controlled address>","company":"Synthetic Test","message":"NOVA-SYNTHETIC-TEST - please delete. Release delivery check."}'     # expect 202
docker logs --since 2m nova-public-website 2>&1 | tail -5      # expect no 'delivery-failed' / 'unavailable' lines
```
Then: (1) the Founder confirms the notification arrived in `compliance@eredox.com` with Reply-To = the test address; (2) the Founder or CRM owner confirms the lead exists in the CRM (Odoo), then archives it; (3) a second request for a **demo booking without notes** (`"type":"demo-booking"` with framework, teamSize, date, timeSlot, company) should also return 202 and appear in both places. Record times, the CRM reference (`NWI-n`) and who confirmed. Until G1 passes, enquiry delivery is **NOT VERIFIED in production**.

## 8. Google Search Console and Bing activation checklist (after §7 passes; account holders only)
Follow `docs/audits/NOVA-WEB-RELEASE-003/NOVA_SEARCH_INDEXING_ACTIVATION_PLAN.md`. Condensed:
- [ ] GSC: open the existing property for `https://www.nova.eredox.com/` (verification file `google09b732402a3c6243.html` is live; do not delete); ownership = Verified.
- [ ] GSC → Sitemaps: submit `https://www.nova.eredox.com/sitemap.xml` → expect 69 discovered.
- [ ] GSC → URL Inspection (live test): `/`, `/pricing`, `/frameworks/iso-27001`, `/industries` → available, canonical matches.
- [ ] GSC → Settings → **"Search generative AI"**: confirm **Include** (Founder requirement); record value + date + screenshot in the release record; do not change.
- [ ] GSC → Pages: `/status`, `/testimonials`, `/resources/product-updates`, `/resources/case-studies` appear as excluded by `noindex` (intended).
- [ ] Bing Webmaster Tools: confirm site present (Bingbot already fetches `sitemap.xml`, 13 verified hits in 7 days — which suggests but does not prove the sitemap is registered); if absent, import from GSC; submit the sitemap; run "Verify Bingbot" on a log entry.
- [ ] IndexNow (key file already live): `node scripts/discovery/indexnow.mjs --urls changed.txt` dry-run first; submit with `NOVA_INDEXNOW_APPROVED=yes … --submit` only after approval, only for genuinely changed URLs. Google does not use IndexNow.
- [ ] Record Rich Results Test and validator.schema.org results for `/`, `/about`, `/contact`, one framework page, one article.

## 9. Live crawler-verification plan
Baseline already taken before release (7 days of Server1 nginx logs, `evidence/server1-crawler-corroboration-2026-11-08.txt`): Googlebot 190/200 requests verified by reverse+forward DNS (200s on `/robots.txt`, `/`, `/pricing`, `/resources/*`, `/legal/cookies`, …), Bingbot 13/13 verified (`/sitemap.xml`, `/robots.txt`), OAI-SearchBot 21/21 verified from OpenAI's published ranges (`/robots.txt` only), PerplexityBot 2/2 verified (`/robots.txt`, `/responsible-ai`); 10 further "Googlebot" requests (junk `/kmonbase…` paths, closed with 444) and 8 "Claude-User" requests (`/.env*` probes) **could not be verified and are treated as spoofed/unverified**. Repeat after release:
```bash
ssh Server1 'docker logs --since 168h nova_compliance_nginx 2>&1' | python scripts/discovery/verify-crawler-logs.py --exclude-ip <your own IP>
```
at +24 h, +7 d and +28 d. Expected: verified Googlebot/Bingbot fetches of `robots.txt` and `sitemap.xml` returning 200, then page fetches of the 69 URLs; OAI-SearchBot/PerplexityBot page fetches may take weeks. Anthropic's tokens (Claude-SearchBot, Claude-User, ClaudeBot) have no published IP list in the sources reviewed, so they stay "UA-identified, **not verifiable**". Docker keeps only 3×10 MB of nginx log (`json-file`), so export weekly if a longer history is wanted. Real crawler access stays NOT VERIFIED for any platform until this check shows verified hits **against the new build**.
