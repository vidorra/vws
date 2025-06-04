# CapRover Deployment Checklist

## ✅ Completed Steps:
1. Created PostgreSQL database in CapRover (`vaatwasstrips-db`)
2. Fixed Dockerfile to handle Prisma generation
3. Added dummy DATABASE_URL for build time
4. Made database pages use dynamic rendering
5. Fixed TypeScript error (brand → supplier)

## 📋 Your Database Connection:
```
DATABASE_URL=postgresql://vaatwasstrips_user:b3f1911f7b58306f@srv-captain--vaatwasstrips-db:5432/vaatwasstrips
```

## 🚀 Next Steps:

### 1. Verify Environment Variable in CapRover:
- Go to your app: `vaatwasstripsvergelijker`
- App Configs → Environmental Variables
- Ensure DATABASE_URL is set with the value above

### 2. Wait for Deployment to Complete:
- Check CapRover deployment logs
- Should take 2-5 minutes

### 3. Import Your Database:
```bash
# Option 1: Node.js script
node scripts/import-to-caprover.js

# Option 2: Shell script (if Node fails)
chmod +x scripts/import-to-caprover.sh
./scripts/import-to-caprover.sh
```

### 4. Clean Up (IMPORTANT - After successful import):
```bash
# Delete the temporary API endpoint
rm app/api/setup-db/route.ts
git add -A && git commit -m "Remove temporary database setup endpoint" && git push
```

### 5. Verify Everything Works:
- Visit: https://vaatwasstripsvergelijker.server.devjens.nl
- Check if products are displayed
- Test the admin panel at /data-beheer

## 🔧 Troubleshooting:

If deployment still fails:
1. Check CapRover logs for specific errors
2. Ensure all environment variables are set
3. Try redeploying from CapRover dashboard

If import fails:
1. Check if the app is fully deployed and running
2. Verify the DATABASE_URL is correct
3. Check browser console for the API endpoint response