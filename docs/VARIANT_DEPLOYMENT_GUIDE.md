# Variant Feature Deployment Guide

## Overview
This guide covers the deployment of the multi-variant scraping feature and dashboard updates to the production environment.

## Database Changes Required
We've added a new `ProductVariant` table to the schema that needs to be deployed to production.

## Step-by-Step Deployment Process

### 1. Commit and Push Code Changes
```bash
git add .
git commit -m "Add multi-variant scraping and dashboard updates

- Add ProductVariant database model
- Update scrapers to capture multiple pack sizes (Bubblyfy, Bio-Suds, Natuwash)
- Add expandable variant display in admin dashboard
- Update edit modal to show variants (read-only)
- Maintain cascade delete for variants"

git push origin main
```

### 2. Wait for GitHub Actions
- Check the Actions tab on GitHub
- Wait for the deployment to complete successfully
- This will deploy the code but NOT the database schema changes

### 3. Push Database Schema Changes
```bash
# Set the database management secret
export DB_MANAGEMENT_SECRET="y43IofseizOambHXporOQRhhu6vB55G+7tEQ2mfJ2js="

# Push the schema changes (this adds the ProductVariant table)
./scripts/manage-remote-db.sh push-schema
```

### 4. Run Initial Scraping to Populate Variants
After the schema is updated, trigger a manual scrape to populate the variant data:

```bash
# Option 1: Via Admin Dashboard
# 1. Go to https://vaatwasstripsvergelijker.server.devjens.nl/data-beheer
# 2. Login with admin credentials
# 3. Click "Start Handmatige Scrape"

# Option 2: Via API (if you have the admin token)
curl -X POST https://vaatwasstripsvergelijker.server.devjens.nl/api/admin/scrape \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 5. Verify Deployment

1. **Check Database Schema**:
   - The ProductVariant table should be created
   - Existing products should remain intact

2. **Check Admin Dashboard**:
   - Go to https://vaatwasstripsvergelijker.server.devjens.nl/data-beheer
   - Products should show expandable rows with variant counts
   - Click expand icons to see variant details

3. **Check Variant Data**:
   - Bubblyfy should show 3 variants
   - Bio-Suds should show 6 variants
   - Natuwash should show 4 variants
   - Other brands should continue working with single variants

## Important Notes

### Schema Changes
- The `push-schema` command will add the new ProductVariant table
- It will NOT delete existing data
- The relation uses cascade delete, so deleting a product removes its variants

### Backward Compatibility
- Products without variants will continue to work normally
- The main product fields (price, pricePerWash) remain for backward compatibility
- These represent the "default" or "best value" variant

### First Scrape
- The first scrape after deployment will populate variant data
- Subsequent scrapes will update variant prices and availability
- Manual scraping can be triggered from the admin dashboard

## Rollback Plan

If issues occur:

1. **Code Rollback**:
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Database Rollback** (if needed):
   - The ProductVariant table can be safely dropped without affecting existing functionality
   - Products will continue to work with single prices

## Expected Results

After successful deployment:

✅ Admin dashboard shows variant counts for products  
✅ Expandable rows reveal variant details  
✅ Edit modal displays variants in read-only section  
✅ Scraping captures multiple pack sizes:
- Bubblyfy: 80, 160, 240 washes
- Bio-Suds: 10, 30, 60, 120, 240, 360 washes  
- Natuwash: 60, 120, 180, 240 washes

## Monitoring

1. **Check Scraping Logs**:
   - Go to Admin Dashboard > Scraping Logs tab
   - Verify scrapers are finding multiple variants

2. **Check Application Logs**:
   - In CapRover, check app logs for any errors
   - Look for "Found X variants" messages

3. **Database Health**:
   - Check /api/health endpoint
   - Verify database connections are stable

## Support

If you encounter issues:
1. Check CapRover logs for error messages
2. Verify database schema was updated correctly
3. Ensure scrapers have internet access
4. Check individual scraper test results