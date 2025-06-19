interface ProductAwards {
  bestReview?: boolean;
  bestSustainability?: boolean;
  bestDealPrice?: boolean;  // Best price per wash (bulk)
  bestTryPrice?: boolean;    // Best small pack price
}

interface ProductVariant {
  pricePerWash: number;
  price?: number;
  washCount?: number;
}

interface Product {
  id: string;
  rating?: number | null;
  sustainability?: number | null;
  variants?: ProductVariant[];
  pricePerWash?: number | null;
  awards?: ProductAwards;
}

export function calculateProductAwards(products: Product[]): Product[] {
  if (products.length === 0) return products;

  // Find the best in each category
  const ratings = products
    .map(p => p.rating)
    .filter((r): r is number => r !== null && r !== undefined);
  const bestRating = ratings.length > 0 ? Math.max(...ratings) : 0;

  const sustainabilityScores = products
    .map(p => p.sustainability)
    .filter((s): s is number => s !== null && s !== undefined);
  const bestSustainability = sustainabilityScores.length > 0 ? Math.max(...sustainabilityScores) : 0;
  
  // Get best deal price (lowest price per wash) and best try price (cheapest small pack)
  const allPricesPerWash: number[] = [];
  const smallPackPrices: { productId: string; price: number; washCount: number }[] = [];
  
  products.forEach(product => {
    // Add variant prices
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        if (variant.pricePerWash && variant.pricePerWash > 0) {
          allPricesPerWash.push(variant.pricePerWash);
        }
        // Collect small packs (60 washes or less) for try-out price
        if (variant.price && variant.price > 0 && (!variant.washCount || variant.washCount <= 60)) {
          smallPackPrices.push({
            productId: product.id,
            price: variant.price,
            washCount: variant.washCount || 60
          });
        }
      });
    } else if (product.pricePerWash && product.pricePerWash > 0) {
      // Fallback to product-level price if no variants
      allPricesPerWash.push(product.pricePerWash);
    }
  });
  
  const bestDealPricePerWash = allPricesPerWash.length > 0 ? Math.min(...allPricesPerWash) : Infinity;
  const bestTryPrice = smallPackPrices.length > 0
    ? Math.min(...smallPackPrices.map(p => p.price))
    : Infinity;

  // Debug logging
  console.log('Award calculation debug:', {
    bestRating,
    bestSustainability,
    bestDealPricePerWash,
    bestTryPrice,
    allPricesPerWash: allPricesPerWash.slice(0, 10), // First 10 prices
    smallPackPrices: smallPackPrices.slice(0, 5) // First 5 small packs
  });

  return products.map(product => {
    // Check if this product has the best deal price variant
    let hasBestDealPrice = false;
    let hasBestTryPrice = false;
    
    if (product.variants && product.variants.length > 0) {
      // Check for best deal price
      const variantPrices = product.variants
        .map(v => v.pricePerWash)
        .filter(p => p && p > 0);
      
      if (variantPrices.length > 0) {
        const productBestPrice = Math.min(...variantPrices);
        hasBestDealPrice = productBestPrice === bestDealPricePerWash;
      }
      
      // Check for best try price (small packs)
      const smallVariants = product.variants.filter(v =>
        v.price && v.price > 0 && (!v.washCount || v.washCount <= 60)
      );
      
      if (smallVariants.length > 0) {
        const cheapestSmall = Math.min(...smallVariants.map(v => v.price!));
        hasBestTryPrice = cheapestSmall === bestTryPrice;
      }
    } else if (product.pricePerWash && product.pricePerWash > 0) {
      hasBestDealPrice = product.pricePerWash === bestDealPricePerWash;
    }
    
    return {
      ...product,
      awards: {
        bestReview: product.rating === bestRating && bestRating > 0,
        bestSustainability: product.sustainability === bestSustainability && bestSustainability > 0,
        bestDealPrice: hasBestDealPrice && bestDealPricePerWash < Infinity,
        bestTryPrice: hasBestTryPrice && bestTryPrice < Infinity
      }
    };
  });
}