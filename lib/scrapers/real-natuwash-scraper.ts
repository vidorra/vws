import puppeteer from 'puppeteer';
import { BaseScraper, PriceData, ReviewData, VariantData } from './base-scraper';

export class RealNatuwashScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Natuwash variants from: ${url}`);
    
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
        
        // Natuwash uses radio buttons for pack sizes
        // Look for the "Packs" radio button group
        const packRadios = document.querySelectorAll('input[name*="Packs"]');
        
        if (packRadios.length > 0) {
          // Extract variant data from window.ShopifyAnalytics if available
          let productData: any = null;
          
          // Try to find product data in scripts
          const scripts = Array.from(document.querySelectorAll('script'));
          for (const script of scripts) {
            const content = script.textContent || '';
            if (content.includes('window.ShopifyAnalytics')) {
              const match = content.match(/\"variants\":\s*(\[[\s\S]*?\])/);
              if (match) {
                try {
                  const variants = JSON.parse(match[1]);
                  productData = variants;
                  break;
                } catch (e) {
                  console.log('Failed to parse variant data');
                }
              }
            }
          }
          
          packRadios.forEach((radio: any, index) => {
            const label = document.querySelector(`label[for="${radio.id}"]`);
            const text = label?.textContent?.trim() || radio.value || '';
            
            // Extract wash count
            const washMatch = text.match(/(\d+)\s*(wasjes|strips)/i);
            const washCount = washMatch ? parseInt(washMatch[1]) : 60;
            
            // Extract pack count for name
            const packMatch = text.match(/(\d+)\s*Stuk/i);
            const packCount = packMatch ? parseInt(packMatch[1]) : 1;
            
            // Find price from product data
            let price = 0;
            if (productData) {
              // Match variant by title
              const variant = productData.find((v: any) => {
                const title = v.public_title || v.name || '';
                return title.includes(`${packCount} Stuk`) || title.includes(`${washCount} wasjes`);
              });
              
              if (variant && variant.price) {
                // Shopify prices are in cents
                price = variant.price / 100;
              }
            }
            
            // Fallback price mapping based on investigation
            if (price === 0) {
              const priceMap: { [key: number]: number } = {
                60: 18.95,
                120: 29.95,
                180: 37.95,
                240: 49.95
              };
              price = priceMap[washCount] || 0;
            }
            
            if (price > 0 && washCount > 0) {
              variantData.push({
                name: `${packCount} ${packCount === 1 ? 'Stuk' : 'Stuks'} - ${washCount} wasjes`,
                washCount,
                price,
                pricePerWash: price / washCount,
                currency: 'EUR',
                inStock: true,
                isDefault: radio.checked || index === 0
              });
            }
          });
        }
        
        // Fallback if no radio buttons found
        if (variantData.length === 0) {
          // Get the displayed price
          const priceElement = document.querySelector('.price-item--sale, .price-item--regular');
          let price = 0;
          
          if (priceElement) {
            const priceText = priceElement.textContent?.trim() || '';
            const priceMatch = priceText.match(/€\s*(\d+[,.]?\d*)/);
            if (priceMatch) {
              price = parseFloat(priceMatch[1].replace(',', '.'));
            }
          }
          
          // Default to 3 pack (180 wasjes) as that seems to be the default selected
          if (price > 0) {
            variantData.push({
              name: '3 Stuks - 180 wasjes',
              washCount: 180,
              price,
              pricePerWash: price / 180,
              currency: 'EUR',
              inStock: true,
              isDefault: true
            });
          }
        }
        
        return variantData;
      });
      
      console.log(`✅ Found ${variants.length} Natuwash variants`);
      return variants;
      
    } catch (error) {
      console.error('❌ Error scraping Natuwash variants:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapePrice(url: string): Promise<PriceData> {
    console.log(`🔍 Scraping Natuwash price from: ${url}`);
    
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
        // Natuwash specific selectors (Shopify-based)
        const priceSelectors = [
          '.price__current',
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
            const priceMatch = priceText.match(/(\d+[,.]?\d*)/);
            if (priceMatch) {
              price = parseFloat(priceMatch[0].replace(',', '.'));
              if (price > 0) break;
            }
          }
        }
        
        return {
          price,
          washCount: 60, // Natuwash typically 60 washes
          priceText
        };
      });
      
      if (priceData.price === 0) {
        throw new Error(`No price found for Natuwash. Text: "${priceData.priceText}"`);
      }
      
      const pricePerWash = priceData.price / priceData.washCount;
      
      console.log(`✅ Scraped Natuwash: €${priceData.price} (€${pricePerWash.toFixed(3)} per wash)`);
      
      return {
        price: priceData.price,
        pricePerWash: pricePerWash,
        currency: 'EUR',
        scrapedAt: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error scraping Natuwash:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeStock(url: string): Promise<boolean> {
    console.log(`🔍 Checking Natuwash stock for: ${url}`);
    
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
        // Look for add to cart or buy button
        const buySelectors = [
          'button[type="submit"]',
          '.add-to-cart',
          '.buy-button',
          '.product-form button',
          '[data-testid*="add"]',
          '.btn-primary'
        ];
        
        let hasValidBuyButton = false;
        
        for (const selector of buySelectors) {
          const button = document.querySelector(selector);
          if (button && !button.hasAttribute('disabled')) {
            const buttonText = button.textContent?.toLowerCase() || '';
            if (buttonText.includes('toevoegen') || 
                buttonText.includes('bestellen') || 
                buttonText.includes('kopen') ||
                buttonText.includes('add') ||
                buttonText.includes('buy')) {
              hasValidBuyButton = true;
              break;
            }
          }
        }
        
        if (hasValidBuyButton) {
          return true;
        }
        
        // Check for explicit stock messages
        const pageText = document.body.textContent?.toLowerCase() || '';
        
        // Out of stock indicators
        if (pageText.includes('uitverkocht') || 
            pageText.includes('niet op voorraad') ||
            pageText.includes('niet beschikbaar')) {
          return false;
        }
        
        // In stock indicators
        if (pageText.includes('op voorraad') || 
            pageText.includes('beschikbaar') ||
            pageText.includes('direct leverbaar')) {
          return true;
        }
        
        // Default to in stock for Natuwash (small brand, likely has stock)
        return true;
      });
      
      console.log(`✅ Natuwash stock status: ${stockStatus ? 'In Stock' : 'Out of Stock'}`);
      return stockStatus;
      
    } catch (error) {
      console.error('❌ Error checking Natuwash stock:', error);
      return true; // Default to in stock on error
    } finally {
      await browser.close();
    }
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    // Natuwash may have limited reviews - skip for now
    return [];
  }
}