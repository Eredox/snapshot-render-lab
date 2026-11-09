# NOVA-WEB-AI-SALES-002 — Reuse of existing Eredox AI infrastructure: engineering conclusion (2026-11-09)

Evidence labels: VERIFIED = observed today, read-only; REPORT = taken from NOVA_LIVE_008 (1 Nov 2026) and not re-observed today; ESTIMATE = reasoning, not benchmarked here.

## 1. What is actually available
| Item | Today |
|---|---|
| Server1 (168.144.244.21) | VERIFIED 2 vCPU, 3.9 GB RAM, ~1.6 GB available, no Ollama, no GPU; hosts the NOVA app and the public website. |
| Server2 (152.42.232.214) | VERIFIED 2 vCPU, 7.9 GB RAM, ~5 GB available, no Ollama, no `nvidia-smi`. Runs Odoo, Odoo Postgres, LibreChat (`nova-librechat`, healthy, 320 MB) and its MongoDB, plus other workloads. Load average 0.3-0.5. |
| LibreChat (`ai.nova.eredox.com`) | VERIFIED public config: SSO only (OpenID "Continue with Eredox Identity", auto-redirect), e-mail login and registration disabled. REPORT: 11 agents, all on the `NOVA DeepSeek` endpoint, model `deepseek-v4-flash`, with ten specialists wired to a tenant-data tool. |
| Inference | REPORT (not re-verified; verifying it requires reading LibreChat's configuration, which holds keys, so it was not opened): DeepSeek API, a platform-held key on Server2. VERIFIED today: `api.deepseek.com` is reachable from Server1 (HTTP 401 without a key). |
| Ollama / Qwen | REPORT: only on the Founder's laptop (8 GB GPU), not a production host. Nothing about this changed: no Ollama on Server1 or Server2 today. |

The LIVE_008 report is still accurate on every point I could check without reading credentials.

## 2. Can the existing AI connection serve the public site safely?
**LibreChat itself: no.** It is per-user SSO, and its agents are wired to the NOVA tenant-data tool (tenant summaries). Putting an anonymous public path in front of it would need a service identity inside the tenant-data trust boundary, which is the wrong boundary for public traffic. The assistant must not be able to reach tenant data at all.
**The provider behind it (DeepSeek): yes.** The website only sends public NOVA knowledge (built from the site's own data) and the visitor's question. No tenant or customer data exists in that path.

## 3. Can Ollama run reliably on current infrastructure?
No, not at acceptable quality or safety. ESTIMATES: Server1 has ~1.6 GB free, so only a sub-1B model would load, with a real risk of out-of-memory pressure on the NOVA application. Server2 could hold a 3B Q4 model (~2.5 GB) but would run it CPU-only on 2 vCPUs shared with Odoo; with 3-4k tokens of site knowledge in the prompt, prefill plus ~200 output tokens is on the order of one to two minutes per answer, one request at a time, and small models were already found to hallucinate (LIVE_008 recorded this for llama3.2). The laptop's measured result (queued requests, ~20 tokens/s with an 8 GB GPU) shows even GPU-class consumer hardware queues under shared use. Verdict: not viable, and it would put Odoo and the NOVA app at risk.

## 4. Comparison
| Approach | Quality | Latency (one answer) | Concurrency | Extra monthly cost | Risk to Odoo/NOVA |
|---|---|---|---|---|---|
| **DeepSeek `deepseek-v4-flash` (existing provider, website-scoped key)** | Good for grounded Q&A (same model as the 11 production agents) | seconds (ESTIMATE; measure at first live test) | provider-side, bounded by our caps (400/h) | Pay per token on the existing account; no subscription. Current price not verified here, spend limit should be set. | None (no local load) |
| Ollama small model on Server2/Server1 | Poor, hallucination risk | 1-2 minutes (ESTIMATE) | 1 at a time | none directly | High |
| Private GPU host with qwen3-coder:30b (LIVE_008 item 8) | Good | ~8 s warm on an 8 GB laptop; better on a proper GPU | needs sizing | A GPU host, a purchase | None to existing servers |
| Anthropic (the first build) | Very good | seconds | provider-side | New paid provider | None |

Unavoidable cost: some inference spend is unavoidable. The only option with no new provider and no hardware is metered DeepSeek usage on the account Eredox already holds.

## 5. Recommendation
Provider: DeepSeek, model `deepseek-v4-flash` (the model the 11 production agents already use), called directly from the website server over the OpenAI-compatible `/chat/completions` API, using a **website-scoped API key created by the Founder from the existing DeepSeek account** (a separate key, so it can be revoked and its spend attributed independently). I did not and will not read or reuse the key Server2 holds.

## 6. The change (implemented and staged)
`src/lib/assistant-server.ts` now reads `NOVA_ASSISTANT_API_KEY` (required), `NOVA_ASSISTANT_BASE_URL` (default `https://api.deepseek.com`) and `NOVA_ASSISTANT_MODEL` (default `deepseek-v4-flash`) and calls `${base}/chat/completions` with a Bearer key. Everything else is unchanged: seven-question server limit, ceilings, contextual suggestions, history, voice, Sales handoff. Mock-endpoint browser check 16/16; `verify-release --browser` 103/103; 131 unit tests. Image `nova-public-website:a0a11cd19cbe2055df304dfa0f73dbc918c60642`, ID `sha256:8972f8c64cd514839b5e47b8e9c14a78045b91227f33848b1d626ec34c9d84dd`, archive sha256 `b1af1aab62689e42cfc479637d495d00853f84c9b00485b1b9e49e17fab1a188` (89,153,997 bytes), loaded on Server1. The earlier Anthropic-build image was removed from Server1; live production is untouched.

Activation (key added by the Founder, never pasted into chat):
```bash
read -rs -p "DeepSeek website key: " K; echo; printf 'NOVA_ASSISTANT_API_KEY=%s\n' "$K" >> /opt/nova/secrets/nova-public-website.env; unset K
```
then the container swap in `NOVA_AI_SALES_001_RELEASE_RECORD.md` with `REL=a0a11cd19cbe2055df304dfa0f73dbc918c60642`.

## 7. Blockers and decisions
1. **Key:** the Founder (or an account administrator) must create a website-scoped key in the existing DeepSeek account. No other way to proceed without reusing another application's credential, which I will not do. If a service-to-service integration is preferred instead, the authorised design is a small NOVA-owned gateway that holds the key and exposes only a public-knowledge endpoint; that is more work than this change and is not needed for a first release.
2. **Published legal text conflicts (genuine, needs a decision before go-live).** The published Terms/Privacy (`src/data/legal-published.ts`, AI features section) say NOVA's default AI runs on Eredox's own self-hosted infrastructure, that no content is sent to an external AI provider by that path, and that "Eredox does not hold a platform-level credential for any external AI provider". The website assistant would send visitors' questions to DeepSeek with a credential Eredox holds. That wording is about the NOVA product's AI features, but a platform-held external key makes the sentence untrue as written (LIVE_008 gap 3 already records the same conflict for Server2). The brief said not to change existing content, so I have not; the Founder/counsel should correct or qualify it, and the widget's own notice (already shown next to the input) should name the provider. DeepSeek is a China-based provider, which some visitors may care about.
3. First live test: confirm the model name `deepseek-v4-flash` is accepted by the account (taken from LIVE_008). If the provider rejects it the assistant answers "temporarily unavailable" and no allowance is consumed.
