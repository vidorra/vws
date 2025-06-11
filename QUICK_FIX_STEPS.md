# Quick Fix Steps - Get Your Site Working Now

## The Problem
Your database is empty after adding the Methodologie changes. The app is trying to query products but there are none.

## The Solution - 3 Simple Steps

### Step 1: Deploy the Fixed Code
```bash
npm run deploy
```

### Step 2: Update CapRover Environment Variables

Add these in CapRover dashboard → Your App → App Configs → Environmental Variables:

```
DATABASE_URL=postgresql://vaatwasstrips_user:b3f1911f7b58306f@srv-captain--vaatwasstrips-db:5432/vaatwasstrips?connection_limit=5&pool_timeout=30
DB_MANAGEMENT_SECRET=your-secret-key-here
```

Generate a secret key:
```bash
openssl rand -base64 32
```

### Step 3: Initialize the Database

Choose ONE of these options:

#### Option A: Use Seed Data (Quickest)
```bash
# Set your secret
export DB_MANAGEMENT_SECRET=your-secret-key-here

# Push schema
./scripts/manage-remote-db.sh push-schema

# Add sample data
./scripts/manage-remote-db.sh seed
```

#### Option B: Import Your Local Database
```bash
# If you have a backup file
./scripts/import-to-caprover.sh

# OR create a new backup first
/Library/PostgreSQL/17/bin/pg_dump -U postgres -d vaatwasstrips -f vaatwasstrips_backup.sql
./scripts/import-to-caprover.sh
```

## That's It!

After these steps, your site should work. Check:
- https://vaatwasstripsvergelijker.server.devjens.nl (should show products)
- https://vaatwasstripsvergelijker.server.devjens.nl/methodologie (should work)

## If It Still Doesn't Work

1. Check if the database container is running in CapRover
2. Restart your app in CapRover
3. Check logs for new errors (not the old June errors)

## Summary

The errors you showed are from June - they're old. The real issue is:
1. Database has no schema/data after deployment
2. The Methodologie page tries to query products
3. This fails because the database is empty

The fix is simple: deploy code → update env vars → seed database.