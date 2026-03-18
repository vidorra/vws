import puppeteer from 'puppeteer';
import { BaseScraper, ReviewData, VariantData } from './base-scraper';

/**
 * Scraper for HappySoaps wasstrips (laundry sheets).
 * Targets nl.happysoaps.com Shopify-based product pages.
 */
export class WasstripsHappySoapsScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping HappySoaps wasstrips variants from: ${url}`);

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

        // HappySoaps uses Shopify variant system
        const variantSelectors = [
          '.product-form__input select option',
          '[name="id"] option',
          '.variant-radios input[type="radio"]',
          '.product-form__input input[type="radio"]',
        ];

        let variantElements: NodeListOf<Element> | null = null;
        for (const selector of variantSelectors) {
          variantElements = document.querySelectorAll(selector);
          if (variantElements.length > 0) break;
        }

        if (variantElements && variantElements.length > 0) {
          variantElements.forEach((option: any, index) => {
            const text = option.textContent?.trim() || '';
            if (!text) return;

            const washMatch = text.match(/(\d+)\s*(stuks|wasbeurten|strips)/i);
            const priceMatch = text.match(/€\s*(\d+[,.]?\d*)/);

            const washCount = washMatch ? parseInt(washMatch[1]) : 35;
            let price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;

            if (!price && option.dataset.price) {
              price = parseFloat(option.dataset.price);
            }
            if (!price) {
              price = 8.95; // HappySoaps standard price
            }

            variantData.push({
              name: text || `${washCount} stuks`,
              washCount,
              price,
              pricePerWash: price / washCount,
              currency: 'EUR',
              inStock: !option.disabled,
              isDefault: index === 0,
            });
          });
        }

        // Fallback: extract main price
        if (variantData.length === 0) {
          const priceEl = document.querySelector('.price--large, .price, .money, .product-price');
          let price = 0;
          if (priceEl?.textContent) {
            const match = priceEl.textContent.match(/(\d+[,.]?\d*)/);
            if (match) price = parseFloat(match[0].replace(',', '.'));
          }
          variantData.push({
            name: '35 stuks',
            washCount: 35,
            price: price || 8.95,
            pricePerWash: (price || 8.95) / 35,
            currency: 'EUR',
            inStock: true,
            isDefault: true,
          });
        }

        return variantData;
      });

      console.log(`✅ Found ${variants.length} HappySoaps wasstrips variants`);
      return variants;
    } catch (error) {
      console.error('❌ Error scraping HappySoaps wasstrips:', error);
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
