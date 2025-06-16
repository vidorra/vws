async function checkProductionStatus() {
  console.log('🔍 Checking production status...\n');
  
  const baseUrl = 'http://vaatwasstripsvergelijker.server.devjens.nl';
  
  // Check health endpoint
  try {
    console.log('1. Checking health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('   Health status:', healthData);
  } catch (error) {
    console.error('   ❌ Health check failed:', error.message);
  }
  
  // Check if products are visible on homepage
  try {
    console.log('\n2. Checking homepage for products...');
    const homeResponse = await fetch(baseUrl);
    const homeHtml = await homeResponse.text();
    
    // Check if products are mentioned
    const hasProducts = homeHtml.includes('product') || homeHtml.includes('€');
    console.log('   Products visible on homepage:', hasProducts ? 'Yes' : 'No');
    
    if (!hasProducts) {
      console.log('   ⚠️  No products found on homepage');
    }
  } catch (error) {
    console.error('   ❌ Homepage check failed:', error.message);
  }
  
  // Check database connection through API
  try {
    console.log('\n3. Checking database through API...');
    const dbResponse = await fetch(`${baseUrl}/api/admin/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (dbResponse.status === 401) {
      console.log('   API requires authentication (expected)');
    } else {
      const data = await dbResponse.json();
      console.log('   Database response:', data);
    }
  } catch (error) {
    console.error('   ❌ Database check failed:', error.message);
  }
  
  console.log('\n📋 Summary:');
  console.log('- If health check fails: Deployment issue');
  console.log('- If no products on homepage: Database connection issue');
  console.log('- If scraping fails: Chromium/Puppeteer issue');
}

checkProductionStatus().catch(console.error);