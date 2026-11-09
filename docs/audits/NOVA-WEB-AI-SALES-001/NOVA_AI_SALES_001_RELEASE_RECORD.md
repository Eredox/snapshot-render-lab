# NOVA-WEB-AI-SALES-001 — NOVA AI Information Assistant (release record)

**SUPERSEDED by NOVA-WEB-AI-SALES-002 (see NOVA_AI_SALES_002_AI_REUSE_CONCLUSION.md):** the Anthropic provider, the image `5176660…` and the `ANTHROPIC_API_KEY` activation below are no longer used. Current candidate: commit `a0a11cd19cbe2055df304dfa0f73dbc918c60642`, key variable `NOVA_ASSISTANT_API_KEY` (DeepSeek).

**Status: BUILT, TESTED LOCALLY, IMAGE STAGED ON SERVER1. NOT YET LIVE — waiting for the AI provider key.**

## Identity
| Item | Value |
|---|---|
| Build commit (runtime) | `51766601c8e58acc0e8e302305ebe5ba3bae9ebb`, tag `rc/nova-web-ai-sales-001` (later commits add tests and docs only) |
| Image | `nova-public-website:51766601c8e58acc0e8e302305ebe5ba3bae9ebb`, ID `sha256:02bcc02c076386c14d0ca196332b1e4116c10e4b2281b79f790c3196e6fce8c5` |
| Archive | 89,154,910 bytes, sha256 `a8b9f12ed1ddfb0fed4492a97ab5b7044cdd04fe898ff6f53e38e23ab997d69d`; loaded on Server1 from `~/release-ai-5176660/`, ID verified |
| Currently live (rollback target) | `nova-public-website:c58d7de85bcd16410d6e2a1505532c4720fdf62f` (GO-LIVE-007) |

## What was built
- `src/components/site/NovaAssistant.tsx`: in-page section on every route (heading "Need more information? Just ask NOVA."), three page-specific suggested questions, free-text box, answer area, earlier answers reopenable without cost, optional text-to-speech (Listen / Pause / Stop / Replay; never autoplays; stops on navigation, answer change and page hide), permanent "Suggested next step" (See NOVA in Action → /book-demo, Talk to Sales → /contact), nudge after 5 questions, handoff after 7.
- `src/lib/assistant-server.ts` (`POST/GET /api/assistant`, routed in `src/server.ts`): seven questions per session id enforced on the server; per-client attempt (15/10 min) and daily (21) ceilings and a global hourly ceiling (400) so clearing the browser session cannot drain the AI budget; same-origin and JSON checks; 4 KB body cap; 400-character question cap; question text never logged; a failed AI call does not consume a question; with no key it returns 503 and the UI says the assistant is unavailable (no simulated answers).
- `src/lib/assistant-knowledge.ts`: retrieval over the site's own public data (frameworks, features, plans and prices, solutions, industries, FAQs, published articles) — no customer or tenant data exists in this path.
- AI connection: Anthropic Messages API, `https://api.anthropic.com/v1/messages`, model `claude-haiku-5-5` (override `NOVA_ASSISTANT_MODEL`), key from `ANTHROPIC_API_KEY` in the container environment. Server1 can reach the API host (HTTP 404 on `/`, as expected).

## Evidence (evidence/)
Typecheck, lint (0 errors), 131 unit tests (7 new), build, `verify-release --browser` 103/103, browser journey 27/27, discovery PASS, assistant browser check 16/16 against a MOCK AI endpoint (heading, no fixed-position overlay, page-specific suggestions, count persists across pages and reload, reopen costs nothing, five-question nudge, seven-question stop, server refuses the eighth, audio stops on navigation). The live AI path is **not yet exercised**: no key has been provisioned.

## Activation (once the key is in the env file) — about 2 minutes, 20–30 s of 502 on www
```bash
# Founder/operator on Server1: add the key without it appearing in history or chat
read -rs -p "AI provider key: " K; echo; printf 'ANTHROPIC_API_KEY=%s\n' "$K" >> /opt/nova/secrets/nova-public-website.env; unset K
# release
REL=51766601c8e58acc0e8e302305ebe5ba3bae9ebb; STAMP=$(date -u +%Y%m%dT%H%M%SZ)
docker stop nova-public-website && docker rename nova-public-website nova-public-website-rollback-$STAMP
docker run -d --name nova-public-website --restart unless-stopped --network nova_compliance_edge --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges --env-file /opt/nova/secrets/nova-public-website.env nova-public-website:$REL
docker exec nova_compliance_nginx nginx -s reload      # nginx re-resolves the container address; nginx.conf itself is unchanged
```
Rollback: `docker stop nova-public-website && docker rm nova-public-website && docker rename nova-public-website-rollback-$STAMP nova-public-website && docker start nova-public-website && docker exec nova_compliance_nginx nginx -s reload`.

## Needs the Founder's attention
1. **Privacy and legal disclosure.** Questions typed by visitors are sent to the AI provider (Anthropic). The component says so next to the input, but the Privacy Policy, Cookie Policy (sessionStorage is used for the visit's history) and any sub-processor list have not been updated; the brief said not to change existing content.
2. **Cost control.** The ceilings above bound spend at roughly 400 questions per hour; set a spend limit on the provider account.
3. **Voice.** Browsers choose from the voices installed on the visitor's device; an American male voice is selected where one exists (e.g. Microsoft David/Mark/Guy, Apple Alex/Tom), otherwise a lowered-pitch en-US voice, and the UI says which voice is in use.
4. In-memory allowance counters reset if the container restarts (the browser keeps the visitor's history).
