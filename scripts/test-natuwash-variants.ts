import puppeteer from 'puppeteer';

async function investigateNatuwash() {
  console.log('🔍 Investigating Natuwash variant structure...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const url = 'https://natuwash.com/products/vaatwasstrips';
    
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
        variantSelects: []
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
        info.selects[select.name || select.id || 'unnamed'] = {
          options,
          className: select.className,
          parentClassName: select.parentElement?.className
        };
      });
      
      // Check radio buttons
      document.querySelectorAll('input[type="radio"]').forEach((radio: any) => {
        if (!info.radios[radio.name]) info.radios[radio.name] = [];
        const label = document.querySelector(`label[for="${radio.id}"]`);
        info.radios[radio.name].push({
          id: radio.id,
          value: radio.value,
          checked: radio.checked,
          label: label?.textContent?.trim() || 'No label',
          parentText: radio.parentElement?.textContent?.trim(),
          className: radio.className,
          parentClassName: radio.parentElement?.className,
          dataAttributes: Object.keys(radio.dataset).reduce((acc: any, key) => {
            acc[key] = radio.dataset[key];
            return acc;
          }, {})
        });
      });
      
      // Check specifically for .variant-selects (mentioned in their scraper)
      document.querySelectorAll('.variant-selects').forEach((el: any) => {
        info.variantSelects.push({
          className: el.className,
          innerHTML: el.innerHTML.substring(0, 500),
          childCount: el.children.length,
          textContent: el.textContent?.trim()
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
        '.product-options',
        '.option',
        '.variant-radios',
        '.variant-selects'
      ];
      
      variantSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach((el: any) => {
            info.variantElements.push({
              selector,
              text: el.textContent?.trim().substring(0, 100),
              className: el.className,
              tagName: el.tagName,
              childrenCount: el.children.length,
              hasRadios: el.querySelectorAll('input[type="radio"]').length,
              hasSelects: el.querySelectorAll('select').length,
              dataAttributes: Object.keys(el.dataset).reduce((acc: any, key) => {
                acc[key] = el.dataset[key];
                return acc;
              }, {})
            });
          });
        }
      });
      
      // Check prices
      const priceSelectors = [
        '.price', 
        '.money', 
        '[data-price]', 
        '.price__current',
        '.product-price',
        '.price-item'
      ];
      priceSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el: any) => {
          const text = el.textContent?.trim();
          if (text) {
            info.prices.push({
              selector,
              text,
              className: el.className,
              parentClassName: el.parentElement?.className,
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
        const content = script.textContent || '';
        if (content.includes('product') && content.includes('variants')) {
          // Try multiple patterns
          const patterns = [
            /product\s*[:=]\s*({[\s\S]*?});/,
            /window\.product\s*=\s*({[\s\S]*?});/,
            /Product\s*=\s*({[\s\S]*?});/
          ];
          
          for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
              try {
                const parsed = JSON.parse(match[1]);
                if (parsed.variants || parsed.options) {
                  info.shopifyData = parsed;
                  break;
                }
              } catch (e) {
                // Continue trying other patterns
              }
            }
          }
        }
      });
      
      // Check for any elements with wash/strip counts
      const washElements = Array.from(document.querySelectorAll('*')).filter((el: any) => {
        const text = el.textContent || '';
        return text.match(/\d+\s*(wash|strip|wasbeurt|wasjes|stuks)/i) && 
               !text.includes('script') && 
               el.children.length < 3;
      });
      
      info.washElements = washElements.slice(0, 10).map((el: any) => ({
        text: el.textContent?.trim(),
        tagName: el.tagName,
        className: el.className
      }));
      
      return info;
    });
    
    // Print findings
    console.log('\n=== NATUWASH INVESTIGATION RESULTS ===\n');
    
    console.log('📄 Page Info:');
    console.log(`  Title: ${debugInfo.title}`);
    console.log(`  URL: ${debugInfo.url}`);
    
    console.log('\n📋 Forms:');
    console.log(JSON.stringify(debugInfo.forms, null, 2));
    
    console.log('\n🔽 Select Elements:');
    console.log(JSON.stringify(debugInfo.selects, null, 2));
    
    console.log('\n🔘 Radio Buttons:');
    console.log(JSON.stringify(debugInfo.radios, null, 2));
    
    console.log('\n🎯 .variant-selects Elements:');
    console.log(JSON.stringify(debugInfo.variantSelects, null, 2));
    
    console.log('\n🎯 Variant Elements Summary:');
    const variantSummary: any = {};
    debugInfo.variantElements.forEach((el: any) => {
      if (!variantSummary[el.selector]) {
        variantSummary[el.selector] = [];
      }
      variantSummary[el.selector].push({
        text: el.text,
        className: el.className,
        hasRadios: el.hasRadios,
        hasSelects: el.hasSelects
      });
    });
    console.log(JSON.stringify(variantSummary, null, 2));
    
    console.log('\n💰 Price Elements:');
    console.log(JSON.stringify(debugInfo.prices, null, 2));
    
    console.log('\n🧼 Elements with wash/strip counts:');
    console.log(JSON.stringify(debugInfo.washElements, null, 2));
    
    if (debugInfo.shopifyData) {
      console.log('\n📦 Shopify Product Data:');
      console.log(JSON.stringify(debugInfo.shopifyData, null, 2));
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'natuwash-variants-debug.png', fullPage: true });
    console.log('\n📸 Screenshot saved as natuwash-variants-debug.png');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

// Run the investigation
investigateNatuwash().catch(console.error);