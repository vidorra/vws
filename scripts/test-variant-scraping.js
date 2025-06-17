const { ScrapingCoordinator } = require('../lib/scrapers/scraping-coordinator');

async function testVariantScraping() {
  console.log('🧪 Testing Multi-Variant Scraping Implementation\n');
  
  const coordinator = new ScrapingCoordinator();
  
  // Test individual scrapers
  const testTargets = [
    { name: "Mother's Earth", supplier: "Mother's Earth" },
    { name: 'Cosmeau', supplier: 'Cosmeau' },
    { name: 'Bubblyfy', supplier: 'Bubblyfy' }
  ];
  
  for (const target of testTargets) {
    console.log(`\n📦 Testing ${target.name} variant scraping...`);
    console.log('─'.repeat(50));
    
    try {
      const results = await coordinator.scrapeBySupplier(target.supplier);
      
      if (results.length > 0) {
        const product = results[0];
        console.log(`✅ Product: ${product.name}`);
        console.log(`🔗 URL: ${product.url}`);
        console.log(`📊 Variants found: ${product.variants.length}`);
        
        if (product.variants.length > 0) {
          console.log('\n📋 Variant Details:');
          product.variants.forEach((variant, index) => {
            console.log(`\n  Variant ${index + 1}:`);
            console.log(`  - Name: ${variant.name}`);
            console.log(`  - Washes: ${variant.washCount}`);
            console.log(`  - Price: €${variant.price.toFixed(2)}`);
            console.log(`  - Per wash: €${variant.pricePerWash.toFixed(3)}`);
            console.log(`  - In stock: ${variant.inStock ? 'Yes' : 'No'}`);
            console.log(`  - Default: ${variant.isDefault ? 'Yes' : 'No'}`);
          });
          
          // Find best value
          const bestValue = product.variants.reduce((best, current) => 
            current.pricePerWash < best.pricePerWash ? current : best
          );
          console.log(`\n💰 Best value: ${bestValue.name} at €${bestValue.pricePerWash.toFixed(3)} per wash`);
        } else {
          console.log('❌ No variants found!');
        }
      }
    } catch (error) {
      console.error(`❌ Error testing ${target.name}:`, error.message);
    }
  }
  
  console.log('\n\n🎯 Testing complete scraping run...');
  console.log('─'.repeat(50));
  
  try {
    const allResults = await coordinator.scrapeAllProducts();
    console.log(`\n📊 Summary:`);
    console.log(`- Total products: ${allResults.length}`);
    console.log(`- Products with variants: ${allResults.filter(p => p.variants.length > 0).length}`);
    console.log(`- Total variants: ${allResults.reduce((sum, p) => sum + p.variants.length, 0)}`);
    
    console.log('\n📈 Variant distribution:');
    allResults.forEach(product => {
      console.log(`- ${product.supplier}: ${product.variants.length} variant(s)`);
    });
    
  } catch (error) {
    console.error('❌ Error in complete scraping:', error);
  }
}

// Run the test
testVariantScraping().catch(console.error);