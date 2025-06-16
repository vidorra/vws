import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData } from './base-scraper';

export class RealMothersEarthScraper extends BaseScraper {
  private readonly baseUrl = 'https://mothersearth.nl';

  async scrapePrice(url: string): Promise<PriceData> {
    console.log(`🔍 Scraping Mother's Earth price from: ${url}`);
    
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
      
      // Set realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Set viewport
      await page.setViewport({ width: 1280, height: 720 });
      
      // Navigate to product page
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 45000 // Increased timeout for production
      });
      
      // Wait for page to load
      await new Promise(resolve => setTimeout(resolve, 3000)); // Increased wait time
      
      // Extract price information
      const priceData = await page.evaluate(() => {
        // Try multiple selectors for price
        const priceSelectors = [
          '.price',
          '.product-price',
          '.price-amount',
          '[data-price]',
          '.money',
          '.current-price',
          '.sale-price',
          '[class*="price"]'
        ];
        
        let priceText = '';
        let priceElement = null;
        
        for (const selector of priceSelectors) {
          priceElement = document.querySelector(selector);
          if (priceElement && priceElement.textContent) {
            priceText = priceElement.textContent.trim();
            if (priceText.includes('€') || /\d/.test(priceText)) {
              break;
            }
          }
        }
        
        // If no specific price element found, search for price patterns in page
        if (!priceText) {
          const bodyText = document.body.textContent || '';
          const priceMatches = bodyText.match(/€\s*(\d+[,.]?\d*)/g);
          if (priceMatches && priceMatches.length > 0) {
            priceText = priceMatches[0];
          }
        }
        
        // Extract numeric price from text like "€14,95" or "14.95"
        const priceMatch = priceText.match(/(\d+[,.]?\d*)/);
        const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : 0;
        
        // Try to find pack size info
        const packSizeSelectors = [
          '.product-details',
          '.product-info',
          '.product-description',
          '[class*="specification"]',
          '[class*="detail"]'
        ];
        
        let packInfo = '';
        for (const selector of packSizeSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            const text = element.textContent.toLowerCase();
            if (text.includes('wasbeurt') || text.includes('strips') || text.includes('stuks')) {
              packInfo = text;
              break;
            }
          }
        }
        
        // Extract wash count (default to 60 if not found)
        const washMatch = packInfo.match(/(\d+)\s*(wasbeurt|strips|stuks)/i);
        const washCount = washMatch ? parseInt(washMatch[1]) : 60;
        
        return {
          price,
          washCount,
          priceText,
          packInfo,
          url: window.location.href
        };
      });
      
      if (priceData.price === 0) {
        throw new Error(`No price found on page. Price text found: "${priceData.priceText}"`);
      }
      
      const pricePerWash = priceData.washCount > 0 ? priceData.price / priceData.washCount : 0;
      
      console.log(`✅ Scraped Mother's Earth: €${priceData.price} for ${priceData.washCount} washes (€${pricePerWash.toFixed(3)} per wash)`);
      
      return {
        price: priceData.price,
        pricePerWash: pricePerWash,
        currency: 'EUR',
        scrapedAt: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error scraping Mother\'s Earth price:', error);
      throw new Error(`Failed to scrape Mother's Earth: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await browser.close();
    }
  }

  async scrapeStock(url: string): Promise<boolean> {
    console.log(`🔍 Checking Mother's Earth stock for: ${url}`);
    
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
        // Look for stock indicators
        const stockSelectors = [
          '.stock-status',
          '.availability',
          '.product-availability',
          '[data-stock]',
          '.inventory-status'
        ];
        
        const outOfStockTexts = [
          'uitverkocht',
          'out of stock',
          'niet beschikbaar',
          'niet op voorraad',
          'sold out',
          'niet leverbaar'
        ];
        
        const inStockTexts = [
          'op voorraad',
          'beschikbaar',
          'in stock',
          'leverbaar'
        ];
        
        // Check explicit stock indicators
        for (const selector of stockSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            const text = element.textContent.toLowerCase();
            
            // Check for explicit out of stock
            for (const outText of outOfStockTexts) {
              if (text.includes(outText)) {
                return false;
              }
            }
            
            // Check for explicit in stock
            for (const inText of inStockTexts) {
              if (text.includes(inText)) {
                return true;
              }
            }
          }
        }
        
        // Look for add to cart button
        const addToCartSelectors = [
          'button[type="submit"]',
          '.add-to-cart',
          '.buy-button',
          '.product-form button',
          '[data-testid*="add"]'
        ];
        
        for (const selector of addToCartSelectors) {
          const button = document.querySelector(selector);
          if (button && !button.hasAttribute('disabled')) {
            const buttonText = button.textContent?.toLowerCase() || '';
            if (buttonText.includes('toevoegen') || 
                buttonText.includes('bestellen') || 
                buttonText.includes('kopen') ||
                buttonText.includes('add')) {
              return true;
            }
          }
        }
        
        // Default to in stock if no clear indicators found
        return true;
      });
      
      console.log(`✅ Mother's Earth stock status: ${stockStatus ? 'In Stock' : 'Out of Stock'}`);
      return stockStatus;
      
    } catch (error) {
      console.error('❌ Error checking Mother\'s Earth stock:', error);
      return true; // Default to in stock on error
    } finally {
      await browser.close();
    }
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    // Reviews are complex and optional for now
    console.log(`ℹ️ Review scraping not implemented for Mother's Earth yet`);
    return [];
  }
}