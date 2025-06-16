# Production Scraper Fix Guide

## Overview
Your scrapers work perfectly locally but fail in production due to Puppeteer Chrome permissions. This guide fixes the production environment to support headless Chrome scraping.

## 🎯 Current Status
- ✅ **Local**: All 6 brands scraping successfully
- ❌ **Production**: Chrome permission popup blocks scraping
- 🎯 **Goal**: Make production scraping work without GUI popups

---

## Step 1: Update Puppeteer Launch Configuration

Update **ALL** your scraper files with production-safe Puppeteer arguments.

### Files to Update:
- `lib/scrapers/real-mothersearth-scraper.ts`
- `lib/scrapers/real-cosmeau-scraper.ts` 
- `lib/scrapers/real-bubblyfy-scraper.ts`
- `lib/scrapers/real-biosuds-scraper.ts`
- `lib/scrapers/real-wasstripnl-scraper.ts`
- `lib/scrapers/real-natuwash-scraper.ts`

### Replace Puppeteer Launch Code:

**Find this in each scraper:**
```typescript
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});
```

**Replace with this:**
```typescript
const browser = await puppeteer.launch({
  headless: 'new', // Use new headless mode
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu',
    '--disable-web-security',
    '--disable-features=VizDisplayCompositor',
    '--disable-extensions',
    '--disable-plugins',
    '--disable-default-apps',
    '--no-default-browser-check',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-ipc-flooding-protection',
    '--disable-hang-monitor',
    '--disable-popup-blocking',
    '--disable-prompt-on-repost',
    '--disable-sync',
    '--disable-translate',
    '--metrics-recording-only',
    '--no-crash-upload',
    '--disable-breakpad'
  ]
});
```

### Example: Updated Mother's Earth Scraper

```typescript
// lib/scrapers/real-mothersearth-scraper.ts
import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData } from './base-scraper';

export class RealMothersEarthScraper extends BaseScraper {
  async scrapePrice(url: string): Promise<PriceData> {
    console.log(`🔍 Scraping Mother's Earth price from: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: 'new', // Updated
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-default-apps',
        '--no-default-browser-check',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-ipc-flooding-protection'
      ]
    });

    try {
      const page = await browser.newPage();
      
      // Set realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Set viewport
      await page.setViewport({ width: 1280, height: 720 });
      
      // Navigate to product page with longer timeout
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 45000 // Increased timeout for production
      });
      
      // Wait for page to load
      await page.waitForTimeout(3000); // Increased wait time
      
      // Rest of your scraping logic...
      const priceData = await page.evaluate(() => {
        // Your existing price extraction logic
        const priceSelectors = [
          '.price',
          '.product-price',
          '.price-amount',
          '[data-price]',
          '.money'
        ];
        
        let price = 0;
        let priceText = '';
        
        for (const selector of priceSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            priceText = element.textContent.trim();
            const priceMatch = priceText.match(/(\d+[,.]?\d*)/);
            if (priceMatch) {
              price = parseFloat(priceMatch[0].replace(',', '.'));
              if (price > 0) break;
            }
          }
        }
        
        return {
          price,
          washCount: 60,
          priceText
        };
      });
      
      if (priceData.price === 0) {
        throw new Error(`No price found. Text: "${priceData.priceText}"`);
      }
      
      const pricePerWash = priceData.price / priceData.washCount;
      
      console.log(`✅ Scraped Mother's Earth: €${priceData.price} (€${pricePerWash.toFixed(3)} per wash)`);
      
      return {
        price: priceData.price,
        pricePerWash: pricePerWash,
        currency: 'EUR',
        scrapedAt: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error scraping Mother\'s Earth price:', error);
      throw new Error(`Failed to scrape Mother's Earth: ${error.message}`);
    } finally {
      await browser.close();
    }
  }

  // Update scrapeStock method similarly
  async scrapeStock(url: string): Promise<boolean> {
    console.log(`🔍 Checking Mother's Earth stock for: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      await page.waitForTimeout(2000);
      
      const stockStatus = await page.evaluate(() => {
        // Your existing stock checking logic
        return true; // Default to in stock
      });
      
      console.log(`✅ Mother's Earth stock status: ${stockStatus ? 'In Stock' : 'Out of Stock'}`);
      return stockStatus;
      
    } catch (error) {
      console.error('❌ Error checking Mother\'s Earth stock:', error);
      return true;
    } finally {
      await browser.close();
    }
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    return [];
  }
}
```

---

## Step 2: Update Dockerfile for Chrome Dependencies

### Check Your Current Dockerfile

Your `Dockerfile` should already exist. Add Chrome installation:

```dockerfile
# Add this section after your existing RUN commands but before COPY commands
# Install Chrome dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    libatspi2.0-0 \
    libgtk-4-1 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

