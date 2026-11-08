#!/usr/bin/env bash
# Post-deployment smoke test. GET/HEAD only: it never submits a form, registers or signs in.
#   BASE=https://www.nova.eredox.com APP_BASE=https://nova.eredox.com LEGAL_DATE=2026-11-10 bash scripts/release/post-deploy-smoke.sh
# Local dry run against a test edge:  BASE=https://www.nova.eredox.com:6443 CURL_OPTS="--resolve www.nova.eredox.com:6443:127.0.0.1 -k" APP_BASE= bash ...
# Prints a "pricing-links fingerprint" of the registration links on / and /pricing; set EXPECT_PRICING_FP to assert it equals the value verified on the release image.
BASE=${BASE:-https://www.nova.eredox.com}; APP_BASE=${APP_BASE-https://nova.eredox.com}; LEGAL_DATE=${LEGAL_DATE:-}
read -r -a CO <<< "${CURL_OPTS:-}"
fails=0
ok()   { echo "PASS $1"; }
bad()  { echo "FAIL $1"; fails=$((fails+1)); }
chk()  { if [ "$2" = "1" ]; then ok "$1"; else bad "$1 :: $3"; fi; }
get()  { curl -s --compressed --max-time 30 "${CO[@]}" "$@" | tr -d '\000'; }   # some responses contain NUL bytes; strip so bash and grep treat them as text
code() { curl -s -o /dev/null --max-time 30 "${CO[@]}" -w '%{http_code}' "$@"; }

H=$(curl -sI --max-time 30 "${CO[@]}" "$BASE/" | tr -d '\r')
cnt() { echo "$H" | grep -ic "^$1:"; }
all1=1; for h in content-security-policy x-content-type-options referrer-policy strict-transport-security x-frame-options permissions-policy cross-origin-opener-policy cache-control; do [ "$(cnt $h)" = "1" ] || { all1=0; echo "   header $h count=$(cnt $h)"; }; done
chk "8 security/cache headers, each exactly once" $all1
chk "Server header discloses no version" "$(echo "$H" | grep -i '^server:' | grep -qi 'nginx/' && echo 0 || echo 1)"
chk "/ returns 200" "$([ "$(code "$BASE/")" = 200 ] && echo 1 || echo 0)"
HOME_HTML=$(get "$BASE/")
chk "html lang=en-AU" "$(echo "$HOME_HTML" | grep -q '<html[^>]*lang="en-AU"' && echo 1 || echo 0)"
chk "canonical of / is https://www.nova.eredox.com/" "$(echo "$HOME_HTML" | grep -o '<link[^>]*rel="canonical"[^>]*>' | grep -q 'https://www.nova.eredox.com/"' && echo 1 || echo 0)"
chk "Organization JSON-LD on /" "$(echo "$HOME_HTML" | grep -q '"@type":"Organization"' && echo 1 || echo 0)"
chk "AboutPage JSON-LD on /about" "$(get "$BASE/about" | grep -q 'AboutPage' && echo 1 || echo 0)"
chk "ContactPage JSON-LD on /contact" "$(get "$BASE/contact" | grep -q 'ContactPage' && echo 1 || echo 0)"
RH=$(curl -sI --max-time 30 "${CO[@]}" "$BASE/pricing/" | tr -d '')
chk "/pricing/ -> 301 with Location ending /pricing" "$(echo "$RH" | head -1 | grep -q ' 301' && echo "$RH" | grep -i '^location:' | grep -q '/pricing$' && echo 1 || echo 0)" "$(echo "$RH" | head -1) $(echo "$RH" | grep -i '^location:')"
for p in zz-nope .env index.html llms.txt; do chk "/$p -> 404" "$([ "$(code "$BASE/$p")" = 404 ] && echo 1 || echo 0)"; done
STH=$(curl -sI --max-time 30 "${CO[@]}" "$BASE/.well-known/security.txt" | tr -d ''); STB=$(get "$BASE/.well-known/security.txt")
chk "security.txt 200 text/plain with Contact and Expires" "$(echo "$STH" | head -1 | grep -q ' 200' && echo "$STH" | grep -qi 'content-type: text/plain' && echo "$STB" | grep -q '^Contact: mailto:' && echo 1 || echo 0)" "$(echo "$STB" | grep -E '^(Contact|Expires)' | tr '
' ' ')"
EXP=$(echo "$STB" | grep -i '^Expires:' | cut -d' ' -f2 | cut -c1-10)
chk "security.txt not expired (Expires $EXP)" "$([ -n "$EXP" ] && [[ "$EXP" > "$(date -u +%F)" ]] && echo 1 || echo 0)"
RB=$(get "$BASE/robots.txt")
chk "robots: Claude-SearchBot, Claude-User, Perplexity-User, OAI-SearchBot present" "$([ "$(echo "$RB" | grep -ci -E '^user-agent: (claude-searchbot|claude-user|perplexity-user|oai-searchbot)$')" = 4 ] && echo 1 || echo 0)"
chk "robots: Founder AI-crawler policy (GPTBot/ClaudeBot/Google-Extended allowed, CCBot disallowed)" "$(echo "$RB" | awk 'BEGIN{IGNORECASE=1} /^user-agent:/{ua=tolower($2)} /^allow: \/$/{a[ua]=1} /^disallow: \/$/{d[ua]=1} END{exit !(a["gptbot"]&&a["claudebot"]&&a["google-extended"]&&d["ccbot"])}' && echo 1 || echo 0)"
chk "robots: Sitemap line" "$(echo "$RB" | grep -qi '^sitemap: https://www.nova.eredox.com/sitemap.xml' && echo 1 || echo 0)"
SM=$(get "$BASE/sitemap.xml"); N=$(echo "$SM" | grep -c '<loc>')
chk "sitemap lists 69 URLs" "$([ "$N" = 69 ] && echo 1 || echo 0)" "got $N"
bad_urls=0; i=0
for u in $(echo "$SM" | grep -o '<loc>[^<]*</loc>' | sed 's#</\?loc>##g'); do
  i=$((i+1)); path=${u#https://www.nova.eredox.com}; c=$(code "$BASE$path"); [ "$c" = 200 ] || { echo "   $path -> $c"; bad_urls=$((bad_urls+1)); }; sleep 0.15
done
chk "all $i sitemap URLs return 200" "$([ "$bad_urls" = 0 ] && [ "$i" = 69 ] && echo 1 || echo 0)" "$bad_urls bad"
chk "noindex pages absent from sitemap (/status, /testimonials, product-updates, case-studies)" "$(echo "$SM" | grep -q -E '/status<|/testimonials<|product-updates<|case-studies<' && echo 0 || echo 1)"
CK=$(get "$BASE/legal/cookies")
chk "Cookie Policy: Brevo disclosed, no Google Fonts request statement" "$(echo "$CK" | grep -q 'Brevo' && ! echo "$CK" | grep -qi 'Google Fonts domains\|fonts.googleapis' && echo 1 || echo 0)"
if [ -n "$LEGAL_DATE" ]; then
  chk "Cookie Policy and Accessibility Statement carry effective date $LEGAL_DATE" "$([ "$(echo "$CK" | grep -c "$LEGAL_DATE")" -ge 1 ] && [ "$(get "$BASE/legal/accessibility" | grep -c "$LEGAL_DATE")" -ge 1 ] && echo 1 || echo 0)"
fi
chk "/api/forms rejects GET (405)" "$([ "$(code "$BASE/api/forms")" = 405 ] && echo 1 || echo 0)"
FP=$( { get "$BASE/pricing"; get "$BASE/"; } | grep -o 'https://nova\.eredox\.com/register[^"<> ]*' | sed 's/&amp;/\&/g' | sort -u | sha256sum | cut -c1-16)
NL=$( { get "$BASE/pricing"; get "$BASE/"; } | grep -o 'https://nova\.eredox\.com/register[^"<> ]*' | sort -u | wc -l)
echo "INFO pricing-links fingerprint: $FP ($NL distinct registration links on / and /pricing)"
[ -n "${EXPECT_PRICING_FP:-}" ] && chk "pricing/registration links equal the value verified on the release image ($EXPECT_PRICING_FP)" "$([ "$FP" = "$EXPECT_PRICING_FP" ] && echo 1 || echo 0)" "got $FP"
if [ -n "$APP_BASE" ]; then
  chk "application host /health -> 200" "$([ "$(code "$APP_BASE/health")" = 200 ] && echo 1 || echo 0)"
  chk "application /register?plan=growth&billing_cycle=annual -> 200" "$([ "$(code "$APP_BASE/register?plan=growth&billing_cycle=annual")" = 200 ] && echo 1 || echo 0)"
  chk "application root -> 200/30x" "$(code "$APP_BASE/" | grep -qE '^(200|30[1-8])$' && echo 1 || echo 0)"
fi
echo; [ "$fails" = 0 ] && echo "SMOKE: ALL PASS" || echo "SMOKE: $fails FAIL"; exit $([ "$fails" = 0 ] && echo 0 || echo 1)
