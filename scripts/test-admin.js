// Quick test script to verify admin functionality
const bcrypt = require('bcryptjs');

async function testAdminSetup() {
  console.log('Testing Admin Setup...\n');
  
  // Test password hashing
  const testPassword = 'admin123';
  const hash = await bcrypt.hash(testPassword, 10);
  console.log('Generated hash for "admin123":', hash);
  
  // Test password verification
  const isValid = await bcrypt.compare(testPassword, hash);
  console.log('Password verification:', isValid ? '✓ Success' : '✗ Failed');
  
  // Display setup instructions
  console.log('\n--- Setup Instructions ---');
  console.log('1. Create a .env file in the root directory');
  console.log('2. Add the following variables:');
  console.log(`   ADMIN_EMAIL=admin@wasstripsvergelijker.nl`);
  console.log(`   ADMIN_PASSWORD_HASH=${hash}`);
  console.log(`   JWT_SECRET=your-secret-key-here`);
  console.log('\n3. Start the development server: npm run dev');
  console.log('4. Navigate to: http://localhost:3000/data-beheer/login');
  console.log('5. Login with:');
  console.log('   Email: admin@wasstripsvergelijker.nl');
  console.log('   Password: admin123');
  console.log('\n--- End of Instructions ---');
}

testAdminSetup().catch(console.error);