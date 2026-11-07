# NOVA-WEB-PREFLIGHT-004 — Production release runbook (executable, NOT executed)

**Do not run any step until the four hold items in `NOVA_PREFLIGHT_RELEASE_DECISION.md` are closed and the Founder has given written go for a window.** Nothing in this package merged, pushed, published or deployed. Server1 was only read.

## 1. Exact release identity
| Item | Value |
|---|---|
| Repository / branch | `snapshot-render-lab` (local worktree `C:\Eredox\Projects\snapshot-render-lab-remediate-001`), `remediate/nova-web-remediate-001` |
| Release commit | `25aecf273e81eb8fb4df6ace82245f1da4861f62` (`25aecf2`), tag `rc/nova-web-release-003` (annotated). Later commits on the branch are documentation/test-tooling only and change no runtime file (`git diff 25aecf2 HEAD --stat -- src public ops package.json bun.lock Dockerfile vite.config.ts` is empty) |
| Image | `nova-public-website:25aecf273e81eb8fb4df6ace82245f1da4861f62`, linux/amd64, runs as uid 10001, label `org.opencontainers.image.revision` = the commit |
| **Immutable image ID (config digest)** | `sha256:fdfbc4064c3fb748bd45eec78478109ddee8bbd8e109230563ca2347db6a8262` |
| Transport archive | `nova-public-website-25aecf273e81eb8fb4df6ace82245f1da4861f62.tar.gz` (`docker save | gzip -n -9`), 89,140,838 bytes, **sha256 `73757a63ec6de963b16697cbc7494eaeda937c9f8aac021098766e802f9642c1`**; kept outside the repo in the session scratchpad (`…\scratchpad\`). If lost, the image is still in the local Docker store: `docker save` again and trust the **image ID**, which is what step D3 verifies |
| Registry digest | **None.** The image has not been pushed (no registry is used for this site; Server1 builds/loads locally). A registry digest exists only if the image is pushed, which needs separate approval. The content-addressed image ID above is the immutable identifier |
| Base images (digest-pinned in `Dockerfile`) | `oven/bun:1@sha256:1d22548f…8f1d`, `node:24-bookworm-slim@sha256:01d566e8…70e9` |
| Patched TanStack code in the image | present (`MAX_PENDING_SERIALIZATION_RECORDS` ×1), vulnerable code absent (×0) |
| Currently deployed (Server1, read-only) | container `nova-public-website`, image `nova-public-website:69543cb1ea5811bee2fa89cf0c594a4aecd44f21`, ID `sha256:dad65566320b21676bbfc782981efede399c5ea975d7bf93f4d73c9bd6b80073`, up since 2026-10-22, healthy → **this is the rollback image and it stays on the host** |
| nginx change | `nginx-www-vhost.diff` (+19 lines, 0 removed). Live file sha256 `660e4f8b6a29139dd3eb929d2ddc09074ccf661835540c768265c22ffa3c2815`; patched file sha256 `1f991770e209b6097a12ab0d09abcf82f5cc72fc0a4611d22aeb1306c2c4d909` |
| If the legal wording is approved before release | apply `legal-text-proposed.patch`, set version/dates, commit, **rebuild and re-test** — the commit, image ID and archive checksum above are then superseded. Re-run §2 gates on the new commit |

## 2. CI validation status
| Gate | Status |
|---|---|
| Workflow `.github/workflows/website-ci.yml` steps (install `--frozen-lockfile`, `bun audit`, lint, typecheck, test, build) executed with **bun 1.2.17** (the version CI pins) on a clean `git archive` of HEAD | **PASS**: 0 vulnerabilities; lint 0 errors/7 baseline warnings; typecheck clean; 22 files/122 tests; build OK |
| Same steps in GitHub Actions with the pinned Action SHAs | **NOT RUN** — the workflow triggers on `pull_request` and pushes to `main`; nothing is pushed. First run happens when the branch is pushed/PR opened (needs approval). Ready to execute: SHAs verified to resolve to real commits (`actions/checkout` `11d5960a…`, `oven-sh/setup-bun` `0c5077e5…`) |
| Image gates on the exact release image | health `healthy`; read-only fs, `--cap-drop ALL`, non-root; `verify-release --browser` **103/103**; discovery check **PASS**; journey/responsive **27/27**; nginx edge test (below) |
| Edge gate: patched **live** nginx.conf, nginx 1.27.5-alpine, in front of the release image | `nginx -t` OK (baseline live file also OK in the same harness); each of 8 security headers once; `/pricing/` 301; unknown path and `/.env` 404; `robots.txt`, `sitemap.xml`, `security.txt` 200; `limit_req` 403,403,403,403,429,429; 50 KB body 413; ACME path 404 (not proxied) |
Not covered by any gate: Rich Results Test / Schema.org validator (live URL needed), OS-layer image scan, real-user performance.

## 3. Prerequisites (operator)
1. Written Founder go + window; a person with `sudo` on Server1 (the nginx file is `root:root 644`; `novaops` can run `docker`).
2. Workstation access to the archive and `ssh Server1` through the Windows OpenSSH client (`C:\Windows\System32\OpenSSH\ssh.exe`; Git Bash `ssh` cannot reach the agent).
3. Decide form-delivery variables (see decision doc §4): the new container starts with **no** `BREVO_API_KEY`, `NOVA_FORM_FROM_EMAIL`, `NOVA_FORM_TO_EMAIL`, `NOVA_CRM_ENQUIRY_URL`, `NOVA_WEBSITE_INTAKE_KEY_ID`, `NOVA_WEBSITE_INTAKE_KEY_SECRET` — identical to the container running today. If forms must work, add them as `--env-file <secure file>` in D4; never paste values into chat or this repository.

## 4. Deployment commands
Variables used throughout: `REL=25aecf273e81eb8fb4df6ace82245f1da4861f62`, `STAMP=$(date -u +%Y%m%dT%H%M%SZ)`.

**D1 — Verify and copy the artifact (workstation, PowerShell/Git Bash)**
```bash
sha256sum nova-public-website-$REL.tar.gz     # expect 73757a63ec6de963b16697cbc7494eaeda937c9f8aac021098766e802f9642c1
/c/Windows/System32/OpenSSH/ssh.exe Server1 'mkdir -p ~/release-25aecf2'
/c/Windows/System32/OpenSSH/scp.exe nova-public-website-$REL.tar.gz Server1:release-25aecf2/
sha256sum docs/audits/NOVA-WEB-PREFLIGHT-004/nginx-www-vhost.diff         # expect 2d8f3b99160d44645e601d84e137673bbfa1c5c659c41b1b6f876ca9c5567898 (LF line endings; .gitattributes enforces eol=lf)
/c/Windows/System32/OpenSSH/scp.exe docs/audits/NOVA-WEB-PREFLIGHT-004/nginx-www-vhost.diff Server1:release-25aecf2/
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
cd ~/release-25aecf2
echo "73757a63ec6de963b16697cbc7494eaeda937c9f8aac021098766e802f9642c1  nova-public-website-$REL.tar.gz" | sha256sum -c -
echo "2d8f3b99160d44645e601d84e137673bbfa1c5c659c41b1b6f876ca9c5567898  nginx-www-vhost.diff" | sha256sum -c -
gunzip -c nova-public-website-$REL.tar.gz | docker load
test "$(docker image inspect nova-public-website:$REL --format '{{.Id}}')" = "sha256:fdfbc4064c3fb748bd45eec78478109ddee8bbd8e109230563ca2347db6a8262" && echo IMAGE-ID-OK
```
**D4 — Swap the website container (≈20–30 s of 502 on `www` only)** — keeps the old container for rollback
```bash
docker stop nova-public-website
docker rename nova-public-website nova-public-website-rollback-$STAMP
docker run -d --name nova-public-website --restart unless-stopped --network nova_compliance_edge \
  --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges \
  nova-public-website:$REL                       # add: --env-file /path/to/secure/forms.env   (only if forms are to be enabled)
for i in $(seq 1 12); do s=$(docker inspect nova-public-website --format '{{.State.Health.Status}}'); echo $s; [ "$s" = healthy ] && break; sleep 5; done
docker network inspect nova_compliance_edge --format '{{range .Containers}}{{.Name}} {{end}}' | tr ' ' '\n' | grep -c '^nova-public-website$'   # expect 1
```
The container name equals the DNS alias used by nginx (`nova-public-website`). The extra flags (`--read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges`) differ from the running container (which has none of them); they were tested with this image and may be dropped without functional change.

**D5 — nginx: validate, back up, apply in place, reload (root)**
```bash
R=/opt/nova/app/releases/a215867d7206cc6179b1df8d40a5ed60e1664511/docker/nginx
sudo cp -p $R/nginx.conf $R/nginx.conf.bak-$STAMP
patch -o /tmp/nginx.conf.new $R/nginx.conf ~/release-25aecf2/nginx-www-vhost.diff
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
Do **not** submit the live contact/booking forms, register, or sign in as part of verification.

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
