# CapRover Deployment Checklist

## ✅ Completed Steps:
1. Created PostgreSQL database in CapRover (`vaatwasstrips-db`)
2. Fixed Dockerfile to handle Prisma generation
3. Added dummy DATABASE_URL for build time
4. Made database pages use dynamic rendering
5. Fixed TypeScript error (brand → supplier)
6. Successfully deployed to CapRover
7. Pushed schema to remote database
8. Seeded database with initial data
9. Created secure database management endpoints

## 📋 Your Database Connection:
```
DATABASE_URL=postgresql://vaatwasstrips_user:b3f1911f7b58306f@srv-captain--vaatwasstrips-db:5432/vaatwasstrips
```

## 🔐 Environment Variables in CapRover:
All these should be set in App Configs → Environmental Variables:
```
DATABASE_URL=postgresql://vaatwasstrips_user:b3f1911f7b58306f@srv-captain--vaatwasstrips-db:5432/vaatwasstrips
ADMIN_EMAIL=admin@vaatwasstripsvergelijker.nl
ADMIN_PASSWORD_HASH=$2b$10$IHiFW8AWC4bx97UgoiZS8OXi6eLJ4mhbeUg0ZapW/tV3LkR.ZajHK
JWT_SECRET=WWbPTx3royqFkvRJsknEDWRms2vA9e1E30LCNUUW5r4=
NODE_ENV=production
DB_MANAGEMENT_SECRET=your-very-secure-secret-here  # Add this for database management
```

## 🚀 Database Management:

### For Future Schema Updates:
1. Make changes to `prisma/schema.prisma` locally
2. Test locally with `npx prisma db push`
3. Deploy to CapRover: `git push`
4. Push schema to remote:
   ```bash
   DB_MANAGEMENT_SECRET=your-secret ./scripts/manage-remote-db.sh push-schema
   ```

### For Re-seeding Database:
```bash
DB_MANAGEMENT_SECRET=your-secret ./scripts/manage-remote-db.sh seed
```

See `docs/DATABASE_MANAGEMENT.md` for detailed instructions.

## 🌐 Live Application:
- Main site: http://vaatwasstripsvergelijker.server.devjens.nl
- Admin panel: http://vaatwasstripsvergelijker.server.devjens.nl/data-beheer
  - Email: admin@vaatwasstripsvergelijker.nl
  - Password: admin123

## 🔧 Troubleshooting:

### If deployment fails:
1. Check CapRover logs for specific errors
2. Ensure all environment variables are set
3. Try redeploying from CapRover dashboard

### If database operations fail:
1. Verify DB_MANAGEMENT_SECRET is set in CapRover
2. Check that the database container is running
3. Review API response for specific error messages

### SSL Certificate Issues:
- The app currently uses HTTP due to self-signed certificate issues
- To enable HTTPS, you'll need to configure proper SSL certificates in CapRover

## 📝 Maintenance Tasks:

### Regular Backups:
```bash
# Create backup
pg_dump -h srv-captain--vaatwasstrips-db -p 5432 -U vaatwasstrips_user -d vaatwasstrips > backup_$(date +%Y%m%d).sql
```

### Monitor Logs:
- Check CapRover app logs regularly
- Monitor database connection health
- Review scraping job results (when implemented)

## 🚨 Security Notes:
1. Change the default admin password after first login
2. Rotate DB_MANAGEMENT_SECRET periodically
3. Keep JWT_SECRET secure and never expose it
4. Regularly update dependencies for security patches