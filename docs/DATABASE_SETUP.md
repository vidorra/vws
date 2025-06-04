# Database Setup Guide - Vaatwasstrips Vergelijker

## Prerequisites

1. **PostgreSQL** installed locally or access to a PostgreSQL database
2. **Node.js** and npm installed
3. **ts-node** installed (for running TypeScript files)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
npm install --save-dev ts-node
```

### 2. Set Up Database

#### Option A: Local PostgreSQL

1. Create a new PostgreSQL database:
```sql
CREATE DATABASE vaatwasstrips;
```

2. Update your `.env` file with your database connection:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/vaatwasstrips"
```

#### Option B: Cloud Database (Recommended for Production)

Popular options:
- **Supabase** (Free tier available)
- **Neon** (Free tier available)
- **Railway** (Simple deployment)
- **DigitalOcean** (Managed databases)

Example with Supabase:
1. Create account at https://supabase.com
2. Create new project
3. Copy the connection string from Settings > Database
4. Add to `.env`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Push Database Schema

```bash
# This creates the tables in your database
npm run db:push

# Or use migrations (recommended for production)
npm run db:migrate
```

### 4. Seed Initial Data

```bash
npm run db:seed
```

This will:
- Create 5 sample products (vaatwasstrips)
- Add price history for each product
- Create sample reviews
- Create an admin user (email: admin@vaatwasstripsvergelijker.nl, password: admin123)
- Add site settings

### 5. Verify Setup

```bash
# Open Prisma Studio to view your data
npm run db:studio
```

This opens a web interface where you can:
- View all tables
- Check if data was seeded correctly
- Manually edit data if needed

## Database Schema Overview

### Main Tables:

1. **Product** - Stores vaatwasstrips products
   - Basic info (name, supplier, description)
   - Pricing (currentPrice, pricePerWash)
   - Stock status
   - Features, pros, cons
   - SEO metadata

2. **PriceHistory** - Tracks price changes over time
   - Links to Product
   - Records price and timestamp

3. **Review** - User reviews for products
   - Rating (1-5)
   - Title and content
   - User info
   - Verification status

4. **ScrapingLog** - Logs scraping attempts
   - Success/failure status
   - Price changes detected
   - Duration and timestamps

5. **PriceAlert** - User price alerts
   - Target price
   - Email for notifications
   - Active status

6. **AdminUser** - Admin panel users
   - Email and password hash
   - Login tracking

7. **Subscriber** - Newsletter subscribers
   - Email preferences
   - Verification status

8. **BlogPost** & **Guide** - Content management
   - SEO-friendly URLs (slugs)
   - Publishing status
   - Meta information

9. **AffiliateClick** - Track affiliate conversions
   - Product and supplier
   - Conversion tracking

10. **SiteSetting** - Global site configuration
    - Key-value pairs
    - Site name, contact info, etc.

## Common Commands

```bash
# View current schema
npx prisma studio

# Update schema after changes
npx prisma generate

# Push schema changes to database
npm run db:push

# Create a migration
npm run db:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-seed database
npm run db:seed
```

## Troubleshooting

### Connection Issues
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Check firewall/network settings
- Verify username/password

### Migration Errors
- Run `npx prisma generate` after schema changes
- Check for syntax errors in schema.prisma
- Ensure database user has CREATE/ALTER permissions

### Seed Errors
- Check if ts-node is installed
- Verify import paths in seed.ts
- Check for unique constraint violations

## Next Steps

After database setup:

1. **Update API routes** to use Prisma instead of mock data
2. **Implement real scraping** to populate products
3. **Set up cron jobs** for automatic updates
4. **Add data validation** in API routes
5. **Implement caching** for better performance

## Security Notes

- Never commit `.env` file with real credentials
- Use strong passwords for database
- Limit database user permissions in production
- Enable SSL for database connections
- Regular backups recommended