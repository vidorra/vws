const { RealMothersEarthScraper } = require('../lib/scrapers/real-mothersearth-scraper');
const { RealCosmEauScraper } = require('../lib/scrapers/real-cosmeau-scraper');
const { RealBubblyfyScraper } = require('../lib/scrapers/real-bubblyfy-scraper');
const { RealBioSudsScraper } = require('../lib/scrapers/real-biosuds-scraper');
const { RealWasstripNlScraper } = require('../lib/scrapers/real-wasstripnl-scraper');
const { RealGreenGoodsScraper } = require('../lib/scrapers/real-greengoods-scraper');
const { RealNatuwashScraper } = require('../lib/scrapers/real-natuwash-scraper');

async function testScrapers() {
  console.log('🧪 Testing all scrapers...\n');
  
  const scrapers = [
    {
      name: "Mother's Earth",
      scraper: new RealMothersEarthScraper(),
      url: 'https://mothersearth.nl/products/wasstrips' // Update with real URL
    },
    {
      name: 'Cosmeau',
      scraper: new RealCosmEauScraper(),
      url: 'https://cosmeau.nl/products/vaatwasstrips' // Update with real URL
    },
    {
      name: 'Bubblyfy',
      scraper: new RealBubblyfyScraper(),
      url: 'https://bubblyfy.com/products/vaatwasstrips' // Update with real URL
    },
    {
      name: 'Bio-Suds',
      scraper: new RealBioSudsScraper(),
      url: 'https://bio-suds.com/products/bio-suds-milieuvriendelijke-vaatwasstrips'
    },
    {
      name: 'Wasstrip.nl',
      scraper: new RealWasstripNlScraper(),
      url: 'https://wasstrip.nl/products/vaatwasstrips' // Update with real URL
    },
    {
      name: 'GreenGoods',
      scraper: new RealGreenGoodsScraper(),
      url: 'https://www.bol.com/nl/nl/p/greengoods-vaatwasstrips/' // Update with real URL
    },
    {
      name: 'Natuwash',
      scraper: new RealNatuwashScraper(),
      url: 'https://natuwash.com/products/vaatwasstrips' // Update with real URL
    }
  ];
  
  for (const { name, scraper, url } of scrapers) {
    console.log(`\n📦 Testing ${name} scraper...`);
    console.log(`URL: ${url}`);
    
    try {
      // Test price scraping
      console.log('💰 Testing price scraping...');
      const priceData = await scraper.scrapePrice(url);
      console.log('✅ Price data:', {
        price: `€${priceData.price}`,
        pricePerWash: `€${priceData.pricePerWash.toFixed(3)}`,
        currency: priceData.currency,
        scrapedAt: priceData.scrapedAt
      });
      
      // Test stock scraping
      console.log('\n📊 Testing stock scraping...');
      const stockStatus = await scraper.scrapeStock(url);
      console.log(`✅ Stock status: ${stockStatus ? 'In Stock' : 'Out of Stock'}`);
      
      console.log(`\n✅ ${name} scraper test completed successfully!`);
      
    } catch (error) {
      console.error(`\n❌ ${name} scraper test failed:`, error.message);
    }
    
    console.log('\n' + '='.repeat(60));
  }
  
  console.log('\n🎉 All scraper tests completed!');
}

// Run tests
testScrapers().catch(console.error);