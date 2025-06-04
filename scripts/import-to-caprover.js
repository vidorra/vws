const fs = require('fs');
const path = require('path');

async function importDatabase() {
  try {
    // Read the backup file
    const backupPath = path.join(__dirname, '..', 'vaatwasstrips_backup.sql');
    
    if (!fs.existsSync(backupPath)) {
      console.error('❌ Backup file not found at:', backupPath);
      console.log('Make sure you have run: /Library/PostgreSQL/17/bin/pg_dump -U postgres -d vaatwasstrips -f vaatwasstrips_backup.sql');
      return;
    }

    const sqlContent = fs.readFileSync(backupPath, 'utf8');
    console.log('✅ Read backup file, size:', (sqlContent.length / 1024).toFixed(2), 'KB');

    // Your CapRover app URL
    const appUrl = 'https://vaatwasstripsvergelijker.server.devjens.nl';
    const endpoint = `${appUrl}/api/setup-db?secret=setup-secret-vws-2024`;

    console.log('📤 Sending to:', endpoint);

    // Send to the API endpoint
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: sqlContent })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Database imported successfully!');
      console.log('Result:', result);
      console.log('\n⚠️  IMPORTANT: Delete the /app/api/setup-db/route.ts file after this import!');
    } else {
      console.error('❌ Import failed:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure:');
    console.log('1. You have deployed the latest code to CapRover');
    console.log('2. The DATABASE_URL environment variable is set in CapRover');
    console.log('3. Your app is running and accessible');
  }
}

// Run the import
importDatabase();