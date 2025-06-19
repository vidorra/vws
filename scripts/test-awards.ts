import { getProductsSafe } from '../lib/db-safe';
import { calculateProductAwards } from '../utils/calculateAwards';

async function testAwards() {
  console.log('Testing award calculation...\n');
  
  // Fetch products
  const products = await getProductsSafe();
  
  console.log(`Found ${products.length} products\n`);
  
  // Show variant prices for each product
  products.forEach((product: any) => {
    console.log(`\n${product.name} (${product.supplier}):`);
    console.log(`  Product price per wash: €${product.pricePerWash || 'N/A'}`);
    
    if (product.variants && product.variants.length > 0) {
      console.log('  Variants:');
      product.variants.forEach((variant: any) => {
        console.log(`    - ${variant.name}: €${variant.price} (€${variant.pricePerWash}/wash)`);
      });
    } else {
      console.log('  No variants');
    }
  });
  
  // Calculate awards
  const productsWithAwards = calculateProductAwards(products);
  
  console.log('\n\nAward Winners:');
  console.log('==============');
  
  // Find award winners
  const bestReviewWinners = productsWithAwards.filter((p: any) => p.awards?.bestReview);
  const bestSustainabilityWinners = productsWithAwards.filter((p: any) => p.awards?.bestSustainability);
  const bestDealPriceWinners = productsWithAwards.filter((p: any) => p.awards?.bestDealPrice);
  const bestTryPriceWinners = productsWithAwards.filter((p: any) => p.awards?.bestTryPrice);
  
  console.log('\nBest Review:');
  bestReviewWinners.forEach((p: any) => {
    console.log(`  - ${p.name}: Rating ${p.rating}`);
  });
  
  console.log('\nBest Sustainability:');
  bestSustainabilityWinners.forEach((p: any) => {
    console.log(`  - ${p.name}: Score ${p.sustainability}/10`);
  });
  
  console.log('\nBest Deal Price (lowest price per wash):');
  bestDealPriceWinners.forEach((p: any) => {
    const lowestPrice = Math.min(
      ...p.variants.map((v: any) => v.pricePerWash).filter((p: number) => p > 0)
    );
    console.log(`  - ${p.name}: €${lowestPrice}/wash`);
  });
  
  console.log('\nBest Try-out Price (cheapest small pack):');
  bestTryPriceWinners.forEach((p: any) => {
    const smallVariants = p.variants.filter((v: any) => v.washCount <= 60);
    const cheapestSmall = smallVariants.reduce((min: any, v: any) =>
      v.price < min.price ? v : min
    );
    console.log(`  - ${p.name}: €${cheapestSmall.price} for ${cheapestSmall.washCount} washes`);
  });
  
  process.exit(0);
}

testAwards().catch(console.error);