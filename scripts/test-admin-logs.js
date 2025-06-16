const fetch = require('node-fetch');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vaatwasstrips.nl';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'VerySecurePassword123!';

async function testAdminLogs() {
  console.log('🧪 Testing Admin Logs Implementation...\n');

  try {
    // 1. Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const { token } = await loginResponse.json();
    console.log('✅ Login successful\n');

    // 2. Test fetching logs
    console.log('2️⃣ Fetching scraping logs...');
    const logsResponse = await fetch(`${BASE_URL}/api/admin/scraping-logs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!logsResponse.ok) {
      throw new Error(`Failed to fetch logs: ${logsResponse.status}`);
    }

    const logsData = await logsResponse.json();
    console.log('✅ Logs fetched successfully');
    console.log(`   - Total logs: ${logsData.pagination.total}`);
    console.log(`   - Summary (24h): ${JSON.stringify(logsData.summary)}\n`);

    // 3. Test filtering
    console.log('3️⃣ Testing filters...');
    const filteredResponse = await fetch(`${BASE_URL}/api/admin/scraping-logs?status=success&limit=10`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!filteredResponse.ok) {
      throw new Error(`Failed to fetch filtered logs: ${filteredResponse.status}`);
    }

    const filteredData = await filteredResponse.json();
    console.log('✅ Filtered logs fetched successfully');
    console.log(`   - Successful logs: ${filteredData.logs.length}\n`);

    // 4. Display sample log entries
    if (logsData.logs.length > 0) {
      console.log('4️⃣ Sample log entries:');
      logsData.logs.slice(0, 3).forEach((log, index) => {
        console.log(`\n   Log ${index + 1}:`);
        console.log(`   - Supplier: ${log.supplier}`);
        console.log(`   - Status: ${log.status}`);
        console.log(`   - Duration: ${log.duration ? `${log.duration}ms` : 'N/A'}`);
        console.log(`   - Price Change: ${log.priceChange ? `€${log.priceChange.toFixed(2)}` : 'N/A'}`);
        console.log(`   - Started: ${new Date(log.startedAt).toLocaleString()}`);
      });
    } else {
      console.log('ℹ️  No logs found. Run a scrape first to generate logs.');
    }

    console.log('\n✅ All tests passed! Admin logs implementation is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testAdminLogs();