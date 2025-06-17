import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData, VariantData } from './base-scraper';

export class RealBioSudsScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Bio-Suds variants from: ${url}`);
    
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
        
        // Bio-Suds uses both select dropdown and clickable variant elements
        // First check for variant elements with data-variant-id
        const variantElements = document.querySelectorAll('[data-variant-id]');
        
        if (variantElements.length > 0) {
          // Filter out non-product variants (like pickup availability)
          const productVariants = Array.from(variantElements).filter((el: any) => {
            return el.classList.contains('selectable') || el.classList.contains('new-form-option');
          });
          
          productVariants.forEach((variant: any, index) => {
            const text = variant.textContent?.trim() || '';
            
            // Extract wash count
            const washMatch = text.match(/(\d+)\s*(vaatwasjes|proefwasjes)/i);
            const washCount = washMatch ? parseInt(washMatch[1]) : 60;
            
            // Extract price - Bio-Suds shows prices in .wb_hidden_price elements
            const priceElement = variant.querySelector('.wb_hidden_price, .first-price-WB');
            let price = 0;
            
            if (priceElement) {
              const priceText = priceElement.textContent?.trim() || '';
              const priceMatch = priceText.match(/€\s*(\d+[,.]?\d*)/);
              if (priceMatch) {
                price = parseFloat(priceMatch[1].replace(',', '.'));
              }
            }
            
            // If no price found in element, extract from text
            if (price === 0) {
              const priceMatch = text.match(/€\s*(\d+[,.]?\d*)/);
              if (priceMatch) {
                price = parseFloat(priceMatch[1].replace(',', '.'));
              }
            }
            
            // Check if selected
            const isSelected = variant.classList.contains('selectedWB');
            
            if (price > 0 && washCount > 0) {
              variantData.push({
                name: `${washCount} vaatwasjes`,
                washCount,
                price,
                pricePerWash: price / washCount,
                currency: 'EUR',
                inStock: true,
                isDefault: isSelected || index === 0
              });
            }
          });
        }
        
        // Fallback: check select dropdown
        if (variantData.length === 0) {
          const select = document.querySelector('select[name*="Pakket"], select[name*="options"]');
          if (select) {
            const options = Array.from((select as HTMLSelectElement).options);
            options.forEach((option, index) => {
              const text = option.text.trim();
              
              // Extract wash count
              const washMatch = text.match(/(\d+)\s*(vaatwasjes|proefwasjes)/i);
              const washCount = washMatch ? parseInt(washMatch[1]) : 60;
              
              // For select options, we need to find corresponding prices
              // This is a simplified approach - in production you might need to
              // select each option and wait for price update
              const priceMap: { [key: number]: number } = {
                10: 3.95,
                30: 19.95,
                60: 31.49,
                120: 39.95,
                240: 69.95,
                360: 79.95
              };
              
              const price = priceMap[washCount] || 0;
              
              if (price > 0) {
                variantData.push({
                  name: text,
                  washCount,
                  price,
                  pricePerWash: price / washCount,
                  currency: 'EUR',
                  inStock: true,
                  isDefault: option.selected || index === 0
                });
              }
            });
          }
        }
        
        // Final fallback
        if (variantData.length === 0) {
          // Get the main price
          const priceSelectors = ['.price__current', '.price', '.money'];
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
          
          if (price > 0) {
            variantData.push({
              name: '60 vaatwasjes',
              washCount: 60,
              price,
              pricePerWash: price / 60,
              currency: 'EUR',
              inStock: true,
              isDefault: true
            });
          }
        }
        
        return variantData;
      });
      
      console.log(`✅ Found ${variants.length} Bio-Suds variants`);
      return variants;
      
    } catch (error) {
      console.error('❌ Error scraping Bio-Suds variants:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapePrice(url: string): Promise<PriceData> {
    console.log(`🔍 Scraping Bio-Suds price from: ${url}`);
    
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
        // Bio-Suds specific selectors (Shopify-based)
        const priceSelectors = [
          '.price__current',
          '.price',
          '.product-price',
          '[data-price]',
          '.money',
          '.price-item--regular'
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
        
        // Bio-Suds typically shows price for pack of 60
        return {
          price,
          washCount: 60,
          priceText
        };
      });
      
      if (priceData.price === 0) {
        throw new Error(`No price found for Bio-Suds. Text: "${priceData.priceText}"`);
      }
      
      const pricePerWash = priceData.price / priceData.washCount;
      
      console.log(`✅ Scraped Bio-Suds: €${priceData.price} (€${pricePerWash.toFixed(3)} per wash)`);
      
      return {
        price: priceData.price,
        pricePerWash: pricePerWash,
        currency: 'EUR',
        scrapedAt: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error scraping Bio-Suds:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeStock(url: string): Promise<boolean> {
    console.log(`🔍 Checking Bio-Suds stock for: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const stockStatus = await page.evaluate(() => {
        // Check for Shopify add to cart button
        const addToCartButton = document.querySelector('button[name="add"], .btn-product-add, .product-form__cart-submit');
        
        if (addToCartButton) {
          const isDisabled = addToCartButton.hasAttribute('disabled');
          const buttonText = addToCartButton.textContent?.toLowerCase() || '';
          
          // If button is disabled or shows "sold out", it's out of stock
          if (isDisabled || buttonText.includes('sold out') || buttonText.includes('uitverkocht')) {
            return false;
          }
          
          // If button shows "add to cart" and not disabled, it's in stock
          if (buttonText.includes('add') || buttonText.includes('toevoegen')) {
            return true;
          }
        }
        
        // Check for explicit stock messages
        const stockTexts = document.body.textContent?.toLowerCase() || '';
        if (stockTexts.includes('in stock') || stockTexts.includes('op voorraad')) {
          return true;
        }
        if (stockTexts.includes('out of stock') || stockTexts.includes('uitverkocht')) {
          return false;
        }
        
        // Default to in stock
        return true;
      });
      
      console.log(`✅ Bio-Suds stock status: ${stockStatus ? 'In Stock' : 'Out of Stock'}`);
      return stockStatus;
      
    } catch (error) {
      console.error('❌ Error checking Bio-Suds stock:', error);
      return true; // Default to in stock on error
    } finally {
      await browser.close();
    }
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    return [];
  }
}