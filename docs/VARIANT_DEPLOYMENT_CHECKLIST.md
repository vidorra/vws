# Variant Feature Deployment Checklist

## Pre-Deployment Fixes

### 1. Fix Database Connection (if needed)
If you see "Transport endpoint is not connected" errors:
```bash
# In CapRover:
1. Go to Apps > vaatwasstripsvergelijker
2. Click "Restart App"
3. Wait 30 seconds
4. Verify: curl https://vaatwasstripsvergelijker.server.devjens.nl/api/health
```

### 2. Install Dependencies Locally
```bash
npm install
```

## Deployment Steps

### 1. Commit and Push All Changes
```bash
git add .
git commit -m "Add multi-variant scraping with Prisma fix

- Add ProductVariant model to schema
- Update scrapers for multi-variant support (Bubblyfy, Bio-Suds, Natuwash)
- Add expandable variant display in admin dashboard
- Fix Prisma version for schema push
- Update cron scrape to use variants"

git push origin main
```

### 2. Wait for GitHub Actions
- Go to GitHub repository > Actions tab
- Wait for deployment to complete (green checkmark)
- This deploys code but NOT database schema

### 3. Verify New Code is Deployed
Check CapRover logs. You should see:
- ✅ "Scraping X variants from" (NEW code)
- ❌ NOT "Scraping X price from" (OLD code)

### 4. Push Database Schema
```bash
export DB_MANAGEMENT_SECRET="y43IofseizOambHXporOQRhhu6vB55G+7tEQ2mfJ2js="
./scripts/manage-remote-db.sh push-schema
```

If this fails with Prisma version error:
1. Wait for the new code deployment to complete
2. Restart the app in CapRover
3. Try schema push again

### 5. Restart App After Schema Push
In CapRover:
1. Go to Apps > vaatwasstripsvergelijker
2. Click "Restart App"
3. Wait 30 seconds

### 6. Run Manual Scrape
Option A - Via Admin Dashboard:
1. Go to https://vaatwasstripsvergelijker.server.devjens.nl/data-beheer
2. Login with admin credentials
3. Click "Start Handmatige Scrape"
4. Wait for completion

Option B - Via API:
```bash
# Get admin token from login, then:
curl -X POST https://vaatwasstripsvergelijker.server.devjens.nl/api/admin/scrape \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Verification

### 1. Check Scraping Logs
In admin dashboard > Scraping Logs tab, you should see:
- "Variants: 80x@€18.71, 160x@€31.81, 240x@€44.91" (Bubblyfy)
- "Variants: 10x@€3.95, 30x@€19.95, 60x@€31.49..." (Bio-Suds)
- "Variants: 60x@€18.95, 120x@€29.95..." (Natuwash)

### 2. Check Product Display
In admin dashboard > Dashboard tab:
- Products show variant count (e.g., "3 varianten")
- Click expand icon to see all variants
- Each variant shows: name, wash count, price, price per wash

### 3. Check Edit Modal
- Click "Bewerken" on any product
- Scroll down to see "Varianten (alleen lezen)" section
- Variants should be displayed

## Troubleshooting

### "Schema push failed" with Prisma version error
- The code deployment includes Prisma in devDependencies
- Wait for deployment to complete
- Restart app and try again

### Still seeing old scraping logs
- Check GitHub Actions - ensure deployment succeeded
- Force redeploy: `npm run deploy`
- Check CapRover deployment logs

### No variants after scraping
- Check scraping logs for errors
- Verify schema was pushed successfully
- Check if variants table exists in database

### Connection errors persist
- Restart database container in CapRover
- Check DATABASE_URL has connection pooling parameters
- May need to scale down and up the app

## Success Indicators

✅ Scraping logs show "Found X variants" messages  
✅ Admin dashboard displays variant counts  
✅ Expandable rows work properly  
✅ Edit modal shows variants section  
✅ No database connection errors  
✅ All 3 updated scrapers show multiple variants  

## Post-Deployment

1. Monitor scraping for 24 hours
2. Check if scheduled scraping works (runs daily)
3. Verify variant data persists correctly
4. Document any site-specific issues for future reference