// Simple test to check if scraping works locally
console.log('🧪 Testing scraping locally...\n');

const testUrls = [
  { brand: "Mother's Earth", url: 'https://nl.mothersearth.com/collections/dishwasher-sheets' },
  { brand: 'Cosmeau', url: 'https://cosmeau.com/products/vaatwasstrips' },
  { brand: 'Bubblyfy', url: 'https://www.bubblyfy.nl/products/vaatwasstrips' },
  { brand: 'Bio-Suds', url: 'https://www.bio-suds.com/products/bio-suds-milieuvriendelijke-vaatwasstrips' },
  { brand: 'Wasstrip.nl', url: 'https://wasstrip.nl/p/vaatwasstrips-80-wasbeurten/' },
  { brand: 'Natuwash', url: 'https://natuwash.com/products/vaatwasstrips' }
];

console.log('📋 Current scraping configuration:\n');
testUrls.forEach(({ brand, url }) => {
  console.log(`${brand}:`);
  console.log(`  URL: ${url}`);
  console.log('');
});

console.log('\n💡 To test the scraping:');
console.log('1. Make sure the dev server is running: npm run dev');
console.log('2. Go to: http://localhost:3000/data-beheer');
console.log('3. Login and click "Start Handmatige Scrape"');
console.log('4. Check the console output in the terminal running npm run dev');
console.log('5. The enhanced logging will show URLs and detailed errors\n');

console.log('📝 Once deployed, the scraping logs will show:');
console.log('- The exact URL being scraped');
console.log('- Any error messages with context');
console.log('- Price text found on the page (if any)\n');

console.log('🔍 Common issues to check:');
console.log('- Bot protection (403 errors) - Puppeteer should handle this');
console.log('- Changed page structure - selectors may need updating');
console.log('- JavaScript-rendered prices - may need wait times');
console.log('- Different price formats - regex may need adjustment');