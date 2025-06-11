# CapRover Environment Variables

Add these environment variables to your CapRover app:

## Required Environment Variables for CapRover:

Copy and paste these into your CapRover app's environment variables:

```
DATABASE_URL=postgresql://vaatwasstrips_user:b3f1911f7b58306f@srv-captain--vaatwasstrips-db:5432/vaatwasstrips?connection_limit=5&pool_timeout=30
ADMIN_EMAIL=admin@vaatwasstripsvergelijker.nl
ADMIN_PASSWORD_HASH=$2b$10$IHiFW8AWC4bx97UgoiZS8OXi6eLJ4mhbeUg0ZapW/tV3LkR.ZajHK
JWT_SECRET=WWbPTx3royqFkvRJsknEDWRms2vA9e1E30LCNUUW5r4=
NODE_ENV=production
DB_MANAGEMENT_SECRET=your-db-management-secret-here
```

**Note**: The admin password is currently set to `admin123`. You can generate a new hash with a different password using `node scripts/generate-password-hash.js yourpassword`

## To generate ADMIN_PASSWORD_HASH:
```bash
node scripts/generate-password-hash.js
# Enter your desired admin password when prompted
```

## To generate JWT_SECRET:
```bash
openssl rand -base64 32
```

## How to add in CapRover:
1. Go to your app in CapRover
2. Click "App Configs"
3. Click "Environmental Variables"
4. Add each variable as Key=Value
5. Click "Save & Update"