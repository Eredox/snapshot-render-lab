#!/usr/bin/env bash
# Run ON SERVER1 by the person who holds the dedicated Gemini API key:  ssh -t Server1 'bash ~/set-gemini-key.sh'
# Hidden input; stores GEMINI_API_KEY only in the website's root-restricted env file; prints no part of the key.
set -euo pipefail
F=${1:-/opt/nova/secrets/nova-public-website.env}
[ -f "$F" ] || { echo "env file not found: $F"; exit 1; }
read -rsp "Paste the dedicated Gemini API key (input hidden): " K; echo
[ -n "$K" ] || { echo "empty - nothing changed"; exit 1; }
case "$K" in *[[:space:]]*) echo "key contains whitespace - nothing changed"; exit 1;; esac
T=$(mktemp); chmod 600 "$T"
{ grep -v '^GEMINI_API_KEY=' "$F" || true; } > "$T"
printf 'GEMINI_API_KEY=%s\n' "$K" >> "$T"
cat "$T" > "$F"; rm -f "$T"; chmod 600 "$F"; unset K
echo "saved GEMINI_API_KEY ($(grep -c '^GEMINI_API_KEY=' "$F") entry); variables now present:"; cut -d= -f1 "$F" | sort | tr '\n' ' '; echo
stat -c 'file mode %a owner %U' "$F"
