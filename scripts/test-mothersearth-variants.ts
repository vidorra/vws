import puppeteer from 'puppeteer';

async function testMothersEarthVariants() {
  console.log('🧪 Testing Mother\'s Earth variant detection\n');
  
  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://nl.mothersearth.com/products/dishwasher-sheet?variant=50107168784722', {
      waitUntil: 'networkidle2',
      timeout: 45000
    });
    
    // Wait a bit for dynamic content
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check what variant elements exist
    const variantInfo = await page.evaluate(() => {
      const info: any = {
        selectors: {},
        foundElements: []
      };
      
      const selectors = [
        '.variant-selects input[type="radio"]',
        '.variant-radios input[type="radio"]',
        '.kaching-bundles__bars',
        '.product-variants .variant-option',
        '.product-options .option',
        '[data-variant]',
        'input[name="id"]',
        'select[name="id"] option',
        '.product-form__input input[type="radio"]',
        '.variant-picker',
        '.product__info .product-form__buttons',
        '[data-product-form] input[type="radio"]'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        info.selectors[selector] = elements.length;
        
        if (elements.length > 0) {
          elements.forEach((el: any) => {
            info.foundElements.push({
              selector,
              text: el.textContent?.trim() || el.value || 'No text',
              type: el.tagName,
              id: el.id,
              name: el.name,
              value: el.value
            });
          });
        }
      });
      
      // Also check page structure
      info.pageTitle = document.title;
      info.hasProductForm = !!document.querySelector('form[action*="cart"]');
      
      return info;
    });
    
    console.log('Page Title:', variantInfo.pageTitle);
    console.log('\nSelector Results:');
    Object.entries(variantInfo.selectors).forEach(([selector, count]) => {
      if ((count as number) > 0) {
        console.log(`✅ ${selector}: ${count} elements`);
      }
    });
    
    console.log('\nFound Elements:');
    variantInfo.foundElements.forEach((el: any) => {
      console.log(`\n- Selector: ${el.selector}`);
      console.log(`  Type: ${el.type}`);
      console.log(`  Text: ${el.text}`);
      console.log(`  ID: ${el.id}`);
      console.log(`  Name: ${el.name}`);
      console.log(`  Value: ${el.value}`);
    });
    
    // Keep browser open for 10 seconds to inspect
    console.log('\n⏳ Browser will close in 10 seconds...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testMothersEarthVariants().catch(console.error);