# Admin Panel Setup Guide

## Overview
The admin panel is available at `/data-beheer` and provides functionality for:
- Manual price scraping
- Product data management
- Monitoring scraping status
- Viewing product inventory

## Initial Setup

### 1. Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### 2. Generate Admin Password Hash
Use the provided script to generate a secure password hash:

```bash
node scripts/generate-password-hash.js your-secure-password
```

Copy the generated hash to your `.env` file:
```
ADMIN_PASSWORD_HASH=<generated-hash>
```

### 3. Configure Admin Email
Set your admin email in `.env`:
```
ADMIN_EMAIL=admin@wasstripsvergelijker.nl
```

### 4. Set JWT Secret
Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

Add to `.env`:
```
JWT_SECRET=<generated-secret>
```

## Accessing the Admin Panel

1. Navigate to `https://yourdomain.com/data-beheer/login`
2. Enter your admin email and password
3. You'll be redirected to the dashboard upon successful login

## Features

### Dashboard Overview
- View all products with current prices
- See stock status
- Check last update times
- Monitor scraping status

### Manual Scraping
- Click "Start Handmatige Scrape" to trigger manual price updates
- Monitor progress in real-time
- View results immediately after completion

### Security Notes
- The admin panel is blocked from search engines via robots.txt
- All admin routes require JWT authentication
- Tokens expire after 24 hours
- No default passwords in production

## Development Mode
In development, if no `ADMIN_PASSWORD_HASH` is set, you can use:
- Email: `admin@wasstripsvergelijker.nl`
- Password: `admin123`

**Never use default credentials in production!**

## Troubleshooting

### Can't Login
1. Check that environment variables are set correctly
2. Verify the password hash was generated properly
3. Ensure JWT_SECRET is set

### Scraping Fails
1. Check console logs for specific errors
2. Verify scraper implementations
3. Ensure target websites are accessible

### Token Issues
1. Clear localStorage if experiencing auth issues
2. Generate a new token by logging in again
3. Check that JWT_SECRET hasn't changed