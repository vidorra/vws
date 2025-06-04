# Database Management Guide

This guide explains how to manage the database for the Vaatwasstrips Vergelijker application, both locally and on CapRover.

## Overview

The application uses PostgreSQL with Prisma ORM for database management. We have secure API endpoints for managing the remote database schema and data.

## Local Database Management

### Initial Setup

1. Ensure PostgreSQL is installed and running locally
2. Create a local database:
   ```bash
   createdb vaatwasstrips_local
   ```

3. Set up your `.env` file with the local database URL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/vaatwasstrips_local"
   ```

### Schema Management

Push schema changes to your local database:
```bash
npx prisma db push
```

Generate Prisma client after schema changes:
```bash
npx prisma generate
```

### Seeding Local Database

Run the seed script:
```bash
npm run db:seed
```

## Remote Database Management (CapRover)

### Security Setup

1. Add a secure secret to your CapRover environment variables:
   ```
   DB_MANAGEMENT_SECRET=your-very-secure-secret-here
   ```

2. This secret is required for all remote database management operations.

### Using the Management Script

We provide a convenient script for managing the remote database:

#### Push Schema Changes

To push your local schema to the remote database:
```bash
DB_MANAGEMENT_SECRET=your-secret ./scripts/manage-remote-db.sh push-schema
```

#### Seed Remote Database

To seed the remote database with initial data:
```bash
DB_MANAGEMENT_SECRET=your-secret ./scripts/manage-remote-db.sh seed
```

### Direct API Usage

You can also use the API endpoints directly:

#### Push Schema
```bash
curl -X POST \
  -H "x-admin-secret: your-secret" \
  -H "Content-Type: application/json" \
  https://your-app-url/api/db-management/push-schema
```

#### Seed Database
```bash
curl -X POST \
  -H "x-admin-secret: your-secret" \
  -H "Content-Type: application/json" \
  https://your-app-url/api/db-management/seed
```

## Workflow for Database Updates

1. **Make schema changes locally** in `prisma/schema.prisma`
2. **Test locally**:
   ```bash
   npx prisma db push
   npm run dev
   ```
3. **Update seed data** if needed in `prisma/seed.ts`
4. **Test seeding locally**:
   ```bash
   npm run db:seed
   ```
5. **Deploy to CapRover**:
   ```bash
   git add -A
   git commit -m "Update database schema"
   git push
   ```
6. **Push schema to remote**:
   ```bash
   DB_MANAGEMENT_SECRET=your-secret ./scripts/manage-remote-db.sh push-schema
   ```
7. **Seed remote database** (if needed):
   ```bash
   DB_MANAGEMENT_SECRET=your-secret ./scripts/manage-remote-db.sh seed
   ```

## Troubleshooting

### Connection Issues
- Ensure the CapRover PostgreSQL addon is running
- Check that DATABASE_URL is correctly set in CapRover environment variables
- Verify network connectivity to your CapRover instance

### Schema Push Failures
- Check for migration conflicts
- Ensure the database user has sufficient permissions
- Review the error message in the API response

### Seeding Issues
- Verify that the seed data doesn't violate any constraints
- Check for duplicate key errors
- Ensure all required fields are provided in seed data

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use strong secrets** for DB_MANAGEMENT_SECRET
3. **Rotate secrets regularly**
4. **Limit access** to database management endpoints
5. **Monitor usage** of these endpoints in your logs

## Backup and Recovery

### Creating Backups

From your local machine:
```bash
pg_dump -h your-caprover-host -p 5432 -U vaatwasstrips_user -d vaatwasstrips > backup.sql
```

### Restoring from Backup

```bash
psql -h your-caprover-host -p 5432 -U vaatwasstrips_user -d vaatwasstrips < backup.sql
```

## Migration Strategy

For production environments, consider using Prisma Migrations instead of `db push`:

1. Create a migration:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```

2. Apply migrations in production:
   ```bash
   npx prisma migrate deploy
   ```

This provides better version control and rollback capabilities for schema changes.