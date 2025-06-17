import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData, VariantData } from './base-scraper';

export class RealCosmEauScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Cosmeau variants from: ${url}`);
    
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
        
        // Cosmeau-specific variant selectors (Shopify-based)
        const variantSelectors = [
          '.variant-selects input[type="radio"]',
          '.variant-radios input[type="radio"]',
          '.kaching-bundles__bars',
          '.product-form__input select option',
          '.variant-selector option',
          '.size-options .size-option',
          '[name="id"] option',
          '.product-form__input input[type="radio"]'
        ];
        
        // Check for dropdown variants
        let variantElements: NodeListOf<Element> | null = null;
        for (const selector of variantSelectors) {
          variantElements = document.querySelectorAll(selector);
          if (variantElements.length > 1) { // More than just default option
            break;
          }
        }
        
        if (variantElements && variantElements.length > 1) {
          // Multiple variants in dropdown
          variantElements.forEach((option: any, index) => {
            if (option.value && option.value !== '') {
              const text = option.textContent?.trim() || '';
              
              // Extract info from option text like "60 stuks - €12,99" or "120 wasbeurten"
              const washMatch = text.match(/(\d+)\s*(stuks|wasbeurten|strips)/i);
              const priceMatch = text.match(/€\s*(\d+[,.]?\d*)/);
              
              const washCount = washMatch ? parseInt(washMatch[1]) : (index + 1) * 30;
              let price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
              
              // If no price in option text, try to get it from data attributes
              if (!price && option.dataset.price) {
                price = parseFloat(option.dataset.price);
              }
              
              // Estimate price if not found (based on base price)
              if (!price) {
                const basePrice = 12.99; // Fallback
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
                  isDefault: index === 0
                });
              }
            }
          });
        } else {
          // Single variant from main page
          const priceSelectors = ['.price--large', '.price', '.money'];
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
          
          const washCount = 60; // Cosmeau default
          
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
        }
        
        return variantData;
      });
      
      console.log(`✅ Found ${variants.length} Cosmeau variants`);
      return variants;
      
    } catch (error) {
      console.error('❌ Error scraping Cosmeau variants:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapePrice(url: string): Promise<PriceData> {
    console.log(`🔍 Scraping Cosmeau price from: ${url}`);
    
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