import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData } from './base-scraper';

export class RealNatuwashScraper extends BaseScraper {
  async scrapePrice(url: string): Promise<PriceData> {
    console.log(`🔍 Scraping Natuwash price from: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const priceData = await page.evaluate(() => {
        // Natuwash website selectors (update based on actual site structure)
        const priceSelectors = [
          '.price',
          '.product-price',
          '.price-current',
          '[data-price]',
          '.money',
          '.price-amount',
          '.current-price',
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
        
        // If no specific selector works, search for price patterns
        if (price === 0) {
          const bodyText = document.body.textContent || '';
          const priceMatches = bodyText.match(/€\s*(\d+[,.]?\d+)/g);
          if (priceMatches && priceMatches.length > 0) {
            const firstPrice = priceMatches[0].match(/(\d+[,.]?\d+)/);
            if (firstPrice) {
              price = parseFloat(firstPrice[1].replace(',', '.'));
            }
          }
        }
        
        // Natuwash typically has 60 strips per pack
        const washCount = 60;
        
        return {
          price,
          washCount,
          priceText
        };
      });
      
      if (priceData.price === 0) {
        throw new Error(`No price found for Natuwash. Text: "${priceData.priceText}"`);
      }
      
      const pricePerWash = priceData.price / priceData.washCount;
      
      console.log(`✅ Scraped Natuwash: €${priceData.price} (€${pricePerWash.toFixed(3)} per wash)`);
      
      return {
        price: priceData.price,
        pricePerWash: pricePerWash,
        currency: 'EUR',
        scrapedAt: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error scraping Natuwash:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeStock(url: string): Promise<boolean> {
    console.log(`🔍 Checking Natuwash stock for: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const stockStatus = await page.evaluate(() => {
        // Look for add to cart or buy button
        const buySelectors = [
          'button[type="submit"]',
          '.add-to-cart',
          '.buy-button',
          '.product-form button',
          '[data-testid*="add"]',
          '.btn-primary'
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
                buttonText.includes('buy')) {
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
            pageText.includes('niet beschikbaar')) {
          return false;
        }
        
        // In stock indicators
        if (pageText.includes('op voorraad') || 
            pageText.includes('beschikbaar') ||
            pageText.includes('direct leverbaar')) {
          return true;
        }
        
        // Default to in stock for Natuwash (small brand, likely has stock)
        return true;
      });
      
      console.log(`✅ Natuwash stock status: ${stockStatus ? 'In Stock' : 'Out of Stock'}`);
      return stockStatus;
      
    } catch (error) {
      console.error('❌ Error checking Natuwash stock:', error);
      return true; // Default to in stock on error
    } finally {
      await browser.close();
    }
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    // Natuwash may have limited reviews - skip for now
    return [];
  }
}