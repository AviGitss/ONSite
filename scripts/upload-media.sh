#!/usr/bin/env bash
# Uploads private media to Supabase Storage (buckets already exist).
# Usage: SUPABASE_SERVICE_ROLE_KEY=... ./scripts/upload-media.sh
# Key: Supabase dashboard > Project Settings > API > service_role (never commit or expose it).
set -euo pipefail
URL="https://jbisnfqijtmyhqgtogld.supabase.co"
: "${SUPABASE_SERVICE_ROLE_KEY:?set SUPABASE_SERVICE_ROLE_KEY}"
up() { # bucket objectname localfile mime
  echo "-> $1/$2"
  curl -fsS -X POST "$URL/storage/v1/object/$1/$2" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Content-Type: $4" -H "x-upsert: true" --data-binary "@$3" >/dev/null
}
for id in changeover-optimizer newline tablet-pharma customer-commitment; do up site-videos "$id.mp4" "private/video/$id.mp4" video/mp4; done
up site-docs whitepaper.pdf private/whitepaper.pdf application/pdf
echo done
