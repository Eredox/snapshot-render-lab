#!/usr/bin/env bash
# Run ON SERVER1 by the person who holds the dedicated Gemini API key.
#   Interactive (hidden input):  ssh -t Server1 'bash ~/set-gemini-key.sh'
#   Paste-free (key piped from Windows over ssh stdin, avoids terminal paste mangling):  $k | ssh Server1 'bash ~/set-gemini-key.sh --stdin'
# Stores GEMINI_API_KEY only in the website's restricted env file. Prints the key's length and a 12-hex SHA-256 fingerprint (never the key)
# so it can be compared with the same fingerprint computed where the key was copied from.
set -euo pipefail
MODE=${1:-}
F=${NOVA_ENV_FILE:-/opt/nova/secrets/nova-public-website.env}
[ -f "$F" ] || { echo "env file not found: $F"; exit 1; }
if [ "$MODE" = "--stdin" ]; then
  IFS= read -r K || true
else
  read -rsp "Paste the dedicated Gemini API key (input hidden): " K; echo
fi
K=$(printf '%s' "$K" | tr -d '\r\n\t ')   # strip CR/LF/tab/space picked up by terminals or PowerShell pipes
[ -n "$K" ] || { echo "empty - nothing changed"; exit 1; }
case "$K" in *[!A-Za-z0-9._~+/=-]*) echo "key contains unexpected characters - nothing changed"; exit 1;; esac
T=$(mktemp); chmod 600 "$T"
{ grep -v '^GEMINI_API_KEY=' "$F" || true; } > "$T"
printf 'GEMINI_API_KEY=%s\n' "$K" >> "$T"
cat "$T" > "$F"; rm -f "$T"; chmod 600 "$F"
echo "saved GEMINI_API_KEY ($(grep -c '^GEMINI_API_KEY=' "$F") entry) | length ${#K} | fingerprint $(printf '%s' "$K" | sha256sum | cut -c1-12)"
unset K
echo "variables now present: $(cut -d= -f1 "$F" | sort | tr '\n' ' ')"; stat -c 'file mode %a owner %U' "$F"
