# Database Change Guide

This guide provides step-by-step instructions for making database changes and deploying them to production.

## Overview

The project uses:
- **Prisma ORM** for database management
- **PostgreSQL** as the database
- **GitHub Actions** for automatic deployment to CapRover
- **Remote database management scripts** for production updates

## Making Database Changes

### 1. Schema Changes (Adding/Modifying Tables)

When you need to modify the database structure:

```bash
# 1. Edit the schema file
# Edit prisma/schema.prisma to add/modify models

# 2. Generate Prisma client
npx prisma generate

# 3. Push changes to local database
npx prisma db push

# 4. Test locally
npm run dev
```

### 2. Data Changes (Adding/Updating Records)

For adding or updating seed data:

```bash
# 1. Edit the seed file
# Edit prisma/seed.ts to add/modify data

# 2. Run seed locally
npm run db:seed

# Note: The seed script uses upsert to avoid conflicts
```

### 3. Common Database Operations

```bash
# View database in Prisma Studio
npm run db:studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Generate migration files (for version control)
npx prisma migrate dev --name your_migration_name
```

## Deployment Process

### Step 1: Ensure Environment Variables

Make sure these are set in CapRover:
- `DATABASE_URL` (with connection pooling parameters)
- `DB_MANAGEMENT_SECRET` (for remote database management)
- Other app-specific variables (see CAPROVER_ENV_VARS.md)

### Step 2: Deploy Code Changes

```bash
# 1. Commit your changes
git add .
git commit -m "Descriptive message about database changes"

# 2. Push to main branch
git push origin main

# 3. GitHub Actions automatically deploys to CapRover
# Monitor at: https://github.com/[your-username]/[repo-name]/actions
```

**Note:** We use GitHub Actions for deployment. The workflow file is at `.github/workflows/deploy.yml`

### Step 3: Update Production Database

After the code is deployed:

```bash
# 1. Set the management secret locally
export DB_MANAGEMENT_SECRET=your-secret-from-caprover

# 2. Push schema changes to production
./scripts/manage-remote-db.sh push-schema

# 3. Seed production database (if needed)
./scripts/manage-remote-db.sh seed
```

## Important Files

### Database Configuration
- `prisma/schema.prisma` - Database schema definition
- `prisma/seed.ts` - Seed data for initial/test data
- `.env.development` - Local database connection

### Database Management
- `lib/prisma.ts` - Prisma client singleton
- `lib/db-connection.ts` - Connection retry logic
- `lib/db/products.ts` - Product-specific database operations
- `lib/db-safe.ts` - Safe database operations wrapper

### Deployment Scripts
- `scripts/manage-remote-db.sh` - Remote database management
- `.github/workflows/deploy.yml` - GitHub Actions deployment
- `captain-definition` - CapRover deployment configuration

### API Endpoints
- `/api/db-management/push-schema` - Push schema changes
- `/api/db-management/seed` - Seed database
- `/api/health` - Check database connection status

## Best Practices

### 1. Always Test Locally First
```bash
# Run full test cycle
npm run db:seed
npm run dev
# Test all affected features
```

### 2. Use Upsert for Seed Data
```typescript
// Good - handles existing data
await prisma.product.upsert({
  where: { slug: 'product-slug' },
  update: { price: 10.99 },
  create: { slug: 'product-slug', price: 10.99, ...otherFields }
});

// Bad - fails if data exists
await prisma.product.create({
  data: { slug: 'product-slug', price: 10.99 }
});
```

### 3. Handle Connection Errors
All database operations should use the retry wrapper:
```typescript
import { withRetry } from '@/lib/db-connection';

export async function getProducts() {
  return withRetry(() => 
    prisma.product.findMany()
  );
}
```

### 4. Monitor After Deployment
- Check `/api/health` endpoint
- Monitor CapRover logs
- Verify data in admin panel

## Troubleshooting

### Common Issues

1. **"Unique constraint failed"**
   - Use `upsert` instead of `create`
   - Check for duplicate data

2. **"Connection reset by peer"**
   - Check DATABASE_URL has connection pooling parameters
   - Restart app in CapRover if needed

3. **"Schema out of sync"**
   - Run `./scripts/manage-remote-db.sh push-schema`
   - Ensure code deployment completed first

4. **GitHub Actions failing**
   - Check repository secrets are set correctly
   - Verify CapRover app token is valid

### Debug Commands

```bash
# Check local database connection
node scripts/test-db-connection.js

# Check production health
curl https://vaatwasstripsvergelijker.server.devjens.nl/api/health

# View CapRover logs
# Go to CapRover dashboard > Your App > Logs
```

## Security Notes

1. **Never commit `.env` files** with real credentials
2. **Use strong DB_MANAGEMENT_SECRET** - generate with `openssl rand -base64 32`
3. **Limit database access** - use connection pooling and timeouts
4. **Regular backups** - before major changes

## Quick Reference

### Local Development
```bash
npm run db:push      # Push schema changes
npm run db:seed      # Seed database
npm run db:studio    # Visual database editor
npm run dev          # Start development server
```

### Production Deployment
```bash
git add . && git commit -m "message" && git push origin main
export DB_MANAGEMENT_SECRET=xxx
./scripts/manage-remote-db.sh push-schema
./scripts/manage-remote-db.sh seed
```

### Environment Variables
See `CAPROVER_ENV_VARS.md` for complete list

---

Last updated: June 2025