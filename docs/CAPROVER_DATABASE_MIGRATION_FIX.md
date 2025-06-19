# CapRover Database Migration Fix - Missing displayOrder Column

## The Issue
The production database is missing the `displayOrder` column, causing scraping to fail.

## Solution Options

### Option 1: Run Migration Locally Against Production Database (Recommended)

1. **From your local machine**, ensure you have the production DATABASE_URL in your `.env` file
2. Run the fix script:
   ```bash
   ./scripts/fix-production-display-order.sh
   ```

### Option 2: Use CapRover Web Terminal

1. Go to your CapRover dashboard
2. Navigate to your app
3. Click on "Web Terminal"
4. Run these commands:
   ```bash
   # Install PostgreSQL client if not available
   apt-get update && apt-get install -y postgresql-client
   
   # Run the migration
   psql "$DATABASE_URL" << EOF
   ALTER TABLE "Product" 
   ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 999;
   
   UPDATE "Product" SET "displayOrder" = 1 WHERE "supplier" = 'Natuwash';
   UPDATE "Product" SET "displayOrder" = 2 WHERE "supplier" = 'Wasstrip.nl';
   UPDATE "Product" SET "displayOrder" = 3 WHERE "supplier" = 'Bio-Suds';
   UPDATE "Product" SET "displayOrder" = 4 WHERE "supplier" = 'Bubblyfy';
   UPDATE "Product" SET "displayOrder" = 5 WHERE "supplier" = 'Cosmeau';
   UPDATE "Product" SET "displayOrder" = 6 WHERE "supplier" = 'Mother''s Earth';
   EOF
   ```

### Option 3: Create a One-Time API Endpoint

1. Create a temporary API endpoint to run the migration:

```typescript
// app/api/admin/fix-database/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Run raw SQL to add the column
    await prisma.$executeRaw`
      ALTER TABLE "Product" 
      ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 999
    `;
    
    // Update display orders
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 1 WHERE "supplier" = 'Natuwash'`;
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 2 WHERE "supplier" = 'Wasstrip.nl'`;
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 3 WHERE "supplier" = 'Bio-Suds'`;
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 4 WHERE "supplier" = 'Bubblyfy'`;
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 5 WHERE "supplier" = 'Cosmeau'`;
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 6 WHERE "supplier" = 'Mother''s Earth'`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database fixed successfully' 
    });
  } catch (error) {
    console.error('Database fix error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

2. Deploy this code
3. Visit: `https://your-app.caprover.domain/api/admin/fix-database`
4. Remove this endpoint after fixing

### Option 4: Add Migration to Dockerfile (For Future)

Update your Dockerfile to run migrations automatically:

```dockerfile
# Add before CMD in Dockerfile
RUN npm install -g prisma
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

## Immediate Fix Steps

Since you need to fix this now, I recommend **Option 1**:

1. Make sure your local `.env` file has the production `DATABASE_URL`
2. Run from your project root:
   ```bash
   ./scripts/fix-production-display-order.sh
   ```

If you don't have access to the production database URL locally, use **Option 2** via CapRover's web terminal.

## Verification

After applying the fix:
1. Go to your admin dashboard
2. Run a manual scrape
3. Check that all products are scraped successfully
4. Verify products appear in the correct order on the homepage