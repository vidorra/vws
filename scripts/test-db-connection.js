// Test database connection
console.log('Environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current working directory:', process.cwd());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('\nTesting database connection...');
    const count = await prisma.product.count();
    console.log(`✅ Success! Found ${count} products in the database.`);
    
    const products = await prisma.product.findMany({ take: 2 });
    console.log('\nSample products:');
    products.forEach(p => {
      console.log(`- ${p.name}: €${p.currentPrice}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    console.error('\nFull error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();