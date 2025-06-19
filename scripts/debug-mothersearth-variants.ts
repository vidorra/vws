import puppeteer from 'puppeteer';

async function debugMothersEarthVariants() {
  const url = 'https://nl.mothersearth.com/products/dishwasher-sheet?variant=50107168784722';
  console.log(`🔍 Debugging Mother's Earth variants from: ${url}`);
  
  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Debug what's in the labels
    const labelTexts = await page.evaluate(() => {
      const results: any[] = [];
      
      // Find all bundle radio inputs
      const bundleRadios = document.querySelectorAll('input[name="Bundel"]');
      
      bundleRadios.forEach((radio: any) => {
        const label = document.querySelector(`label[for="${radio.id}"]`);
        if (label) {
          results.push({
            radioId: radio.id,
            radioValue: radio.value,
            labelText: label.textContent,
            labelInnerHTML: label.innerHTML,
            labelTextTrimmed: label.textContent?.trim(),
            // Try to get just the visible text
            visibleText: (label as HTMLElement).innerText || label.textContent
          });
        }
      });
      
      return results;
    });
    
    console.log('Label debug info:');
    console.log(JSON.stringify(labelTexts, null, 2));
    
    // Also check what the page structure looks like
    const pageStructure = await page.evaluate(() => {
      const form = document.querySelector('form[action*="/cart/add"]');
      if (!form) return 'No form found';
      
      // Find the bundle fieldset or container
      const bundleContainer = form.querySelector('[data-option-name="Bundel"], fieldset:has(input[name="Bundel"])');
      return bundleContainer ? bundleContainer.outerHTML : 'No bundle container found';
    });
    
    console.log('\nBundle container HTML:');
    console.log(pageStructure);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugMothersEarthVariants();