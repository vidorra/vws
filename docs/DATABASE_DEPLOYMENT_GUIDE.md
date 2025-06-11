# Database Deployment Guide

This guide helps you resolve database connection issues and apply schema changes to your production environment.

## Prerequisites

1. Ensure you have the latest code deployed to CapRover
2. Have access to your CapRover dashboard
3. Have the database management secret ready

## Step 1: Update Environment Variables in CapRover

Add or update these environment variables in your CapRover app:

```
DATABASE_URL=postgresql://vaatwasstrips_user:b3f1911f7b58306f@srv-captain--vaatwasstrips-db:5432/vaatwasstrips?connection_limit=5&pool_timeout=30
ADMIN_EMAIL=admin@vaatwasstripsvergelijker.nl
ADMIN_PASSWORD_HASH=$2b$10$IHiFW8AWC4bx97UgoiZS8OXi6eLJ4mhbeUg0ZapW/tV3LkR.ZajHK
JWT_SECRET=WWbPTx3royqFkvRJsknEDWRms2vA9e1E30LCNUUW5r4=
NODE_ENV=production
DB_MANAGEMENT_SECRET=your-secure-secret-here
```

**Important**: 
- The `DATABASE_URL` now includes connection pooling parameters to prevent connection errors
- Generate a secure `DB_MANAGEMENT_SECRET` using: `openssl rand -base64 32`

## Step 2: Deploy the Updated Code

1. Commit and push your changes:
```bash
git add .
git commit -m "Fix database connection issues with retry logic and connection pooling"
git push origin main
```

2. Deploy to CapRover:
```bash
npm run deploy
```

## Step 3: Apply Database Schema Changes

After deployment, apply your schema changes to the production database:

```bash
# Set the database management secret
export DB_MANAGEMENT_SECRET=your-secure-secret-here

# Push schema changes
./scripts/manage-remote-db.sh push-schema

# If you need to seed initial data
./scripts/manage-remote-db.sh seed
```

## Step 4: Verify the Deployment

1. Check the application health:
```bash
curl http://vaatwasstripsvergelijker.server.devjens.nl/api/health
```

2. Monitor the logs in CapRover for any connection errors

3. Test the admin panel to ensure database operations work correctly

## Troubleshooting Connection Errors

### Error: "Socket not connected" or "Connection reset by peer"

These errors indicate connection pool exhaustion or network issues. The fixes we've implemented include:

1. **Connection Pooling**: Added connection limits and timeout parameters to the DATABASE_URL
2. **Retry Logic**: Implemented automatic retry for failed database operations
3. **Proper Cleanup**: Ensured connections are properly closed when the process exits

### If errors persist:

1. **Check CapRover Database Service**:
   - Ensure the database container is running
   - Check if it needs a restart
   - Verify the database has enough resources

2. **Increase Connection Limits** (if needed):
   ```
   DATABASE_URL=postgresql://...?connection_limit=10&pool_timeout=60
   ```

3. **Check Database Logs**:
   - Access CapRover dashboard
   - Go to your database app (vaatwasstrips-db)
   - Check the logs for any errors

## Connection Pool Parameters Explained

- `connection_limit=5`: Maximum number of connections in the pool
- `pool_timeout=30`: Maximum time (in seconds) to wait for a connection

These values are conservative to prevent overwhelming the database. Adjust based on your needs.

## Best Practices

1. **Always test locally first**:
   ```bash
   npm run dev
   ```

2. **Use the management script** for schema changes instead of direct database access

3. **Monitor after deployment** for at least 30 minutes to catch any connection issues

4. **Keep backups** before major schema changes:
   ```bash
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

## Summary of Changes Made

1. **Added retry logic** to all database operations
2. **Implemented connection pooling** with appropriate limits
3. **Added proper connection cleanup** on process exit
4. **Created helper functions** for robust database operations
5. **Updated environment variables** with connection parameters

These changes should resolve the PostgreSQL connection errors you've been experiencing in production.