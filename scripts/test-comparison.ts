import { prisma } from '../lib/prisma';

async function testComparison() {
  console.log('🔍 Testing comparison functionality...\n');

  try {
    // Get some products to test with
    const products = await prisma.product.findMany({
      take: 4,
      include: {
        variants: true
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });

    if (products.length === 0) {
      console.log('❌ No products found in database');
      return;
    }

    console.log(`✅ Found ${products.length} products for testing:\n`);

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.supplier})`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Variants: ${product.variants.length}`);
      console.log(`   Price: €${product.currentPrice || 'N/A'}`);
      console.log(`   Sustainability: ${product.sustainability || 'N/A'}/10`);
      console.log('');
    });

    // Test the comparison URL
    const productIds = products.slice(0, 3).map(p => p.id);
    const comparisonUrl = `/vergelijk?products=${productIds.join(',')}`;
    
    console.log('📊 Test comparison URL:');
    console.log(`   ${comparisonUrl}\n`);

    // Test API endpoint
    console.log('🔌 Testing API endpoint...');
    const apiUrl = `http://localhost:3000/api/products?ids=${productIds.join(',')}`;
    console.log(`   GET ${apiUrl}`);
    
    // Note: Can't actually fetch in this script, but showing the URL
    console.log('\n✅ Comparison setup complete!');
    console.log('\nTo test the comparison tool:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Go to the homepage');
    console.log('3. Select 2-4 products using the checkboxes');
    console.log('4. Click "Vergelijk producten" in the bottom bar');
    console.log(`5. Or visit: http://localhost:3000${comparisonUrl}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testComparison();