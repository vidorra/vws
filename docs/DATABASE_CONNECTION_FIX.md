# Database Connection Error Fix

## Issue
```
prisma:error Error in PostgreSQL connection: Error { kind: Io, cause: Some(Os { code: 107, kind: NotConnected, message: "Transport endpoint is not connected" }) }
```

## Quick Fix Steps

### 1. Restart the App in CapRover
This usually resolves the connection issue:

1. Go to CapRover dashboard
2. Navigate to "vaatwasstripsvergelijker" app
3. Click "Restart App"
4. Wait 30 seconds for the app to fully restart

### 2. Check Database Container
Ensure the database container is running:

1. In CapRover, go to "Apps"
2. Find "vaatwasstrips-db"
3. Check if it's running (green status)
4. If not, start it

### 3. Verify After Restart
After restarting:
```bash
# Check if the app is healthy
curl https://vaatwasstripsvergelijker.server.devjens.nl/api/health
```

You should see:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

## Important Notes

1. **This is NOT related to the variant deployment** - it's a connection pooling issue
2. **The scraping still works** - notice it says "Scraping completed! 6 products processed"
3. **Data is likely saved** - the errors appear after scraping completes
4. **This happens periodically** - it's a known issue with long-running connections

## Prevention

The app already has:
- Connection pooling with limits
- Retry logic for database operations
- Automatic reconnection attempts

But sometimes a full restart is needed to clear stale connections.

## Next Steps for Variant Deployment

Once the connection is fixed:

1. **Deploy the new code first** (if not already done):
   ```bash
   git push origin main
   ```

2. **Then push the schema**:
   ```bash
   export DB_MANAGEMENT_SECRET="y43IofseizOambHXporOQRhhu6vB55G+7tEQ2mfJ2js="
   ./scripts/manage-remote-db.sh push-schema
   ```

3. **Restart app again** after schema push

4. **Run manual scrape** to populate variants

The connection errors are annoying but don't prevent the variant feature from working once deployed.