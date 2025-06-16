import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData } from './base-scraper';

export class RealCosmEauScraper extends BaseScraper {
  async scrapePrice(url: string): Promise<PriceData> {
    console.log(`🔍 Scraping Cosmeau price from: ${url}`);
    
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
        // Cosmeau-specific selectors (from their actual website)
        const priceSelectors = [
          '.price--large',           // Main price selector on Cosmeau
          '.price',
          '.product-price',
          '.money',
          '[data-price]'
        ];
        
        let price = 0;
        let priceText = '';
        
        for (const selector of priceSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            priceText = element.textContent.trim();
            // Look for price patterns like €14,99 or 14.99
            const priceMatch = priceText.match(/(\d+[,.]?\d*)/);
            if (priceMatch) {
              price = parseFloat(priceMatch[0].replace(',', '.'));
              if (price > 0) break;
            }
          }
        }
        
        return {
          price,
          washCount: 60, // Cosmeau vaatwasstrips typically 60 washes
          priceText
        };
      });
      
      if (priceData.price === 0) {
        console.error(`❌ Cosmeau price extraction failed:`);
        console.error(`   URL: ${url}`);
        console.error(`   Price text found: "${priceData.priceText}"`);
        console.error(`   Page URL: ${await page.url()}`);
        throw new Error(`No price found for Cosmeau. Text: "${priceData.priceText}"`);
      }
      
      const pricePerWash = priceData.price / priceData.washCount;
      
      console.log(`✅ Scraped Cosmeau: €${priceData.price} (€${pricePerWash.toFixed(3)} per wash)`);
      
      return {
        price: priceData.price,
        pricePerWash: pricePerWash,
        currency: 'EUR',
        scrapedAt: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error scraping Cosmeau:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeStock(url: string): Promise<boolean> {
    // Similar implementation to Mother's Earth
    return true; // Simplified for now
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    return [];
  }
}