# Database Change Guide

This guide provides step-by-step instructions for making database changes and deploying them to production.

## Overview

The project uses:
- **Prisma ORM** for database management
- **PostgreSQL** as the database
- **GitHub Actions** for automatic deployment to CapRover
- **Remote database management scripts** for production updates

## CapRover Setup

We have two apps in CapRover:
1. **vaatwasstrips-db** - PostgreSQL database with its own environment variables
2. **vaatwasstripsvergelijker** - Next.js application with:
   - DATABASE_URL: `postgresql://vaatwasstrips_user:b3f1911f7b58306f@srv-captain--vaatwasstrips-db:5432/vaatwasstrips`
   - DB_MANAGEMENT_SECRET: `y43IofseizOambHXporOQRhhu6vB55G+7tEQ2mfJ2js=`
   - Other vars: ADMIN_EMAIL, ADMIN_PASSWORD_HASH, JWT_SECRET, NODE_ENV

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
# NO NEED for 'npm run deploy' - GitHub Actions handles it!
# Monitor at: https://github.com/[your-username]/[repo-name]/actions
```

**Note:** We use GitHub Actions for deployment. The workflow file is at `.github/workflows/deploy.yml`

### Step 3: Update Production Database

After the code is deployed:

```bash
# 1. Set the management secret locally (for this project)
export DB_MANAGEMENT_SECRET="y43IofseizOambHXporOQRhhu6vB55G+7tEQ2mfJ2js="

# 2. Push schema changes to production (may fail with Prisma version issues - can skip if only data changes)
./scripts/manage-remote-db.sh push-schema

# 3. Seed production database (this is usually what you need)
./scripts/manage-remote-db.sh seed
```

**Note:** The seed script will clear existing data and recreate all products. It uses `upsert` for admin users and settings to avoid conflicts.

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
# Switch to Node 20 if needed
nvm use 20

# Database commands
npm run db:push      # Push schema changes
npm run db:seed      # Seed database
npm run db:studio    # Visual database editor
npm run dev          # Start development server
```

### Production Deployment (Complete Flow)
```bash
# 1. Make your changes locally
# 2. Test locally
npm run db:seed
npm run dev

# 3. Commit and deploy
git add . && git commit -m "message" && git push origin main

# 4. Wait for GitHub Actions to complete deployment

# 5. Update production database
export DB_MANAGEMENT_SECRET="y43IofseizOambHXporOQRhhu6vB55G+7tEQ2mfJ2js="
./scripts/manage-remote-db.sh seed

# 6. Verify
curl http://vaatwasstripsvergelijker.server.devjens.nl/api/health
```

### Common Tasks

#### Adding New Products
1. Edit `prisma/seed.ts` to add new product data
2. Run `npm run db:seed` locally to test
3. Commit, push, and run remote seed as above

#### Removing Products
- Products are cleared and recreated on each seed
- To remove a product, simply remove it from `prisma/seed.ts`
- Run the full deployment flow

### Environment Variables
- Local: `.env.development` (not in git)
- Production: Set in CapRover app configs
- See `CAPROVER_ENV_VARS.md` for complete list

### Important URLs
- Production: http://vaatwasstripsvergelijker.server.devjens.nl
- Health Check: http://vaatwasstripsvergelijker.server.devjens.nl/api/health
- Admin Panel: http://vaatwasstripsvergelijker.server.devjens.nl/data-beheer

## Web Scraping Implementation

### New Endpoints Added
- `/api/admin/scrape` - Manual scraping trigger (admin authenticated)
- `/api/cron/scrape` - Automated scraping endpoint (DB_MANAGEMENT_SECRET authenticated)

### Scraping Features
The application now includes real web scrapers for all 7 brands:
- Mother's Earth, Cosmeau, Bubblyfy, Bio-Suds, Wasstrip.nl, GreenGoods, Natuwash

### Manual Scraping
1. Login to admin panel: `/data-beheer`
2. Click "Start Handmatige Scrape" button
3. Real prices will be fetched and stored in database

### Automated Scraping Setup
For weekly automated scraping, set up a cron job that calls:
```bash
curl -H "Authorization: Bearer $DB_MANAGEMENT_SECRET" \
     https://vaatwasstripsvergelijker.server.devjens.nl/api/cron/scrape
```

The endpoint uses the existing `DB_MANAGEMENT_SECRET` for authentication.

### Testing Scrapers
```bash
# Test scrapers locally before deployment
node scripts/test-scrapers.js
```

### Important Notes
- Scrapers need real product URLs to work (update in `lib/scrapers/scraping-coordinator.ts`)
- 3-second delay between scrapes to be respectful to websites
- Failed scrapes don't stop the entire process
- Puppeteer is configured for containerized environments

---

Last updated: June 2025