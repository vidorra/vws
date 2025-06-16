const https = require('https');

async function testScrapingAPI() {
  console.log('🧪 Testing scraping via API...\n');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/scrape',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'admin-auth=your-auth-token' // You'll need to get this from a login
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Response status:', res.statusCode);
        console.log('Response:', data);
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.error('Error:', error);
      reject(error);
    });
    
    req.end();
  });
}

// First, let's test if the server is running
console.log('Note: Make sure the development server is running (npm run dev)');
console.log('You can test the scraping manually through the admin interface at /data-beheer\n');

// For now, let's just show the URLs that will be scraped
const urls = [
  { brand: "Mother's Earth", url: 'https://nl.mothersearth.com/collections/dishwasher-sheets' },
  { brand: 'Cosmeau', url: 'https://cosmeau.com/products/vaatwasstrips' },
  { brand: 'Bubblyfy', url: 'https://www.bubblyfy.nl/products/vaatwasstrips' },
  { brand: 'Bio-Suds', url: 'https://www.bio-suds.com/products/bio-suds-milieuvriendelijke-vaatwasstrips' },
  { brand: 'Wasstrip.nl', url: 'https://wasstrip.nl/p/vaatwasstrips-80-wasbeurten/' },
  { brand: 'Natuwash', url: 'https://natuwash.com/products/vaatwasstrips' }
];

console.log('URLs that will be scraped:');
urls.forEach(({ brand, url }) => {
  console.log(`\n${brand}:`);
  console.log(`  ${url}`);
});

console.log('\n\nTo test the scraping:');
console.log('1. Run: npm run dev');
console.log('2. Go to: http://localhost:3000/data-beheer');
console.log('3. Login with your admin credentials');
console.log('4. Click "Start Handmatige Scrape"');
console.log('5. Check the "Scraping Logs" tab for results');