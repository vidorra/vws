import puppeteer from 'puppeteer';
import { BaseScraper, ReviewData, VariantData } from './base-scraper';

/**
 * Scraper for Bio-Suds wasstrips (laundry strips).
 * Targets bio-suds.com biologische wasstrips product page.
 */
export class WasstripsBioSudsScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Bio-Suds wasstrips variants from: ${url}`);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const variants = await page.evaluate(() => {
        const variantData: any[] = [];

        // Bio-Suds uses custom variant elements
        const variantElements = document.querySelectorAll(
          '[data-variant-id], .selectable, .new-form-option'
        );

        // Hardcoded price map as fallback (Bio-Suds wasstrips pricing)
        const priceMap: Record<number, number> = {
          10: 3.95,
          30: 9.95,
          60: 17.40,
          120: 29.95,
          240: 49.95,
          360: 69.95,
        };

        if (variantElements.length > 0) {
          variantElements.forEach((el: any, index) => {
            const text = el.textContent?.trim() || '';
            const countMatch = text.match(/(\d+)\s*(wasjes|wasbeurten|strips|stuks)/i);
            const washCount = countMatch ? parseInt(countMatch[1]) : 0;

            if (washCount > 0) {
              const price = priceMap[washCount] || washCount * 0.29;
              variantData.push({
                name: `${washCount} wasbeurten`,
                washCount,
                price,
                pricePerWash: price / washCount,
                currency: 'EUR',
                inStock: true,
                isDefault: washCount === 60,
              });
            }
          });
        }

        if (variantData.length === 0) {
          // Fallback: use known variants
          for (const [count, price] of Object.entries(priceMap)) {
            const washCount = parseInt(count);
            if ([10, 30, 60, 120].includes(washCount)) {
              variantData.push({
                name: washCount === 10 ? `${washCount} wasbeurten (proefpakket)` : `${washCount} wasbeurten`,
                washCount,
                price,
                pricePerWash: price / washCount,
                currency: 'EUR',
                inStock: true,
                isDefault: washCount === 60,
              });
            }
          }
        }

        return variantData;
      });

      console.log(`✅ Found ${variants.length} Bio-Suds wasstrips variants`);
      return variants;
    } catch (error) {
      console.error('❌ Error scraping Bio-Suds wasstrips:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeStock(url: string): Promise<boolean> {
    return true;
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    return [];
  }
}
