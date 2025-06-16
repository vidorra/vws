// Test scraper locally with TypeScript compilation
const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Building TypeScript files...');
try {
  execSync('npx tsc --outDir dist --module commonjs --target es2020 --esModuleInterop lib/scrapers/*.ts', {
    stdio: 'inherit'
  });
} catch (error) {
  console.error('TypeScript compilation failed:', error);
  process.exit(1);
}

console.log('\n🧪 Testing Cosmeau scraper locally...\n');

// Now require the compiled JavaScript
const { RealCosmEauScraper } = require('../dist/lib/scrapers/real-cosmeau-scraper.js');

async function testCosmeau() {
  const scraper = new RealCosmEauScraper();
  const url = 'https://cosmeau.com/products/vaatwasstrips';
  
  try {
    console.log(`Testing URL: ${url}`);
    const priceData = await scraper.scrapePrice(url);
    console.log('✅ Success! Price data:', priceData);
  } catch (error) {
    console.error('❌ Failed:', error.message);
    console.error('Full error:', error);
  }
}

testCosmeau().catch(console.error);