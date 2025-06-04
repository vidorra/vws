#!/bin/bash

# Check if backup file exists
if [ ! -f "vaatwasstrips_backup.sql" ]; then
    echo "❌ Backup file not found: vaatwasstrips_backup.sql"
    echo "Run: /Library/PostgreSQL/17/bin/pg_dump -U postgres -d vaatwasstrips -f vaatwasstrips_backup.sql"
    exit 1
fi

# Read the SQL file
SQL_CONTENT=$(cat vaatwasstrips_backup.sql)

# Your CapRover app URL
APP_URL="https://vaatwasstripsvergelijker.server.devjens.nl"
ENDPOINT="${APP_URL}/api/setup-db?secret=setup-secret-vws-2024"

echo "📤 Sending database backup to: $ENDPOINT"
echo "📦 Backup size: $(wc -c < vaatwasstrips_backup.sql) bytes"

# Send the request
RESPONSE=$(curl -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "sql": $(echo "$SQL_CONTENT" | jq -Rs .)
}
EOF
)

echo "Response: $RESPONSE"
echo ""
echo "⚠️  IMPORTANT: Delete the /app/api/setup-db/route.ts file after successful import!"