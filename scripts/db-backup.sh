#!/bin/bash
# Database backup script for VWS PostgreSQL
# Usage: ./scripts/db-backup.sh
#
# Prerequisites:
#   - DATABASE_URL environment variable set
#   - pg_dump available (install postgresql-client)
#
# CapRover setup:
#   1. SSH into your CapRover server
#   2. Find the PostgreSQL container: docker ps | grep postgres
#   3. Run backup:
#      docker exec <container_id> pg_dump -U <user> <database> > backup_$(date +%Y%m%d_%H%M%S).sql
#
# Automated backups (add to crontab on CapRover server):
#   0 3 * * * /path/to/db-backup.sh >> /var/log/db-backup.log 2>&1
#
# Restore:
#   docker exec -i <container_id> psql -U <user> <database> < backup_file.sql

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/vws_backup_${TIMESTAMP}.sql"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check if DATABASE_URL is set
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

echo "Starting backup at $(date)..."
pg_dump "$DATABASE_URL" --no-owner --no-acl > "$BACKUP_FILE"

# Compress
gzip "$BACKUP_FILE"
echo "Backup saved to ${BACKUP_FILE}.gz"

# Cleanup: keep last 30 backups
cd "$BACKUP_DIR"
ls -t vws_backup_*.sql.gz 2>/dev/null | tail -n +31 | xargs -r rm --
echo "Cleanup complete. Backup finished at $(date)."
