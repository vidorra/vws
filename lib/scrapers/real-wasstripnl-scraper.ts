import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData, VariantData } from './base-scraper';

export class RealWasstripNlScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Wasstrip.nl variants from: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const variants = await page.evaluate(() => {
        const variantData: any[] = [];
        
        // Get the main price
        const priceSelectors = [
          '.woocommerce-Price-amount',
          '.price',
          '.amount',
          '.product-price'
        ];
        
        let price = 0;
        for (const selector of priceSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            const priceText = element.textContent.trim();
            const priceMatch = priceText.match(/(\d+[,.]?\d*)/);
            if (priceMatch) {
              price = parseFloat(priceMatch[0].replace(',', '.'));
              if (price > 0) break;
            }
          }
        }
        
        // Wasstrip.nl typically offers 80 washes per pack
        const washCount = 80;
        
        if (price > 0) {
          variantData.push({
            name: `${washCount} wasbeurten`,
            washCount,
            price,
            pricePerWash: price / washCount,
            currency: 'EUR',
            inStock: true,
            isDefault: true
          });
        }
        
        return variantData;
      });
      
      console.log(`✅ Found ${variants.length} Wasstrip.nl variants`);
      return variants;
      
    } catch (error) {
      console.error('❌ Error scraping Wasstrip.nl variants:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapePrice(url: string): Promise<PriceData> {
    console.log(`🔍 Scraping Wasstrip.nl price from: ${url}`);
    
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
        // Wasstrip.nl specific selectors
        const priceSelectors = [
          '.woocommerce-Price-amount',
          '.price',
          '.amount',
          '.product-price',
          '[class*="price"]'
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
          washCount: 80, // Wasstrip.nl offers 80 washes
          priceText
        };
      });
      
      if (priceData.price === 0) {
        throw new Error(`No price found for Wasstrip.nl. Text: "${priceData.priceText}"`);
      }
      
      const pricePerWash = priceData.price / priceData.washCount;
      
      console.log(`✅ Scraped Wasstrip.nl: €${priceData.price} for ${priceData.washCount} washes (€${pricePerWash.toFixed(3)} per wash)`);
      
      return {
        price: priceData.price,
        pricePerWash: pricePerWash,
        currency: 'EUR',
        scrapedAt: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error scraping Wasstrip.nl:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeStock(url: string): Promise<boolean> {
    console.log(`🔍 Checking Wasstrip.nl stock for: ${url}`);
    
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
        // Look for add to cart button
        const buySelectors = [
          'button[type="submit"]',
          '.add-to-cart',
          '.buy-button',
          '.product-form button',
          '[data-testid*="add"]',
          '.btn-primary',
          '.btn-add-to-cart'
        ];
        
        let hasValidBuyButton = false;
        
        for (const selector of buySelectors) {
          const button = document.querySelector(selector);
          if (button && !button.hasAttribute('disabled')) {
            const buttonText = button.textContent?.toLowerCase() || '';
            if (buttonText.includes('toevoegen') || 
                buttonText.includes('bestellen') || 
                buttonText.includes('kopen') ||
                buttonText.includes('add') ||
                buttonText.includes('buy') ||
                buttonText.includes('winkelwagen')) {
              hasValidBuyButton = true;
              break;
            }
          }
        }
        
        if (hasValidBuyButton) {
          return true;
        }
        
        // Check for explicit stock messages
        const pageText = document.body.textContent?.toLowerCase() || '';
        
        // Out of stock indicators
        if (pageText.includes('uitverkocht') || 
            pageText.includes('niet op voorraad') ||
            pageText.includes('niet beschikbaar') ||
            pageText.includes('niet leverbaar')) {
          return false;
        }
        
        // In stock indicators
        if (pageText.includes('op voorraad') || 
            pageText.includes('beschikbaar') ||
            pageText.includes('direct leverbaar') ||
            pageText.includes('voorraad')) {
          return true;
        }
        
        // Default to in stock if unclear
        return true;
      });
      
      console.log(`✅ Wasstrip.nl stock status: ${stockStatus ? 'In Stock' : 'Out of Stock'}`);
      return stockStatus;
      
    } catch (error) {
      console.error('❌ Error checking Wasstrip.nl stock:', error);
      return true; // Default to in stock on error
    } finally {
      await browser.close();
    }
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    // Reviews implementation can be added later
    return [];
  }
}