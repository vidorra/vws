export interface PriceData {
  price: number;
  pricePerWash: number;
  currency: string;
  scrapedAt: Date;
}

export interface ReviewData {
  rating: number;
  title: string;
  content: string;
  author: string;
  date: Date;
}

export interface VariantData {
  name: string;           // "60 wasbeurten", "Voordeelpak 120x"
  description?: string;   // "Standaard pakket", "Beste waarde"
  washCount: number;      // 30, 60, 120, etc.
  price: number;          // 12.99, 21.99, etc.
  pricePerWash: number;   // Calculated: price / washCount
  currency: string;       // "EUR"
  inStock: boolean;
  isDefault?: boolean;    // Mark the recommended/default variant
  url?: string;          // Direct URL to this variant
}

export interface ProductData {
  name: string;
  supplier: string;
  url: string;
  
  // Multiple variants instead of single price
  variants: VariantData[];
  
  // Keep single values for default variant (backward compatibility)
  price: PriceData;
  inStock: boolean;
  reviews: ReviewData[];
  
  // Additional data
  scrapedAt: Date;
}

export abstract class BaseScraper {
  abstract scrapeVariants(url: string): Promise<VariantData[]>;
  abstract scrapeStock(url: string): Promise<boolean>;
  abstract scrapeReviews(url: string): Promise<ReviewData[]>;
  
  // Updated main method
  async scrapeProduct(url: string, name: string, supplier: string): Promise<ProductData> {
    console.log(`🔍 Scraping ${name} variants from ${supplier}...`);
    
    const variants = await this.scrapeVariants(url);
    const stockStatus = await this.scrapeStock(url);
    const reviews = await this.scrapeReviews(url).catch(() => []); // Reviews are optional
    
    if (variants.length === 0) {
      throw new Error(`No variants found for ${name}`);
    }
    
    // Find default variant (marked as default, or best value, or first)
    const defaultVariant = variants.find(v => v.isDefault)
      || variants.reduce((best, current) =>
          current.pricePerWash < best.pricePerWash ? current : best
        );
    
    return {
      name,
      supplier,
      url,
      variants,
      price: {
        price: defaultVariant.price,
        pricePerWash: defaultVariant.pricePerWash,
        currency: defaultVariant.currency,
        scrapedAt: new Date()
      },
      inStock: stockStatus && variants.some(v => v.inStock),
      reviews,
      scrapedAt: new Date()
    };
  }
}