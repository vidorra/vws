# Complete Deployment Fix Guide

## Understanding the Issue

The errors you're seeing are from June 2025 (old logs). The real issue is that after adding the Methodologie changes, the app is trying to query the database but:
1. The database schema might not be up to date
2. The database might not have any data

## Step-by-Step Fix

### 1. First, Deploy the Code with Connection Fixes

```bash
git add .
git commit -m "Fix database connection issues with retry logic"
git push origin main
npm run deploy
```

### 2. Update CapRover Environment Variables

In CapRover, update these environment variables:

```
DATABASE_URL=postgresql://vaatwasstrips_user:b3f1911f7b58306f@srv-captain--vaatwasstrips-db:5432/vaatwasstrips?connection_limit=5&pool_timeout=30
DB_MANAGEMENT_SECRET=<generate-with: openssl rand -base64 32>
```

### 3. Initialize the Database Schema

```bash
# Set your DB management secret
export DB_MANAGEMENT_SECRET=<your-generated-secret>

# Push the Prisma schema to create tables
./scripts/manage-remote-db.sh push-schema
```

### 4. Import Your Local Database Data

You have two options:

#### Option A: Use the existing backup file
```bash
# This uses your existing backup
./scripts/import-to-caprover.sh
```

#### Option B: Create a fresh backup and import
```bash
# Create a fresh backup from your local database
/Library/PostgreSQL/17/bin/pg_dump -U postgres -d vaatwasstrips -f vaatwasstrips_backup.sql

# Import to CapRover
./scripts/import-to-caprover.sh
```

#### Option C: Use the seed script (if you don't need exact data)
```bash
# This will create sample data
./scripts/manage-remote-db.sh seed
```

### 5. Verify Everything Works

1. Check database health:
   ```bash
   curl https://vaatwasstripsvergelijker.server.devjens.nl/api/health
   ```

2. Check if products are loaded:
   ```bash
   curl https://vaatwasstripsvergelijker.server.devjens.nl/api/products
   ```

3. Visit the website and check:
   - Homepage loads with products
   - Methodologie page works
   - Admin panel can access data

## Important Notes

1. **The import script requires** the `/api/setup-db` endpoint to exist. If it doesn't, you'll need to create it temporarily or use the seed method.

2. **Database connection errors in logs**: If you see connection errors AFTER deployment, check:
   - Is the database container running in CapRover?
   - Are the credentials correct?
   - Is the database accessible from the app container?

3. **If the import fails**, you can also:
   - Use CapRover's database management UI
   - Connect directly to the database and run the SQL
   - Use the seed script for sample data

## Quick Checklist

- [ ] Code deployed with retry logic
- [ ] Environment variables updated with connection pooling
- [ ] Database schema pushed (`push-schema`)
- [ ] Database has data (import or seed)
- [ ] Health check shows database connected
- [ ] Website loads with products

## Emergency Fallback

If nothing works, create a temporary setup endpoint:

```typescript
// app/api/setup-db/route.ts (DELETE AFTER USE!)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== 'setup-secret-vws-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { sql } = await request.json();
    await prisma.$executeRawUnsafe(sql);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Then run the import script and DELETE this file immediately after!