# Deployment Steps - Database Connection Fix

## 1. Commit and Push Changes
```bash
git add .
git commit -m "Fix database connection issues and TypeScript build error"
git push origin main
```

## 2. Update CapRover Environment Variables

Go to your CapRover dashboard and update these environment variables:

```
DATABASE_URL=postgresql://vaatwasstrips_user:b3f1911f7b58306f@srv-captain--vaatwasstrips-db:5432/vaatwasstrips?connection_limit=5&pool_timeout=30
DB_MANAGEMENT_SECRET=<generate-secure-secret>
```

To generate a secure secret:
```bash
openssl rand -base64 32
```

## 3. Deploy to CapRover
```bash
npm run deploy
```

## 4. Apply Database Schema Changes

After successful deployment:

```bash
# Set your database management secret
export DB_MANAGEMENT_SECRET=<your-generated-secret>

# Push schema changes to production
./scripts/manage-remote-db.sh push-schema
```

## 5. Verify Deployment

1. Check application health:
   ```bash
   curl http://vaatwasstripsvergelijker.server.devjens.nl/api/health
   ```
   
   You should see database status as "connected"

2. Test the website:
   - Visit the homepage
   - Check the admin panel
   - Verify product listings work

3. Monitor logs in CapRover:
   - Go to your app in CapRover
   - Click "Logs" 
   - Watch for any connection errors

## 6. If Issues Persist

If you still see connection errors:

1. Restart the app in CapRover
2. Check the database container is running
3. Increase connection limits if needed:
   ```
   DATABASE_URL=...?connection_limit=10&pool_timeout=60
   ```

## Summary of Changes

✅ Fixed TypeScript build error in app/page.tsx
✅ Added connection pooling to DATABASE_URL
✅ Implemented retry logic for all database operations
✅ Added database health monitoring
✅ Created robust error handling

The application should now handle database connection issues gracefully and automatically retry failed operations.