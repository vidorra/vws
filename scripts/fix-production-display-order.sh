#!/bin/bash

# Script to add missing displayOrder column to production database

echo "Adding displayOrder column to production database..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not found in .env file"
    exit 1
fi

# Apply the SQL migration
echo "Applying migration to add displayOrder column..."
psql "$DATABASE_URL" < scripts/add-display-order-column.sql

if [ $? -eq 0 ]; then
    echo "✅ Successfully added displayOrder column to production database"
    echo ""
    echo "You can now run the scraper again and it should work properly."
else
    echo "❌ Failed to add displayOrder column"
    exit 1
fi