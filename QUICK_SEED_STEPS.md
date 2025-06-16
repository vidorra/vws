# Quick Steps to Seed Production Database

## 1. Generate DB_MANAGEMENT_SECRET (if not done yet)
```bash
openssl rand -base64 32
```

## 2. Add to CapRover
- Go to your CapRover dashboard
- Navigate to your app **vaatwasstripsvergelijker** (NOT the database app)
- Click "App Configs" → "Environmental Variables"
- You should see: DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, JWT_SECRET, NODE_ENV
- Add a new variable: `DB_MANAGEMENT_SECRET=your-generated-secret`
- Click "Save & Update"
- Wait for the app to restart

## 3. Set the secret locally and run seed
```bash
# Replace 'your-actual-secret' with the secret you added to CapRover
export DB_MANAGEMENT_SECRET=your-actual-secret

# Push schema (in case there are any schema changes)
./scripts/manage-remote-db.sh push-schema

# Seed the database with new products
./scripts/manage-remote-db.sh seed
```

## 4. Verify
- Check http://vaatwasstripsvergelijker.server.devjens.nl
- You should now see 7 brands including Natuwash and GreenGoods

## Note about "Wasstrips Original"
If you see "Wasstrips Original" in the production database and want to remove it, you'll need to do that through the admin panel or by creating a cleanup script, as it's not in the current seed data.