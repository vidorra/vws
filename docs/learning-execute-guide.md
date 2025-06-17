# Multi-Variant Scraping Implementation Guide for Shopify Sites

## Overview
This guide documents how to implement multi-variant scraping for Shopify-based dishwasher strip websites, specifically for Bubblyfy, Bio-Suds, and Natuwash. We'll use the lessons learned from implementing Mother's Earth and Cosmeau scrapers.

## Understanding Shopify Variant Patterns

### Common Shopify Variant Selectors
Shopify stores typically use one of these patterns for product variants:

1. **Select Dropdowns**: `<select>` elements with options
2. **Radio Buttons**: `<input type="radio">` grouped by name
3. **Button Groups**: `<div>` or `<button>` elements with variant data
4. **Custom Elements**: Store-specific implementations

### Key Identifiers
- Form selector: `form[action*="/cart/add"]`
- Variant containers: `.product-form__input`, `.variant-selects`, `.variant-radios`
- Price elements: `.price`, `.money`, `[data-price]`
- Stock indicators: `.availability`, `.stock-status`

## Step-by-Step Implementation Process

### Step 1: Analyze the Product Page
First, visit the product page and inspect the variant selector:

```javascript
// Use browser console to explore:
document.querySelectorAll('select[name*="variant"]')
document.querySelectorAll('input[type="radio"]')
document.querySelectorAll('.product-form__input')
```

### Step 2: Identify Variant Structure
Look for:
- How variants are presented (dropdown, radio, buttons)
- The naming convention (e.g., "Size", "Pack", "Bundel")
- Price display method (dynamic or static)
- Stock status indicators

### Step 3: Implement Scraper Logic

#### Example Template for Shopify Scrapers:

```typescript
async scrapeVariants(url: string): Promise<VariantData[]> {
  console.log(`🔍 Scraping ${this.brandName} variants from: ${url}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    // Wait for dynamic content
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Debug: Check what's on the page
    const debugInfo = await page.evaluate(() => {
      return {
        hasForm: !!document.querySelector('form[action*="/cart/add"]'),
        selectCount: document.querySelectorAll('select').length,
        radioGroups: Array.from(new Set(
          Array.from(document.querySelectorAll('input[type="radio"]'))
            .map((r: any) => r.name)
        )),
        buttonVariants: document.querySelectorAll('[data-variant-id]').length
      };
    });
    
    console.log('Debug info:', JSON.stringify(debugInfo, null, 2));
    
    const variants = await page.evaluate(() => {
      const variantData: any[] = [];
      
      // Method 1: Check for select dropdowns
      const selects = document.querySelectorAll('select[name*="variant"], select[name*="Size"], select[name*="Pack"]');
      if (selects.length > 0) {
        const select = selects[0] as HTMLSelectElement;
        Array.from(select.options).forEach((option, index) => {
          if (option.value && option.text !== 'Choose an option') {
            // Extract variant info from option text
            const text = option.text.trim();
            const priceMatch = text.match(/[€$]\s*(\d+[,.]?\d*)/);
            const washMatch = text.match(/(\d+)\s*(wash|strips|stuks)/i);
            
            variantData.push({
              name: text,
              washCount: washMatch ? parseInt(washMatch[1]) : 60,
              price: priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0,
              pricePerWash: 0, // Calculate after
              currency: 'EUR',
              inStock: true,
              isDefault: index === 0
            });
          }
        });
      }
      
      // Method 2: Check for radio buttons
      if (variantData.length === 0) {
        const radioGroups = new Map();
        document.querySelectorAll('input[type="radio"]').forEach((radio: any) => {
          if (!radioGroups.has(radio.name)) {
            radioGroups.set(radio.name, []);
          }
          radioGroups.get(radio.name).push(radio);
        });
        
        // Find the group that looks like size/pack variants
        for (const [name, radios] of radioGroups) {
          if (name.match(/size|pack|variant|bundel/i) && radios.length > 1) {
            radios.forEach((radio: any, index: number) => {
              const label = document.querySelector(`label[for="${radio.id}"]`);
              const text = label?.textContent?.trim() || radio.value || '';
              
              // Extract variant details
              const washMatch = text.match(/(\d+)\s*(wash|strips|stuks)/i);
              const priceMatch = text.match(/[€$]\s*(\d+[,.]?\d*)/);
              
              variantData.push({
                name: text,
                washCount: washMatch ? parseInt(washMatch[1]) : 60,
                price: priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0,
                pricePerWash: 0,
                currency: 'EUR',
                inStock: true,
                isDefault: radio.checked || index === 0
              });
            });
            break;
          }
        }
      }
      
      // Method 3: Check for button variants
      if (variantData.length === 0) {
        const variantButtons = document.querySelectorAll('[data-variant-id], .variant-button, .product-variant');
        variantButtons.forEach((button: any, index) => {
          const text = button.textContent?.trim() || '';
          const price = button.getAttribute('data-price') || 
                       button.querySelector('.price')?.textContent || '';
          
          const washMatch = text.match(/(\d+)\s*(wash|strips|stuks)/i);
          const priceMatch = price.match(/(\d+[,.]?\d*)/);
          
          if (text) {
            variantData.push({
              name: text,
              washCount: washMatch ? parseInt(washMatch[1]) : 60,
              price: priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0,
              pricePerWash: 0,
              currency: 'EUR',
              inStock: !button.classList.contains('disabled'),
              isDefault: button.classList.contains('selected') || index === 0
            });
          }
        });
      }
      
      // Calculate price per wash
      variantData.forEach(v => {
        v.pricePerWash = v.washCount > 0 ? v.price / v.washCount : 0;
      });
      
      return variantData;
    });
    
    // If no variants found, create default
    if (variants.length === 0) {
      console.log('⚠️ No variants found, creating default variant');
      // Implement fallback logic here
    }
    
    console.log(`✅ Found ${variants.length} ${this.brandName} variants`);
    return variants;
    
  } catch (error) {
    console.error(`❌ Error scraping ${this.brandName} variants:`, error);
    throw error;
  } finally {
    await browser.close();
  }
}
```

## Specific Implementation Notes

### Bubblyfy (bubblyfy.nl)
- **Current Status**: Only finding 1 variant (default)
- **Investigation Needed**:
  1. Check if they use a select dropdown for pack sizes
  2. Look for hidden variant data in JavaScript
  3. Check for AJAX-loaded content
  4. Inspect product JSON-LD data

### Bio-Suds (bio-suds.com)
- **Current Status**: Only finding 1 variant (default)
- **Investigation Needed**:
  1. Similar Shopify structure to Mother's Earth
  2. Check for radio buttons or select elements
  3. Look for subscription vs one-time options
  4. Check variant pricing structure

### Natuwash (natuwash.com)
- **Current Status**: Only finding 1 variant (default)
- **Investigation Needed**:
  1. Examine product form structure
  2. Check for variant selectors
  3. Look for pack size options
  4. Verify if they actually have multiple variants

## Debugging Techniques

### 1. Browser Console Investigation
```javascript
// Find all forms
document.querySelectorAll('form[action*="/cart/add"]')

