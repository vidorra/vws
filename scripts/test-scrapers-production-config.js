const puppeteer = require('puppeteer');

// Test if Puppeteer can launch with production configuration
async function testPuppeteerConfig() {
  console.log('🧪 Testing Puppeteer with production configuration...\n');
  
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-default-apps',
        '--no-default-browser-check',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-ipc-flooding-protection',
        '--disable-hang-monitor',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-sync',
        '--disable-translate',
        '--metrics-recording-only',
        '--no-crash-upload',
        '--disable-breakpad'
      ]
    });
    
    console.log('✅ Browser launched successfully with production config');
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 720 });
    
    console.log('✅ Page created and configured');
    
    // Test navigation to a simple page
    await page.goto('https://example.com', { waitUntil: 'networkidle2', timeout: 45000 });
    console.log('✅ Successfully navigated to test page');
    
    await browser.close();
    console.log('✅ Browser closed successfully\n');
    
    console.log('🎉 All Puppeteer tests passed! Configuration is ready for production.');
    
  } catch (error) {
    console.error('❌ Puppeteer test failed:', error.message);
    process.exit(1);
  }
}

// Test scraping through the API
async function testScrapingAPI() {
  console.log('\n🧪 Testing scraping through API...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Scraping API response:', data);
    
    if (data.results && data.results.length > 0) {
      console.log('\n📊 Scraping Results:');
      data.results.forEach(result => {
        console.log(`  ${result.status === 'success' ? '✅' : '❌'} ${result.brand}: €${result.price || 'N/A'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('ℹ️  Make sure the dev server is running on http://localhost:3000');
  }
}

// Run tests
async function runTests() {
  await testPuppeteerConfig();
  await testScrapingAPI();
}

runTests();