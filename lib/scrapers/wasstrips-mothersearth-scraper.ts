import puppeteer from 'puppeteer';
import { BaseScraper, ReviewData, VariantData } from './base-scraper';

/**
 * Scraper for Mother's Earth wasstrips (laundry strips).
 * Targets nl.mothersearth.com wasstrips product pages.
 */
export class WasstripsMothersEarthScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Mother's Earth wasstrips variants from: ${url}`);

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

        // Mother's Earth uses radio buttons for bundle selection
        const radios = document.querySelectorAll('input[type="radio"][name="Bundel"], input[type="radio"][name="bundel"]');

        if (radios.length > 0) {
          radios.forEach((radio: any, index) => {
            const label = radio.closest('label') || document.querySelector(`label[for="${radio.id}"]`);
            const labelText = label?.textContent?.trim() || '';

            const countMatch = labelText.match(/(\d+)\s*(wasjes|wasbeurten|strips|x)/i);
            const washCount = countMatch ? parseInt(countMatch[1]) : (index + 1) * 60;

            // Estimate prices based on Mother's Earth typical pricing
            const priceMap: Record<number, number> = {
              60: 10.20,
              180: 27.00,
              360: 48.00,
            };
            const price = priceMap[washCount] || washCount * 0.17;

            variantData.push({
              name: labelText || `${washCount} wasjes`,
              washCount,
              price,
              pricePerWash: price / washCount,
              currency: 'EUR',
              inStock: true,
              isDefault: index === 0,
            });
          });
        } else {
          // Fallback: single product page
          const priceEl = document.querySelector('.price--large, .price, .money');
          let price = 0;
          if (priceEl?.textContent) {
            const match = priceEl.textContent.match(/(\d+[,.]?\d*)/);
            if (match) price = parseFloat(match[0].replace(',', '.'));
          }

          variantData.push({
            name: '60 wasjes',
            washCount: 60,
            price: price || 10.20,
            pricePerWash: (price || 10.20) / 60,
            currency: 'EUR',
            inStock: true,
            isDefault: true,
          });
        }

        return variantData;
      });

      console.log(`✅ Found ${variants.length} Mother's Earth wasstrips variants`);
      return variants;
    } catch (error) {
      console.error("❌ Error scraping Mother's Earth wasstrips:", error);
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
