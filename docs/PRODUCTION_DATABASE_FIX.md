# Production Database Fix - Missing displayOrder Column

## Issue
The production database is missing the `displayOrder` column that was added in a recent migration. This causes all scraping operations to fail with the error:
```
Invalid `prisma.product.upsert()` invocation: The column `displayOrder` does not exist in the current database.
```

## Solution

### Quick Fix
Run the following command to add the missing column to the production database:

```bash
./scripts/fix-production-display-order.sh
```

This script will:
1. Add the `displayOrder` column to the Product table
2. Set appropriate display order values for each supplier

### Manual Fix (if script fails)
If the script fails, you can manually apply the migration:

1. Connect to your production database
2. Run the SQL commands from `scripts/add-display-order-column.sql`:

```sql
-- Add displayOrder column to existing Product table
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 999;

-- Update existing products with appropriate display order
UPDATE "Product" SET "displayOrder" = 1 WHERE "supplier" = 'Natuwash';
UPDATE "Product" SET "displayOrder" = 2 WHERE "supplier" = 'Wasstrip.nl';
UPDATE "Product" SET "displayOrder" = 3 WHERE "supplier" = 'Bio-Suds';
UPDATE "Product" SET "displayOrder" = 4 WHERE "supplier" = 'Bubblyfy';
UPDATE "Product" SET "displayOrder" = 5 WHERE "supplier" = 'Cosmeau';
UPDATE "Product" SET "displayOrder" = 6 WHERE "supplier" = 'Mother''s Earth';
```

## Prevention
To prevent this issue in the future:
1. Always run `npx prisma migrate deploy` after deploying new code
2. Check migration status with `npx prisma migrate status`
3. Test database schema changes in staging before production

## Verification
After applying the fix, verify it worked by:
1. Running a manual scrape from the admin dashboard
2. Checking that products appear in the correct order on the homepage
3. Confirming no more database errors in the scraping logs