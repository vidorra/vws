import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData, VariantData } from './base-scraper';

/**
 * Scraper for Cosmeau wasstrips (laundry strips).
 * Reuses similar Shopify DOM extraction as the vaatwasstrips scraper
 * but targets the wasstrips product page.
 */
export class WasstripsCosmEauScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Cosmeau wasstrips variants from: ${url}`);

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

        const variantSelectors = [
          '.variant-selects input[type="radio"]',
          '.variant-radios input[type="radio"]',
          '.product-form__input select option',
          '.variant-selector option',
          '[name="id"] option',
          '.product-form__input input[type="radio"]',
        ];

        let variantElements: NodeListOf<Element> | null = null;
        for (const selector of variantSelectors) {
          variantElements = document.querySelectorAll(selector);
          if (variantElements.length > 1) break;
        }

        if (variantElements && variantElements.length > 1) {
          variantElements.forEach((option: any, index) => {
            if (option.value && option.value !== '') {
              const text = option.textContent?.trim() || '';
              const washMatch = text.match(/(\d+)\s*(stuks|wasbeurten|strips)/i);
              const priceMatch = text.match(/€\s*(\d+[,.]?\d*)/);

              const washCount = washMatch ? parseInt(washMatch[1]) : (index + 1) * 30;
              let price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;

              if (!price && option.dataset.price) {
                price = parseFloat(option.dataset.price);
              }
              if (!price) {
                const basePrice = 14.95;
                price = basePrice * (washCount / 60);
              }

              if (washCount > 0) {
                variantData.push({
                  name: text || `${washCount} wasbeurten`,
                  washCount,
                  price,
                  pricePerWash: price / washCount,
                  currency: 'EUR',
                  inStock: !option.disabled,
                  isDefault: index === 0,
                });
              }
            }
          });
        } else {
          const priceSelectors = ['.price--large', '.price', '.money'];
          let price = 0;
          for (const selector of priceSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent) {
              const priceMatch = element.textContent.trim().match(/(\d+[,.]?\d*)/);
              if (priceMatch) {
                price = parseFloat(priceMatch[0].replace(',', '.'));
                if (price > 0) break;
              }
            }
          }
          if (price > 0) {
            variantData.push({
              name: '60 wasbeurten',
              washCount: 60,
              price,
              pricePerWash: price / 60,
              currency: 'EUR',
              inStock: true,
              isDefault: true,
            });
          }
        }

        return variantData;
      });

      console.log(`✅ Found ${variants.length} Cosmeau wasstrips variants`);
      return variants;
    } catch (error) {
      console.error('❌ Error scraping Cosmeau wasstrips variants:', error);
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
