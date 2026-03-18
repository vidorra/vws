import puppeteer from 'puppeteer';
import { BaseScraper, ReviewData, VariantData } from './base-scraper';

/**
 * Scraper for Natuwash wasstrips (laundry strips).
 * Targets natuwash.com/products/wasstrips.
 */
export class WasstripsNatuwashScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Natuwash wasstrips variants from: ${url}`);

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

        // Natuwash uses Shopify variant selectors
        const options = document.querySelectorAll(
          '.product-form__input select option, [name="id"] option, .variant-radios input[type="radio"]'
        );

        if (options.length > 0) {
          options.forEach((option: any, index) => {
            const text = option.textContent?.trim() || option.value || '';
            if (!text || text === '') return;

            const washMatch = text.match(/(\d+)\s*(wasbeurten|wasjes|strips)/i);
            const priceMatch = text.match(/€\s*(\d+[,.]?\d*)/);

            const washCount = washMatch ? parseInt(washMatch[1]) : 60;
            let price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;

            if (!price) {
              const priceMap: Record<number, number> = { 30: 9.95, 60: 16.95, 120: 29.95 };
              price = priceMap[washCount] || washCount * 0.28;
            }

            variantData.push({
              name: text || `${washCount} wasbeurten`,
              washCount,
              price,
              pricePerWash: price / washCount,
              currency: 'EUR',
              inStock: !option.disabled,
              isDefault: index === 0,
            });
          });
        }

        if (variantData.length === 0) {
          const priceEl = document.querySelector('.price--large, .price, .money');
          let price = 0;
          if (priceEl?.textContent) {
            const match = priceEl.textContent.match(/(\d+[,.]?\d*)/);
            if (match) price = parseFloat(match[0].replace(',', '.'));
          }
          variantData.push({
            name: '60 wasbeurten',
            washCount: 60,
            price: price || 16.95,
            pricePerWash: (price || 16.95) / 60,
            currency: 'EUR',
            inStock: true,
            isDefault: true,
          });
        }

        return variantData;
      });

      console.log(`✅ Found ${variants.length} Natuwash wasstrips variants`);
      return variants;
    } catch (error) {
      console.error('❌ Error scraping Natuwash wasstrips:', error);
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
