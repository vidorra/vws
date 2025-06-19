import { prisma } from '../lib/prisma';

async function checkPrices() {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { pricePerWash: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  });

  console.log('All products and their cheapest variants:\n');
  
  products.forEach(product => {
    console.log(`${product.name} (${product.supplier}):`);
    if (product.variants.length > 0) {
      const cheapest = product.variants[0];
      console.log(`  Cheapest: ${cheapest.name} - €${cheapest.price} (€${cheapest.pricePerWash}/wash)`);
      console.log(`  All variants:`);
      product.variants.forEach(v => {
        console.log(`    - ${v.name}: €${v.price} (€${v.pricePerWash}/wash)`);
      });
    } else {
      console.log(`  No variants - Product price: €${product.currentPrice} (€${product.pricePerWash}/wash)`);
    }
    console.log('');
  });

  // Find absolute cheapest
  const allVariants = products.flatMap(p => p.variants);
  const cheapestVariant = allVariants.reduce((min, v) => 
    v.pricePerWash < min.pricePerWash ? v : min
  );
  
  const product = products.find(p => 
    p.variants.some(v => v.id === cheapestVariant.id)
  );
  
  console.log('\n=== CHEAPEST OPTION ===');
  console.log(`${product?.name}: ${cheapestVariant.name}`);
  console.log(`Price: €${cheapestVariant.price} (€${cheapestVariant.pricePerWash}/wash)`);
  
  process.exit(0);
}

checkPrices().catch(console.error);