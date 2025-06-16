# New Brands Deployment Guide

## Summary
We have successfully added two new brands to the Vaatwasstrips Vergelijker:
1. **Natuwash** - Premium brand with OECD 301B certification
2. **GreenGoods** - Budget-friendly brand available on Bol.com

## What Has Been Done

### 1. Database Updates
- ✅ Added Natuwash and GreenGoods to the seed data in `prisma/seed.ts`
- ✅ Updated seed script to use `upsert` to avoid conflicts
- ✅ Successfully seeded local database with all 7 products

### 2. Product Data Added
Both brands have been added with:
- Complete product information
- Pricing data (estimated for Natuwash)
- Sustainability scores
- Features, pros, and cons
- Availability information

## Next Steps for Production Deployment

### 1. Update CapRover Environment Variables
You need to add the `DB_MANAGEMENT_SECRET` to your CapRover app if not already done:

1. Generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```

2. Add to CapRover:
   - Go to your app in CapRover
   - Click "App Configs" → "Environmental Variables"
   - Add: `DB_MANAGEMENT_SECRET=your-generated-secret`
   - Click "Save & Update"

### 2. Deploy Code to CapRover
```bash
# Commit the changes
git add .
git commit -m "Add Natuwash and GreenGoods brands to database"
git push origin main

# GitHub Actions will automatically deploy to CapRover
# Monitor the deployment at: https://github.com/[your-repo]/actions
```

### 3. Update Production Database
After deployment and setting the DB_MANAGEMENT_SECRET:

```bash
# Set the secret locally
export DB_MANAGEMENT_SECRET=your-actual-secret-from-caprover

# Push schema changes (if any)
./scripts/manage-remote-db.sh push-schema

# Seed the database with new products
./scripts/manage-remote-db.sh seed
```

### 4. Verify Deployment
1. Check the health endpoint:
   ```bash
   curl http://vaatwasstripsvergelijker.server.devjens.nl/api/health
   ```

2. Visit the admin panel to verify products are loaded

3. Check the main website to ensure new brands appear

## Important Notes

### Pricing Data
- **Natuwash**: Current price (€16.95) is estimated. You should:
  1. Visit https://natuwash.com/products/vaatwasstrips
  2. Get actual pricing
  3. Update via admin panel or database

- **GreenGoods**: Price (€34.95 for 120 washes) should be verified on Bol.com

### Review Counts
Both brands have placeholder review counts that should be updated with actual data when available.

### Next Development Tasks
According to the guide, you should also:
1. Create individual brand pages at `/merken/natuwash` and `/merken/greengoods`
2. Update homepage to show "7 Nederlandse merken" instead of "5"
3. Update comparison tables and navigation
4. Set up scrapers for automated price updates

## Troubleshooting

If you encounter database connection errors during deployment:
1. Check CapRover logs for the app
2. Ensure DATABASE_URL includes connection pooling parameters
3. Restart the app in CapRover if needed
4. Refer to `docs/DATABASE_DEPLOYMENT_GUIDE.md` for detailed troubleshooting

## Success Metrics
After successful deployment, you should have:
- 7 total products in the database (up from 5)
- Complete Dutch market coverage
- New premium option (Natuwash) with OECD certification
- New budget-friendly option (GreenGoods) with trial packs