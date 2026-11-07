# NOVA-WEB-RELEASE-002 — Final release readiness

Date 2026-11-08 · Branch `remediate/nova-web-remediate-001` · Code HEAD at test time `c01e4e6` (plus documentation-only commits) · Tag `rc/nova-web-remediate-001` remains at `0325f08` (the RC of the previous package); a new tag is proposed in the execution plan after approval. **Nothing merged, pushed or deployed.**

## 1. Decision
| Question | Answer |
|---|---|
| Overall engineering result | **PASS** for everything executable without production access or the application's backend stack. |
| Website release candidate | **Technically ready** (builds, image runs hardened, nginx config validates, all automated checks pass). |
| **Final GO / HOLD for production activation** | **HOLD — conditional.** Four non-engineering conditions must be cleared or knowingly accepted (§5). None needs more development; all are decisions or operator actions. |
| Can the website deploy independently of an application deployment? | **For registration: yes** — the live application already honours `plan`/`billing_cycle` (Compatibility §1). **For paid checkout: no** — checkout is not available in production, so the "Subscribe to …" buttons lead to a dead end at the last step. The application team's own plan treats that as an accepted "safe stop"; the brief for this package says not to publish links that depend on unavailable functionality, therefore the default is HOLD until the Founder either enables checkout (separate approval) or **explicitly accepts** the dead end for a defined period. |

## 2. What changed in this package (code, commit `c01e4e6`)
1. Header navigation breakpoint `lg` → `xl`: removes horizontal scrolling at 1024–1160 px (iPad landscape/small laptops), present on production (1123 px wide at a 1024 px viewport) and worse in the RC (1162 px).
2. `Cache-Control: private, no-cache` on every nonce-bearing response (prevents a shared cache replaying a nonce) — `src/lib/security-headers.ts`.
3. No duplicate `X-Content-Type-Options`/`Referrer-Policy` behind the edge (fallback only without `X-Forwarded-Proto`) — found by testing through real nginx.
4. `scripts/journey/` (application register verifier, website journey/responsive suite, CDP helper) so the checks are repeatable.
5. Tests: 2 new unit tests (118 total). All four fixes are covered by tests or by the journey/edge suite.

## 3. Test register (accurate PASS / FAIL / NOT RUN)
| Area | Result | Detail |
|---|---|---|
| Typecheck | **PASS** | `tsc --noEmit` |
| Lint | **PASS** | 0 errors, 7 warnings (same as baseline on `main`) |
| Website unit / routing / SEO / sitemap / security-header / form-protection / booking-privacy / plan-and-billing tests | **PASS** | 21 files, **118 tests** (previous package 116) |
| Production build | **PASS** | `bun run build`, twice |
| Docker image build + start + health | **PASS** | §security doc |
| Release verification against the **container** (HTTP, headers, 404s, links, external destinations, headless-Edge desktop+mobile on 11 pages, CSP/console/network) | **PASS 103/103**, 0 FAIL | `evidence/verify-release-container-image.txt` |
| nginx 1.27.5 `nginx -t` + live edge behaviour (headers once, 301, 404, 429, 413) | **PASS** | disposable; not the Server1 file |
| Application register/login/pricing journey (live app pages, read-only) | **PASS** 65 steps desktop, 76 steps mobile, 0 FAIL | `evidence/app-register-verifier-*.txt` |
| Booking, refresh, back/forward, failure and hostile-state tests | **PASS** 14/14 | `evidence/website-journey-responsive.txt` |
| Responsive desktop/laptop/tablet/tablet-landscape/mobile | **PASS** 13/13 after fixing the 1024 px defect (**FAIL** before the fix: 3 failures, recorded) | same |
| Application frontend tests (`Register`, `Login`, `Checkout`, `OidcCallback`, `planSelection`, `Subscription`, `content`) | **PASS** 83 tests / 9 files | scratch copy of `origin/main`; one transient resolution error on first run of one file, passed on re-run |
| Dependency advisories (`osv-scanner`, `bun audit`) | **PASS** | none |
| Secret scan (gitleaks, full history) | **PASS** | no leaks |
| Application backend tests, six-plan entitlement matrix, migrations | **NOT RUN** | need the application stack |
| Authenticated registration → Auth0 return → checkout; Stripe TEST payment; Odoo order/invoice | **NOT RUN** | no disposable application stack; no approved TEST run in this package. **No end-to-end Stripe acceptance is claimed** |
| Playwright suites | **NOT RUN** | not installed; CDP-based equivalents used |
| Lighthouse | **NOT RE-RUN** | the header/cache changes do not affect the REMEDIATE-001 figures; re-measure after deployment |
| Real devices, manual WCAG 2.2 AA, screen readers | **NOT RUN** | |
| Anything against Server1, production nginx, TLS from an uninspected network, production headers of the new build | **NOT RUN / NOT VERIFIED** | |
| Image vulnerability scan (OS layer), SBOM | **NOT RUN** | tool not installed |

