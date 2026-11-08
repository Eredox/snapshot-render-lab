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
