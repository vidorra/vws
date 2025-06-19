import { RealMothersEarthScraper } from '../lib/scrapers/real-mothersearth-scraper';

async function testMothersEarthScraping() {
  const scraper = new RealMothersEarthScraper();
  const url = 'https://nl.mothersearth.com/products/dishwasher-sheet?variant=50107168784722';
  
  console.log('🧪 Testing Mother\'s Earth scraping with cleaned variant names...\n');
  
  try {
    // Test variant scraping
    console.log('📦 Testing variant scraping...');
    const variants = await scraper.scrapeVariants(url);
    
    console.log(`\n✅ Found ${variants.length} variants:\n`);
    
    variants.forEach((variant, index) => {
      console.log(`Variant ${index + 1}:`);
      console.log(`  Name: "${variant.name}"`);
      console.log(`  Wash Count: ${variant.washCount}`);
      console.log(`  Price: €${variant.price.toFixed(2)}`);
      console.log(`  Price per wash: €${variant.pricePerWash.toFixed(3)}`);
      console.log(`  In Stock: ${variant.inStock}`);
      console.log(`  Is Default: ${variant.isDefault}`);
      console.log('');
    });
    
    // Test full product scraping
    console.log('📦 Testing full product scraping...');
    const productData = await scraper.scrapeProduct(url, "Mother's Earth", "Mother's Earth");
    
    console.log('\n✅ Product data:');
    console.log(`  Name: ${productData.name}`);
    console.log(`  Supplier: ${productData.supplier}`);
    console.log(`  Default Price: €${productData.price.price.toFixed(2)}`);
    console.log(`  In Stock: ${productData.inStock}`);
    console.log(`  Variants: ${productData.variants.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testMothersEarthScraping();