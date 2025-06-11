# Simple Deployment Steps

## 1. Install CapRover CLI (if not already installed)
```bash
npm install -g caprover
```

## 2. Deploy to CapRover

First, make sure you're logged in to CapRover:
```bash
caprover login
```

Then deploy:
```bash
npm run deploy
```

Or if that doesn't work, use:
```bash
caprover deploy
```

## 3. Update DATABASE_URL in CapRover

Go to your CapRover dashboard → vaatwasstripsvergelijker app → App Configs → Environmental Variables

Update the DATABASE_URL to include connection pooling:
```
DATABASE_URL=postgresql://vaatwasstrips-db:thepassword@srv-captain--vaatwasstrips-db:5432/vaatwasstrips?connection_limit=5&pool_timeout=30
```

## That's It!

Your app should now work with:
- The Methodologie page (it's static, no database needed)
- Better database connection handling
- Automatic retry on connection failures

## Important Notes

- The database credentials are based on your vaatwasstrips-db app settings:
  - User: vaatwasstrips-db
  - Password: thepassword
  - Database: vaatwasstrips

- You don't need to re-seed the database if it was already working
- The connection pooling parameters (?connection_limit=5&pool_timeout=30) help prevent connection errors