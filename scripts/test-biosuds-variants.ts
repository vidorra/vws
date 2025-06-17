import puppeteer from 'puppeteer';

async function investigateBioSuds() {
  console.log('🔍 Investigating Bio-Suds variant structure...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const url = 'https://www.bio-suds.com/products/bio-suds-milieuvriendelijke-vaatwasstrips';
    
    console.log(`📍 Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Run investigation script
    const debugInfo = await page.evaluate(() => {
      const info: any = {
        title: document.title,
        url: window.location.href,
        forms: [],
        selects: {},
        radios: {},
        buttons: [],
        prices: [],
        variantElements: [],
        shopifyData: null,
        bundleElements: []
      };
      
      // Check forms
      document.querySelectorAll('form[action*="/cart/add"]').forEach((form: any) => {
        info.forms.push({
          action: form.action,
          method: form.method,
          id: form.id,
          className: form.className
        });
      });
      
      // Check all selects
      document.querySelectorAll('select').forEach((select: any) => {
        const options = Array.from(select.options).map((opt: any) => ({
          text: opt.text,
          value: opt.value,
          selected: opt.selected
        }));
        info.selects[select.name || select.id || 'unnamed'] = options;
      });
      
      // Check radio buttons (especially for bundle/pack options)
      document.querySelectorAll('input[type="radio"]').forEach((radio: any) => {
        if (!info.radios[radio.name]) info.radios[radio.name] = [];
        const label = document.querySelector(`label[for="${radio.id}"]`);
        info.radios[radio.name].push({
          id: radio.id,
          value: radio.value,
          checked: radio.checked,
          label: label?.textContent?.trim() || 'No label',
          parentText: radio.parentElement?.textContent?.trim(),
          dataAttributes: Object.keys(radio.dataset).reduce((acc: any, key) => {
            acc[key] = radio.dataset[key];
            return acc;
          }, {})
        });
      });
      
      // Check for bundle/pack elements (similar to Mother's Earth)
      const bundleSelectors = [
        '[name*="bundle"]',
        '[name*="pack"]',
        '[name*="size"]',
        '.bundle-option',
        '.pack-option',
        '.variant-option',
        '[data-bundle]',
        '[data-pack]'
      ];
      
      bundleSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el: any) => {
          info.bundleElements.push({
            selector,
            tagName: el.tagName,
            type: el.type,
            name: el.name,
            text: el.textContent?.trim(),
            value: el.value,
            className: el.className,
            dataAttributes: Object.keys(el.dataset).reduce((acc: any, key) => {
              acc[key] = el.dataset[key];
              return acc;
            }, {})
          });
        });
      });
      
      // Check for variant buttons or divs
      const variantSelectors = [
        '[data-variant-id]',
        '.variant-button',
        '.product-variant',
        '.variant-selector',
        '[class*="variant"]',
        '.product-form__input',
        '.product-options .option',
        '.product-form__buttons'
      ];
      
      variantSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el: any) => {
          info.variantElements.push({
            selector,
            text: el.textContent?.trim(),
            className: el.className,
            innerHTML: el.innerHTML.substring(0, 200), // First 200 chars
            dataAttributes: Object.keys(el.dataset).reduce((acc: any, key) => {
              acc[key] = el.dataset[key];
              return acc;
            }, {})
          });
        });
      });
      
      // Check prices
      const priceSelectors = [
        '.price', 
        '.money', 
        '[data-price]', 
        '.price__current',
        '.price-item--regular',
        '.product-price'
      ];
      priceSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el: any) => {
          const text = el.textContent?.trim();
          if (text) {
            info.prices.push({
              selector,
              text,
              className: el.className,
              dataAttributes: Object.keys(el.dataset).reduce((acc: any, key) => {
                acc[key] = el.dataset[key];
                return acc;
              }, {})
            });
          }
        });
      });
      
      // Check for Shopify product data in scripts
      const scripts = Array.from(document.querySelectorAll('script'));
      scripts.forEach((script: any) => {
        if (script.textContent?.includes('product') && script.textContent?.includes('variants')) {
          const match = script.textContent.match(/product\s*[:=]\s*({[\s\S]*?});/);
          if (match) {
            try {
              info.shopifyData = JSON.parse(match[1]);
            } catch (e) {
              // Try alternative patterns
              const altMatch = script.textContent.match(/window\.product\s*=\s*({[\s\S]*?});/);
              if (altMatch) {
                try {
                  info.shopifyData = JSON.parse(altMatch[1]);
                } catch (e2) {
                  // Ignore
                }
              }
            }
          }
        }
      });
      
      return info;
    });
    
    // Print findings
    console.log('\n=== BIO-SUDS INVESTIGATION RESULTS ===\n');
    
    console.log('📄 Page Info:');
    console.log(`  Title: ${debugInfo.title}`);
    console.log(`  URL: ${debugInfo.url}`);
    
    console.log('\n📋 Forms:');
    console.log(JSON.stringify(debugInfo.forms, null, 2));
    
    console.log('\n🔽 Select Elements:');
    console.log(JSON.stringify(debugInfo.selects, null, 2));
    
    console.log('\n🔘 Radio Buttons:');
    console.log(JSON.stringify(debugInfo.radios, null, 2));
    
    console.log('\n📦 Bundle/Pack Elements:');
    console.log(JSON.stringify(debugInfo.bundleElements, null, 2));
    
    console.log('\n🎯 Variant Elements:');
    debugInfo.variantElements.forEach((el: any) => {
      console.log(`\nSelector: ${el.selector}`);
      console.log(`Text: ${el.text}`);
      console.log(`Class: ${el.className}`);
      if (Object.keys(el.dataAttributes).length > 0) {
        console.log(`Data: ${JSON.stringify(el.dataAttributes)}`);
      }
    });
    
    console.log('\n💰 Price Elements:');
    console.log(JSON.stringify(debugInfo.prices, null, 2));
    
    if (debugInfo.shopifyData) {
      console.log('\n📦 Shopify Product Data:');
      console.log(JSON.stringify(debugInfo.shopifyData, null, 2));
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'biosuds-variants-debug.png', fullPage: true });
    console.log('\n📸 Screenshot saved as biosuds-variants-debug.png');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

// Run the investigation
investigateBioSuds().catch(console.error);