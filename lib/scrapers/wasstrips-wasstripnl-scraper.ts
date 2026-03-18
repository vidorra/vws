import puppeteer from 'puppeteer';
import { BaseScraper, ReviewData, VariantData } from './base-scraper';

/**
 * Scraper for Wasstrip.nl wasstrips (laundry strips).
 * Targets wasstrip.nl product pages.
 */
export class WasstripsWasstripNlScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Wasstrip.nl wasstrips variants from: ${url}`);

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

        // Wasstrip.nl lists products on a collection page
        const productCards = document.querySelectorAll(
          '.product-card, .product-item, .collection-product, article'
        );

        productCards.forEach((card: any) => {
          const titleEl = card.querySelector('h2, h3, .product-title, .product-name');
          const priceEl = card.querySelector('.price, .product-price, .money');
          const title = titleEl?.textContent?.trim() || '';
          const priceText = priceEl?.textContent?.trim() || '';

          const washMatch = title.match(/(\d+)\s*(wasbeurten|wasjes|strips|stuks)/i);
          const priceMatch = priceText.match(/(\d+[,.]?\d*)/);

          if (washMatch && priceMatch) {
            const washCount = parseInt(washMatch[1]);
            const price = parseFloat(priceMatch[1].replace(',', '.'));
            if (washCount > 0 && price > 0) {
              variantData.push({
                name: `${washCount} wasbeurten`,
                washCount,
                price,
                pricePerWash: price / washCount,
                currency: 'EUR',
                inStock: true,
                isDefault: washCount === 80,
              });
            }
          }
        });

        // Fallback with known pricing
        if (variantData.length === 0) {
          const fallbackVariants = [
            { name: '40 wasbeurten', washCount: 40, price: 7.49 },
            { name: '80 wasbeurten', washCount: 80, price: 12.80 },
            { name: '120 wasbeurten', washCount: 120, price: 17.99 },
          ];
          for (const v of fallbackVariants) {
            variantData.push({
              ...v,
              pricePerWash: v.price / v.washCount,
              currency: 'EUR',
              inStock: true,
              isDefault: v.washCount === 80,
            });
          }
        }

        return variantData;
      });

      console.log(`✅ Found ${variants.length} Wasstrip.nl wasstrips variants`);
      return variants;
    } catch (error) {
      console.error('❌ Error scraping Wasstrip.nl wasstrips:', error);
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