// Find all selects
document.querySelectorAll('select').forEach(s => {
  console.log('Select:', s.name, 'Options:', s.options.length);
});

// Find all radio groups
const radioGroups = {};
document.querySelectorAll('input[type="radio"]').forEach(r => {
  radioGroups[r.name] = (radioGroups[r.name] || 0) + 1;
});
console.log('Radio groups:', radioGroups);

// Find variant containers
document.querySelectorAll('[class*="variant"], [data-variant]')
```

### 2. Puppeteer Debug Output
Add comprehensive debugging to understand page structure:

```typescript
const debugInfo = await page.evaluate(() => {
  const info: any = {
    title: document.title,
    forms: document.querySelectorAll('form').length,
    selects: {},
    radios: {},
    buttons: [],
    prices: []
  };
  
  // Analyze selects
  document.querySelectorAll('select').forEach((s: any) => {
    info.selects[s.name || 'unnamed'] = Array.from(s.options).map((o: any) => o.text);
  });
  
  // Analyze radios
  document.querySelectorAll('input[type="radio"]').forEach((r: any) => {
    if (!info.radios[r.name]) info.radios[r.name] = [];
    info.radios[r.name].push({
      value: r.value,
      id: r.id,
      checked: r.checked,
      label: document.querySelector(`label[for="${r.id}"]`)?.textContent?.trim()
    });
  });
  
  // Find price elements
  document.querySelectorAll('.price, .money, [data-price]').forEach((p: any) => {
    info.prices.push(p.textContent?.trim());
  });
  
  return info;
});

console.log('Page debug info:', JSON.stringify(debugInfo, null, 2));
```

### 3. Wait Strategies
Some sites load variants dynamically:

```typescript
// Wait for specific elements
try {
  await page.waitForSelector('.variant-selects', { timeout: 5000 });
} catch (e) {
  console.log('No variant selects found');
}

// Wait for network idle
await page.goto(url, { waitUntil: 'networkidle0' });

// Custom wait function
await page.waitForFunction(() => {
  return document.querySelectorAll('select option').length > 1 ||
         document.querySelectorAll('input[type="radio"]').length > 1;
}, { timeout: 5000 });
```

## Common Issues and Solutions

### Issue 1: Dynamic Price Loading
**Problem**: Prices update via JavaScript when variant is selected
**Solution**: Click/select each variant and capture the updated price

### Issue 2: Hidden Variant Data
**Problem**: Variants stored in JavaScript variables
**Solution**: Extract from page scripts or window object

### Issue 3: AJAX-Loaded Variants
**Problem**: Variants loaded after page load
**Solution**: Wait for network requests or specific elements

### Issue 4: Subscription vs One-Time
**Problem**: Different pricing for subscription
**Solution**: Focus on one-time purchase prices for consistency

## Testing Checklist

1. **Manual Verification**:
   - [ ] Visit product page
   - [ ] Count actual variants available
   - [ ] Note variant names and prices
   - [ ] Check for dynamic loading

2. **Scraper Testing**:
   - [ ] Run scraper with debug output
   - [ ] Verify variant count matches
   - [ ] Check price accuracy
   - [ ] Validate wash counts

3. **Edge Cases**:
   - [ ] Out of stock variants
   - [ ] Sale prices
   - [ ] Bundle discounts
   - [ ] Currency formatting

## Next Steps

1. **Investigate Each Site**:
   - Use browser developer tools
   - Document variant structure
   - Note any unique patterns

2. **Implement Scrapers**:
   - Start with the template above
   - Customize for each site's structure
   - Add appropriate error handling

3. **Test Thoroughly**:
   - Run multiple times
   - Check different products
   - Verify data accuracy

4. **Monitor Changes**:
   - Sites may update their structure
   - Keep debug logs
   - Plan for maintenance

## Example Implementation Order

1. **Bubblyfy**: Likely uses standard Shopify patterns
2. **Bio-Suds**: Similar to Mother's Earth structure
3. **Natuwash**: May have unique implementation

## Resources

- [Shopify Variant Documentation](https://shopify.dev/docs/themes/architecture/templates/product#variant-selection)
- [Puppeteer Best Practices](https://pptr.dev/guides/best-practices)
- [Web Scraping Ethics](https://blog.apify.com/web-scraping-guide/)