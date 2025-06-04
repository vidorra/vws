#!/bin/bash

# Script for managing the remote database on CapRover
# This script provides secure ways to update the remote database schema and data

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
REMOTE_URL="http://vaatwasstripsvergelijker.server.devjens.nl"
DB_MANAGEMENT_SECRET="${DB_MANAGEMENT_SECRET:-your-secret-here}"

# Function to display usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  push-schema    Push the current Prisma schema to the remote database"
    echo "  seed           Seed the remote database with initial data"
    echo "  help           Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  DB_MANAGEMENT_SECRET - Secret key for authentication (required)"
    echo ""
    echo "Example:"
    echo "  DB_MANAGEMENT_SECRET=your-secret ./scripts/manage-remote-db.sh push-schema"
}

# Function to push schema
push_schema() {
    echo -e "${YELLOW}Pushing schema to remote database...${NC}"
    
    response=$(curl -s -X POST \
        -H "x-admin-secret: $DB_MANAGEMENT_SECRET" \
        -H "Content-Type: application/json" \
        "$REMOTE_URL/api/db-management/push-schema")
    
    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✓ Schema pushed successfully${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}✗ Failed to push schema${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        exit 1
    fi
}

# Function to seed database
seed_database() {
    echo -e "${YELLOW}Seeding remote database...${NC}"
    
    response=$(curl -s -X POST \
        -H "x-admin-secret: $DB_MANAGEMENT_SECRET" \
        -H "Content-Type: application/json" \
        "$REMOTE_URL/api/db-management/seed")
    
    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✓ Database seeded successfully${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}✗ Failed to seed database${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        exit 1
    fi
}

# Check if DB_MANAGEMENT_SECRET is set
if [ "$DB_MANAGEMENT_SECRET" = "your-secret-here" ]; then
    echo -e "${RED}Error: DB_MANAGEMENT_SECRET environment variable is not set${NC}"
    echo "Please set it before running this script:"
    echo "  export DB_MANAGEMENT_SECRET=your-actual-secret"
    exit 1
fi

# Main script logic
case "$1" in
    push-schema)
        push_schema
        ;;
    seed)
        seed_database
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        echo -e "${RED}Error: Unknown command '$1'${NC}"
        usage
        exit 1
        ;;
esac