## 4. SEO reconciliation (Phase F)
Method: `NOVA_WEBSITE_PAGE_INVENTORY.csv` (original, live, 22 Oct) vs `NOVA_WEBSITE_PAGE_INVENTORY_RETEST.csv` (this build), URL-set comparison on the committed CSVs.

| Quantity | Original | Release candidate | Explanation |
|---|---|---|---|
| Canonical pages | 73 | **73** | 72 indexable + `/resources/case-studies` (noindex) → 69 indexable + 4 noindex |
| Indexable | 72 | **69** | −3: `/status`, `/testimonials`, `/resources/product-updates` are empty placeholders, now `noindex,follow` **on purpose** |
| In sitemap | 66 | **69** | −3 placeholders, +6 `/plans/{free,launch,growth,professional,business,enterprise}` (they were indexable but absent from the sitemap) |
| Indexable but not in sitemap | 6 (the plan pages) | **0** | |
| In sitemap but not indexable | 0 | **0** | |
| Intentionally excluded (not lost) | — | `/status`, `/testimonials`, `/resources/product-updates`, `/resources/case-studies`; also `/resources/webinars`, `/book-demo/confirmed` (noindex, unchanged) | Each comes back automatically when content exists (conditional route logic + tests) |
| Difference "72 indexable vs 69 sitemap" | | fully explained | = the three placeholders |
| 404s | unknown URLs, `/404`, `/index.html`, `.map` returned **200** | **404** (verified on the container and through nginx) | SEO-001 |
| Redirects | `/pricing/` 307 | app 307, **nginx 301** (verified with real nginx) | SEO-011 |
| Canonical / titles / descriptions | 73 unique; 45 generic titles | 73 unique; 0 generic; 0 length issues (tests + verify-release) | |
| Production now | still the original (soft 404 → 200 confirmed 2026-11-08) | | |

## 5. Conditions for GO (all non-engineering)
1. **Checkout decision (blocking).** Either checkout is enabled in production under its own approval (Odoo integration, `nova_subscription` 19.0.1.17.0 on Server2, published Payment Terms, administrator accounts, Stripe live-mode approval) **or** the Founder records acceptance that paid "Subscribe" journeys end at "Odoo checkout is not configured." until it is. Alternative with no code written: hold the website and keep the current live pages.
2. **Legal owner** approves and schedules the cookie-policy wording (Legal Review Items §2) for the same release window.
3. **Server1 operator** applies the vhost change by diff, `nginx -t` on the real certificates, and confirms no second CSP (Security doc §3.3).
4. **Security mailbox**: designated and tested (Legal Review Items §4).
Plus the standing items: approval and window; rollback image tagged; Brevo/CRM/intake secrets verified in the target environment (never copied); Auth0 development-keys banner (F7) assessed by the application owner.

## 6. Remaining security issues
| Item | Status |
|---|---|
| Live site: no CSP, soft 404s, banner — fixed only by deployment | OPEN until deployed (SEC-007) |
| Two externally reported HIGH findings | **NOT VERIFIED** (scanner report never supplied) |
| TLS from an uninspected network (SEC-008) | NOT VERIFIED |
| No CAPTCHA; in-memory limiter does not scale across replicas | Accepted residual, documented |
| Brevo not disclosed in legal text | Legal item P1 |
| Supply chain: base-image digest and GitHub Action SHA pinning (SEC-013) | OPEN (follow-up) |
| `style-src-attr 'unsafe-inline'` | Accepted (no script execution) |
| Auth0 development-keys banner on the application sign-in (F7) | NOT VERIFIED |

## 7. Improvements that are **not** release blockers
Cookie-banner LCP on framework pages (lab LCP ≈ 3.8 s because the first-visit banner paragraph is the largest element and renders after hydration; options: shorter/smaller banner text or render after the LCP window — **consent behaviour unchanged**, needs design/legal sign-off) · sitemap `lastmod` · short `?framework=` links · schema polish · `en-AU`/per-page share images · target-size review · route-level code splitting (TBT) · Turnstile decision · digest/SHA pinning · Trivy-style image scan · Search Console monitoring plan.

## 8. Git
See the execution plan §9 for the commit list; worktree clean after the documentation commit.