### Full Dockerfile Example

If you need to see the complete Dockerfile:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
RUN npx prisma generate

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
FROM node:18-slim AS runner

# Install Chrome and dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    libatspi2.0-0 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

---

## Step 3: Test Locally First

Before deploying, test the updated configuration locally:

```bash
# 1. Update all scraper files with new Puppeteer config
# 2. Test locally
npm run dev

# 3. Go to localhost:3000/data-beheer
# 4. Click "Start Handmatige Scrape"
# 5. Verify all brands still work
```

---

## Step 4: Deploy to Production

### 4.1 Commit Changes

```bash
git add .
git commit -m "Fix Puppeteer configuration for production environment

- Add production-safe Chrome arguments
- Update Dockerfile with Chrome dependencies  
- Set proper environment variables for headless operation"
git push origin main

# GitHub Actions will automatically deploy to CapRover
# Monitor the deployment in the Actions tab of your repository
```

### 4.2 Deploy via GitHub Actions

Your GitHub Actions workflow will automatically deploy to CapRover when you push to main.

### 4.3 Monitor Deployment

1. **Watch GitHub Actions**: Go to your repository → Actions tab
2. **Monitor the deployment workflow** for your latest commit
3. **Check CapRover logs** once GitHub Actions completes
4. Look for Chrome installation messages during container build

---

## Step 5: Test Production Scraping

### 5.1 Test Manual Scraping

1. Go to: `http://vaatwasstripsvergelijker.server.devjens.nl/data-beheer`
2. Login with admin credentials
3. Click "Start Handmatige Scrape"
4. Monitor the results

### 5.2 Expected Results

You should see all 6 brands successfully scraped:

```
✅ success | Mother's Earth  | €19.95 | 3.2s
✅ success | Cosmeau         | €12.99 | 2.8s
✅ success | Bubblyfy        | €18.71 | 3.1s
✅ success | Bio-Suds        | €3.95  | 2.9s
✅ success | Wasstrip.nl     | €14.95 | 2.7s
✅ success | Natuwash        | €18.95 | 3.0s
✅ success | all             | -      | 18.7s | Scraped 6 products successfully, 0 failed
```

---

## Troubleshooting

### Issue: "Chrome not found" error
**Solution**: Verify Chrome installation in Dockerfile, rebuild container

### Issue: "Permission denied" errors
**Solution**: Add more Chrome arguments, check user permissions

### Issue: Timeouts in production
**Solution**: Increase timeout values, add more wait time

### Issue: Memory errors
**Solution**: 
1. Increase CapRover app memory allocation
2. Add `--memory-pressure-off` to Chrome args
3. Limit concurrent scraping

### Debug Commands

Check if Chrome is installed in production:
```bash
# SSH into CapRover container (if possible)
which google-chrome-stable
google-chrome-stable --version
```

Check CapRover logs:
```bash
# In CapRover dashboard
# Go to your app → Logs
# Look for Chrome/Puppeteer related errors
```

---

## Alternative: Lightweight Solution

If the full Chrome installation is too heavy, try this lighter approach:

### Use Puppeteer with Chromium

```bash
# Install different Puppeteer version
npm install puppeteer@21.5.0
```

Update scraper configuration:
```typescript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: process.env.NODE_ENV === 'production' 
    ? '/usr/bin/google-chrome-stable' 
    : undefined,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--single-process'
  ]
});
```

---

## Success Criteria

✅ All 6 brands scrape successfully in production  
✅ No Chrome popup/permission issues  
✅ Scraping logs show real prices  
✅ Manual scraping works from admin panel  
✅ Stock status detection works  
✅ Performance is acceptable (< 30 seconds total)

After completing this guide, your production scraping should work exactly like your local environment!