# NOVA-WEB-GO-LIVE-007 — release record

Founder direction: GO WITH EXPLICIT LIMITATIONS. Window **Monday 9 November 2026, 09:00–11:00 AEST** (23:00 UTC Sun 8 Nov – 01:00 UTC Mon 9 Nov). Replaces the 10 November window. Deploy with runbook v3 (`../NOVA-WEB-GO-LIVE-006/NOVA_PRODUCTION_RELEASE_RUNBOOK.md`), substituting the identity below and `LEGAL_DATE=2026-11-09`.

## Release identity (supersedes 8d7c7d5 / sha256:a49fd41f… — never deploy those)
| Item | Value |
|---|---|
| Release commit | `c58d7de85bcd16410d6e2a1505532c4720fdf62f` |
| Tag | `rc/nova-web-release-007` (annotated) |
| Image | `nova-public-website:c58d7de85bcd16410d6e2a1505532c4720fdf62f` |
| Image ID | `sha256:154c100fd34cb207161e2ced4007b749383031a3f38bd39d3d33be0ea3925901` |
| Archive | `nova-public-website-c58d7de85bcd16410d6e2a1505532c4720fdf62f.tar.gz`, 89,141,627 bytes, sha256 `97c67768e3e8f59afd77f4fc3792e46174c96cfca4f6b2ea53f823147cc30db9` |
| nginx diff | `nginx-www-vhost.diff` sha256 `2d8f3b99160d44645e601d84e137673bbfa1c5c659c41b1b6f876ca9c5567898` (patched file expected `1f991770…d909`) |
| Change vs 8d7c7d5 | only the four `effectiveDate`/`lastReviewed` strings in `src/data/legal.ts` (2026-11-10 → 2026-11-09) and the two matching test expectations |

## Gates on the new image (evidence/)
CI steps under bun 1.2.17: audit clean, lint 0 errors, typecheck clean, 124 tests pass, build ok. verify-release --browser 103 PASS / 0 FAIL. Journey 27 PASS / 0 FAIL. Discovery check PASS. Smoke script behind the patched live nginx: ALL PASS. The forms-delivery harness was not re-run (no forms code changed since the 21 + 5 PASS on 8d7c7d5).

## Server1 pre-checks (read-only, 2026-11-08 21:2x UTC), staging only
Archive and diff copied to `~/release-c58d7de/` on Server1 and checksums verified there. Live container `nova-public-website:69543cb1…` healthy (ID `dad65566…0073`); live nginx.conf sha `660e4f8b…2815` as baseline; 74 GB disk free; other containers up (backend healthy 5 d, frontend 5 d, nginx 6 w, redis/minio/postgres healthy). No production change made.

## Execution log
(appended at the window)

### Security-contact verification — PASS (Founder statement, 2026-11-09)
`compliance@eredox.com` received an external security-contact test e-mail on 9 November 2026. Evidence: Outlook inbox screenshot held by the Founder (not in the repository). Monitoring owner: Founder, Eredox Pty Ltd. Recorded as PASS on the Founder's confirmation; I did not see the screenshot.

## Execution log (2026-11-08 UTC = 2026-11-09 AEST; operator account `novaops`, passwordless sudo verified)
| UTC | Step | Result |
|---|---|---|
| 23:00 | Window baseline | old container `69543cb1…` healthy; nginx.conf `660e4f8b…`; cert valid to 2026-12-19; app endpoints 200, CRM 303 |
| 23:00 | D3 | archive and diff checksums OK; image loaded; ID `sha256:154c100f…5901` OK |
| 23:01 | D3b | `/opt/nova/secrets/nova-public-website.env` created from `nova-public-website-rollback-27518b31`, six variable names present, mode 0600, owner novaops (docker CLI reads `--env-file`); no values printed |
| 23:01 | D4 | previous container kept as `nova-public-website-rollback-20261108T230134Z`; new container healthy in ~10 s; on `nova_compliance_edge` |
| 23:02 | D5 | backup `nginx.conf.bak-20261108T230134Z` (`660e4f8b…`); patched sha `1f991770…d909`; `nginx -t` OK in throw-away container and live; in-place write; reload; in-container sha `1f991770…d909` |
| 23:03 | Smoke (scripts/release/post-deploy-smoke.sh, LEGAL_DATE=2026-11-09, EXPECT_PRICING_FP) | ALL PASS, 28 checks (evidence/smoke-PRODUCTION-after-release.txt) |
| 23:0x | Isolation | NOVA app `/health`, `/`, `/register?plan=growth&billing_cycle=annual`, `/login` 200; CRM 303; backend/frontend/postgres/redis/minio/nginx containers unchanged (uptimes); no 5xx lines in nginx log (the three `50x` grep hits were 200 responses with 50x byte counts) |
| 23:04 | G1 | one synthetic POST /api/forms from Server1 → 202; marker `NOVA-SYNTHETIC-TEST G1 20261108T230425Z`; site log has one line (startup), 0 hits for marker/address/keys |
| 23:2x | Production HTTP verify-release | 48 PASS / 0 FAIL; browser journey + responsive 27 PASS / 0 FAIL (form fetch stubbed, no extra POST in nginx log) |

**G1 e-mail: PASS** — Founder verified the "NOVA website enquiry" message in Outlook with the marker above (screenshot held by the Founder; not seen by me).
**G1 CRM record: pending Founder confirmation.** The session has no CRM access. Indirect evidence only: the handler runs the CRM call before the e-mail and returns 202 only if the CRM call did not throw, and the e-mail was sent after it.
**Not yet done:** IndexNow submission, Search Console and Bing verification (held until G1 CRM confirmed).
