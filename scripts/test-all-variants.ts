import { RealBubblyfyScraper } from '../lib/scrapers/real-bubblyfy-scraper';
import { RealBioSudsScraper } from '../lib/scrapers/real-biosuds-scraper';
import { RealNatuwashScraper } from '../lib/scrapers/real-natuwash-scraper';

async function testAllVariants() {
  console.log('🧪 Testing all variant scrapers...\n');
  
  const scrapers = [
    {
      name: 'Bubblyfy',
      scraper: new RealBubblyfyScraper(),
      url: 'https://www.bubblyfy.nl/products/vaatwasstrips',
      expectedVariants: 3
    },
    {
      name: 'Bio-Suds',
      scraper: new RealBioSudsScraper(),
      url: 'https://www.bio-suds.com/products/bio-suds-milieuvriendelijke-vaatwasstrips',
      expectedVariants: 6
    },
    {
      name: 'Natuwash',
      scraper: new RealNatuwashScraper(),
      url: 'https://natuwash.com/products/vaatwasstrips',
      expectedVariants: 4
    }
  ];
  
  for (const { name, scraper, url, expectedVariants } of scrapers) {
    console.log(`\n📦 Testing ${name}...`);
    console.log(`URL: ${url}`);
    
    try {
      const variants = await scraper.scrapeVariants(url);
      
      console.log(`\n✅ Found ${variants.length} variants (expected: ${expectedVariants})`);
      
      if (variants.length === 0) {
        console.log('❌ No variants found!');
      } else {
        console.log('\nVariants found:');
        variants.forEach((variant, index) => {
          console.log(`\n${index + 1}. ${variant.name}`);
          console.log(`   - Wash count: ${variant.washCount}`);
          console.log(`   - Price: €${variant.price.toFixed(2)}`);
          console.log(`   - Price per wash: €${variant.pricePerWash.toFixed(3)}`);
          console.log(`   - In stock: ${variant.inStock ? 'Yes' : 'No'}`);
          console.log(`   - Default: ${variant.isDefault ? 'Yes' : 'No'}`);
        });
        
        // Verify data quality
        const issues = [];
        
        if (variants.length !== expectedVariants) {
          issues.push(`Expected ${expectedVariants} variants but found ${variants.length}`);
        }
        
        variants.forEach((variant, index) => {
          if (variant.price <= 0) {
            issues.push(`Variant ${index + 1} has invalid price: €${variant.price}`);
          }
          if (variant.washCount <= 0) {
            issues.push(`Variant ${index + 1} has invalid wash count: ${variant.washCount}`);
          }
          if (variant.pricePerWash <= 0) {
            issues.push(`Variant ${index + 1} has invalid price per wash: €${variant.pricePerWash}`);
          }
        });
        
        if (issues.length > 0) {
          console.log('\n⚠️  Issues found:');
          issues.forEach(issue => console.log(`   - ${issue}`));
        } else {
          console.log('\n✅ All data looks good!');
        }
      }
      
    } catch (error) {
      console.error(`\n❌ Error testing ${name}:`, error);
    }
    
    console.log('\n' + '='.repeat(60));
  }
  
  console.log('\n🏁 Testing complete!');
}

// Run the test
testAllVariants().catch(console.error);