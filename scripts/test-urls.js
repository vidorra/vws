const https = require('https');
const http = require('http');

const urls = [
  'https://nl.mothersearth.com/collections/dishwasher-sheets',
  'https://cosmeau.com/products/vaatwasstrips',
  'https://www.bubblyfy.nl/products/vaatwasstrips',
  'https://www.bio-suds.com/products/bio-suds-milieuvriendelijke-vaatwasstrips',
  'https://wasstrip.nl/p/vaatwasstrips-80-wasbeurten/',
  'https://natuwash.com/products/vaatwasstrips'
];

function testUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, { timeout: 10000 }, (res) => {
      console.log(`✅ ${res.statusCode} - URL is accessible`);
      resolve();
    }).on('error', (err) => {
      console.log(`❌ Error: ${err.message}`);
      resolve();
    }).on('timeout', () => {
      console.log(`❌ Error: Request timeout`);
      resolve();
    });
  });
}

async function testUrls() {
  for (const url of urls) {
    console.log(`\n🔍 Testing: ${url}`);
    await testUrl(url);
  }
}

testUrls();