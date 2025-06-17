# Action Plan: Implementing Multi-Variant Scraping for Shopify Sites

## Current Status Analysis

### 1. Bubblyfy (bubblyfy.nl)
**Current Implementation**: Basic fallback logic
- Currently only finding 1 variant (default)
- Has some variant selector checks but they're not finding elements
- Falls back to creating a single 64-wash variant
- Estimates a 128-wash variant at 1.75x price (not based on actual data)

**Action Required**:
1. Visit https://www.bubblyfy.nl/products/vaatwasstrips
2. Inspect the page for actual variant selectors
3. Update scraper to match their specific implementation

### 2. Bio-Suds (bio-suds.com)
**Current Implementation**: Minimal, single variant only
- Only creates one 60-wash variant
- No actual variant detection logic
- Just extracts the main price

**Action Required**:
1. Visit https://www.bio-suds.com/products/bio-suds-milieuvriendelijke-vaatwasstrips
2. Check if they actually have multiple pack sizes
3. Implement proper variant detection

### 3. Natuwash (natuwash.com)
**Current Implementation**: Has variant detection logic
- Checks for radio buttons and select options
- Has proper extraction logic for wash counts
- But still only finding 1 variant in tests

**Action Required**:
1. Visit https://natuwash.com/products/vaatwasstrips
2. Debug why variant selectors aren't matching
3. Update selectors to match their implementation

## Implementation Steps

### Step 1: Manual Investigation (Browser)

For each site, open the browser console and run:

```javascript
// Debug script to understand variant structure
(() => {
  console.log('=== VARIANT INVESTIGATION ===');
  
  // Check forms
  const forms = document.querySelectorAll('form[action*="/cart/add"]');
  console.log(`Forms found: ${forms.length}`);
  
  // Check selects
  const selects = document.querySelectorAll('select');
  console.log(`\nSelects found: ${selects.length}`);
  selects.forEach(s => {
    console.log(`- Name: "${s.name}", Options: ${s.options.length}`);
    if (s.options.length > 0) {
      Array.from(s.options).forEach(o => console.log(`  - ${o.text}`));
    }
  });
  
  // Check radio buttons
  const radios = document.querySelectorAll('input[type="radio"]');
  const radioGroups = {};
  radios.forEach(r => {
    if (!radioGroups[r.name]) radioGroups[r.name] = [];
    radioGroups[r.name].push({
      value: r.value,
      label: document.querySelector(`label[for="${r.id}"]`)?.textContent?.trim()
    });
  });
  console.log(`\nRadio groups found: ${Object.keys(radioGroups).length}`);
  Object.entries(radioGroups).forEach(([name, options]) => {
    console.log(`- Group "${name}": ${options.length} options`);
    options.forEach(o => console.log(`  - ${o.label || o.value}`));
  });
  
  // Check for Shopify-specific elements
  const shopifyVariants = document.querySelectorAll('[data-variant-id], .product-variant, .variant-button');
  console.log(`\nShopify variant elements: ${shopifyVariants.length}`);
  
  // Check for price elements
  const prices = document.querySelectorAll('.price, .money, [data-price]');
  console.log(`\nPrice elements found: ${prices.length}`);
  prices.forEach(p => console.log(`- ${p.textContent?.trim()}`));
})();
```

### Step 2: Update Scrapers Based on Findings

#### For Bubblyfy:
```typescript
// Add debug logging first
const debugInfo = await page.evaluate(() => {
  return {
    title: document.title,
    hasForm: !!document.querySelector('form[action*="/cart/add"]'),
    selectCount: document.querySelectorAll('select').length,
    radioCount: document.querySelectorAll('input[type="radio"]').length,
    // Add more debug info
  };
});
console.log('Bubblyfy debug:', JSON.stringify(debugInfo, null, 2));
```

#### For Bio-Suds:
```typescript
// Check if they use a similar pattern to Mother's Earth
const variants = await page.evaluate(() => {
  // Look for bundle options like Mother's Earth
  const bundleRadios = document.querySelectorAll('input[name*="bundle"], input[name*="pack"], input[name*="size"]');
  // ... implement variant extraction
});
```

#### For Natuwash:
```typescript
// Their implementation already has logic, just needs debugging
// Add wait for specific elements
try {
  await page.waitForSelector('.variant-selects', { timeout: 5000 });
} catch (e) {
  console.log('No .variant-selects found, trying other selectors');
}
```

### Step 3: Common Patterns to Check

1. **Subscription vs One-Time Purchase**:
   - Some sites show different options for subscription
   - Focus on one-time purchase for consistency

2. **Dynamic Loading**:
   - Variants might load after page load
   - Add longer waits or wait for specific elements

3. **Hidden Variant Data**:
   - Check `<script type="application/json">` tags
   - Look for `window.productVariants` or similar

4. **Bundle Discounts**:
   - Sites might show percentage discounts
   - Calculate actual prices from base price

### Step 4: Testing Protocol

1. **Create a test script** for each site:
```bash
# Test individual scrapers
npx tsx scripts/test-bubblyfy-variants.ts
npx tsx scripts/test-biosuds-variants.ts
npx tsx scripts/test-natuwash-variants.ts
```

2. **Compare with manual checks**:
   - Variant count should match
   - Prices should be accurate
   - Wash counts should be correct

3. **Edge case testing**:
   - Out of stock variants
   - Sale prices
   - Currency formatting

### Step 5: Implementation Priority

1. **Natuwash** - Already has logic, just needs debugging
2. **Bubblyfy** - Has some structure, needs investigation
3. **Bio-Suds** - Needs complete implementation

## Expected Outcomes

### Bubblyfy
- Should find 2-3 variants (likely 64, 128, possibly 192 washes)
- Prices should reflect actual site prices, not estimates

### Bio-Suds
- Check if they have multiple pack sizes
- If yes, implement variant detection
- If no, document that they only offer single size

### Natuwash
- Fix variant detection to find all available options
- Ensure price extraction works correctly

## Success Criteria

✅ Each scraper should:
1. Find all variants visible on the product page
2. Extract correct prices for each variant
3. Calculate accurate price per wash
4. Handle edge cases gracefully
5. Log debug information for troubleshooting

## Next Steps After Implementation

1. Run full test suite
2. Verify data in database
3. Monitor for changes over time
4. Document any site-specific quirks
5. Set up alerts for scraping failures