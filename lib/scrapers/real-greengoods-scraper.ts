import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData } from './base-scraper';

export class RealGreenGoodsScraper extends BaseScraper {
  async scrapePrice(url: string): Promise<PriceData> {
    console.log(`🔍 Scraping GreenGoods price from: ${url}`);
    
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
        // GreenGoods on Bol.com selectors
        const priceSelectors = [
          '[data-test="price-current"]',
          '.promo-price',
          '.price-block__highlight',
          '.js_price_current',
          '.price',
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
        
        // If no specific price found, try Bol.com specific patterns
        if (price === 0) {
          const bolPriceElements = document.querySelectorAll('[data-test*="price"], .js_price_current');
          Array.from(bolPriceElements).forEach(element => {
            if (price === 0 && element.textContent) {
              const match = element.textContent.match(/€\s*(\d+[,.]?\d*)/);
              if (match) {
                price = parseFloat(match[1].replace(',', '.'));
              }
            }
          });
        }
        
        // GreenGoods offers different pack sizes, try to detect
        let washCount = 120; // Default for large pack
        const productText = document.body.textContent?.toLowerCase() || '';
        
        if (productText.includes('5 strips') || productText.includes('10 washes')) {
          washCount = 10;
        } else if (productText.includes('60 strips') || productText.includes('120 washes')) {
          washCount = 120;
        }
        
        return {
          price,
          washCount,
          priceText,
          detectedPackSize: washCount
        };
      });
      
      if (priceData.price === 0) {
        throw new Error(`No price found for GreenGoods. Text: "${priceData.priceText}"`);
      }
      
      const pricePerWash = priceData.price / priceData.washCount;
      
      console.log(`✅ Scraped GreenGoods: €${priceData.price} for ${priceData.washCount} washes (€${pricePerWash.toFixed(3)} per wash)`);
      
      return {
        price: priceData.price,
        pricePerWash: pricePerWash,
        currency: 'EUR',
        scrapedAt: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error scraping GreenGoods:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeStock(url: string): Promise<boolean> {
    console.log(`🔍 Checking GreenGoods stock for: ${url}`);
    
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
        // Bol.com specific stock indicators
        const stockSelectors = [
          '[data-test="buy-block"]',
          '.buy-block',
          '.js_btn_buy',
          '.add-to-basket'
        ];
        
        // Check if buy button exists and is enabled
        for (const selector of stockSelectors) {
          const buyButton = document.querySelector(selector);
          if (buyButton) {
            const isDisabled = buyButton.hasAttribute('disabled') || 
                              buyButton.classList.contains('disabled');
            
            if (!isDisabled) {
              return true; // In stock
            }
          }
        }
        
        // Check for stock text indicators
        const pageText = document.body.textContent?.toLowerCase() || '';
        
        // Bol.com out of stock indicators
        const outOfStockTexts = [
          'niet op voorraad',
          'tijdelijk uitverkocht',
          'niet beschikbaar',
          'uitverkocht'
        ];
        
        for (const text of outOfStockTexts) {
          if (pageText.includes(text)) {
            return false;
          }
        }
        
        // Look for positive stock indicators
        if (pageText.includes('op voorraad') || 
            pageText.includes('beschikbaar') ||
            pageText.includes('direct leverbaar')) {
          return true;
        }
        
        // Default to in stock if unclear
        return true;
      });
      
      console.log(`✅ GreenGoods stock status: ${stockStatus ? 'In Stock' : 'Out of Stock'}`);
      return stockStatus;
      
    } catch (error) {
      console.error('❌ Error checking GreenGoods stock:', error);
      return true; // Default to in stock on error
    } finally {
      await browser.close();
    }
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    // Could scrape Bol.com reviews, but complex - skip for now
    return [];
  }
}