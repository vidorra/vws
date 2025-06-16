import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData } from './base-scraper';

export class RealBioSudsScraper extends BaseScraper {
  async scrapePrice(url: string): Promise<PriceData> {
    console.log(`🔍 Scraping Bio-Suds price from: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
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

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1280, height: 720 });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const priceData = await page.evaluate(() => {
        // Bio-Suds specific selectors (Shopify-based)
        const priceSelectors = [
          '.price__current',
          '.price',
          '.product-price',
          '[data-price]',
          '.money',
          '.price-item--regular'
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
        
        // Bio-Suds typically shows price for pack of 60
        return {
          price,
          washCount: 60,
          priceText
        };
      });
      
      if (priceData.price === 0) {
        throw new Error(`No price found for Bio-Suds. Text: "${priceData.priceText}"`);
      }
      
      const pricePerWash = priceData.price / priceData.washCount;
      
      console.log(`✅ Scraped Bio-Suds: €${priceData.price} (€${pricePerWash.toFixed(3)} per wash)`);
      
      return {
        price: priceData.price,
        pricePerWash: pricePerWash,
        currency: 'EUR',
        scrapedAt: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error scraping Bio-Suds:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeStock(url: string): Promise<boolean> {
    console.log(`🔍 Checking Bio-Suds stock for: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const stockStatus = await page.evaluate(() => {
        // Check for Shopify add to cart button
        const addToCartButton = document.querySelector('button[name="add"], .btn-product-add, .product-form__cart-submit');
        
        if (addToCartButton) {
          const isDisabled = addToCartButton.hasAttribute('disabled');
          const buttonText = addToCartButton.textContent?.toLowerCase() || '';
          
          // If button is disabled or shows "sold out", it's out of stock
          if (isDisabled || buttonText.includes('sold out') || buttonText.includes('uitverkocht')) {
            return false;
          }
          
          // If button shows "add to cart" and not disabled, it's in stock
          if (buttonText.includes('add') || buttonText.includes('toevoegen')) {
            return true;
          }
        }
        
        // Check for explicit stock messages
        const stockTexts = document.body.textContent?.toLowerCase() || '';
        if (stockTexts.includes('in stock') || stockTexts.includes('op voorraad')) {
          return true;
        }
        if (stockTexts.includes('out of stock') || stockTexts.includes('uitverkocht')) {
          return false;
        }
        
        // Default to in stock
        return true;
      });
      
      console.log(`✅ Bio-Suds stock status: ${stockStatus ? 'In Stock' : 'Out of Stock'}`);
      return stockStatus;
      
    } catch (error) {
      console.error('❌ Error checking Bio-Suds stock:', error);
      return true; // Default to in stock on error
    } finally {
      await browser.close();
    }
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    return [];
  }
}