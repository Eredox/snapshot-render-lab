#!/usr/bin/env bash
# Local, SYNTHETIC form-delivery verification of the exact release image (Docker required; nothing leaves the machine).
#   bash scripts/forms/run-delivery-harness.sh [image]     (Git Bash on Windows: MSYS_NO_PATHCONV is set below)
set -e
cd "$(dirname "$0")/../.."
IMG=${1:-nova-public-website:$(git rev-parse HEAD)}
export MSYS_NO_PATHCONV=1
if command -v cygpath >/dev/null 2>&1; then HARN="$(cygpath -m "$PWD/scripts/forms")"; else HARN="$PWD/scripts/forms"; fi
NODEIMG=node:24-bookworm-slim@sha256:01d566e8d94d8c619591d78652babfccd3c6992a3dffa9ed5ab39e11cf6c70e9
OUT=${HARNESS_OUT:-${TMPDIR:-/tmp}}
trap 'docker rm -f nova-forms-mock nova-forms-site >/dev/null 2>&1 || true' EXIT
docker rm -f nova-forms-mock nova-forms-site >/dev/null 2>&1 || true
docker run -d --rm --name nova-forms-mock -p 127.0.0.1:18080:8080 -v "$HARN:/h:ro" \
  -e MOCK_KEY_ID=synthetic-key-id -e MOCK_SECRET=synthetic-secret-not-real -e MOCK_BREVO_KEY=synthetic-brevo-key-not-real \
  "$NODEIMG" node /h/mock-sinks.mjs >/dev/null
MIP=$(docker inspect nova-forms-mock --format '{{.NetworkSettings.Networks.bridge.IPAddress}}')
docker run -d --rm --name nova-forms-site -p 127.0.0.1:13000:3000 --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges \
  -v "$HARN:/h:ro" \
  -e NODE_OPTIONS="--import /h/brevo-redirect.mjs" -e MOCK_BREVO_URL="http://$MIP:8080/brevo" \
  -e BREVO_API_KEY=synthetic-brevo-key-not-real -e NOVA_FORM_FROM_EMAIL=from-sink@example.test -e NOVA_FORM_TO_EMAIL=to-sink@example.test \
  -e NOVA_CRM_ENQUIRY_URL="http://$MIP:8080/nova_website_intake/v1/enquiries" \
  -e NOVA_WEBSITE_INTAKE_KEY_ID=synthetic-key-id -e NOVA_WEBSITE_INTAKE_KEY_SECRET=synthetic-secret-not-real \
  "$IMG" >/dev/null
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:13000/ && break; sleep 1; done
SITE=http://127.0.0.1:13000 MOCK=http://127.0.0.1:18080 EXPECT_TO=to-sink@example.test EXPECT_FROM=from-sink@example.test \
  node scripts/forms/check-forms-delivery.mjs | tee "$OUT/forms-delivery.txt"
if [ "${UI:-0}" = "1" ]; then
  echo "--- browser end-to-end (real forms, unstubbed):"
  SITE=http://127.0.0.1:13000 MOCK=http://127.0.0.1:18080 node scripts/forms/ui-forms-e2e.mjs | tee "$OUT/forms-ui-e2e.txt"
fi
echo "--- website log (operational lines only):"
docker logs nova-forms-site > "$OUT/forms-site-log.txt" 2>&1
cat "$OUT/forms-site-log.txt" | cut -c1-200
echo "--- leak scan of website log (names, e-mails, message text, secrets, markup); expect 0:"
grep -c -i -E "synthetic|example\.test|secret|brevo-key|<script|spam\.example" "$OUT/forms-site-log.txt" || true
