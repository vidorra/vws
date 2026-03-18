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
  /** Display name, e.g. "60 wasbeurten", "Voordeelpak 120x" */
  name: string;
  description?: string;
  /** Number of wash cycles in this pack */
  washCount: number;
  /** Pack price in EUR */
  price: number;
  /** Calculated: price / washCount */
  pricePerWash: number;
  currency: string;
  inStock: boolean;
  /** Mark the recommended/default variant shown first */
  isDefault?: boolean;
  /** Direct URL to this specific variant (for affiliate tracking) */
  url?: string;
}

export interface ProductData {
  name: string;
  supplier: string;
  url: string;
  variants: VariantData[];
  /** Reflects the default/best-value variant */
  price: PriceData;
  inStock: boolean;
  reviews: ReviewData[];
  scrapedAt: Date;
}

/**
 * Abstract base class for all supplier scrapers.
 *
 * Each concrete scraper must implement:
 * - `scrapeVariants(url)` — extract all pack-size variants with pricing
 * - `scrapeStock(url)`    — return current in-stock status
 * - `scrapeReviews(url)`  — extract user reviews (errors are swallowed)
 *
 * The `scrapeProduct` template method orchestrates the three steps and
 * selects the best-value variant as the default price.
 */
export abstract class BaseScraper {
  /** Extract all available pack variants and their prices from the product page. */
  abstract scrapeVariants(url: string): Promise<VariantData[]>;

  /** Return true if the product is currently available to purchase. */
  abstract scrapeStock(url: string): Promise<boolean>;

  /** Extract user reviews from the product page. May return [] if unavailable. */
  abstract scrapeReviews(url: string): Promise<ReviewData[]>;

  async scrapeProduct(url: string, name: string, supplier: string): Promise<ProductData> {
    console.log(`🔍 Scraping ${name} variants from ${supplier}...`);

    const variants = await this.scrapeVariants(url);
    const stockStatus = await this.scrapeStock(url);
    const reviews = await this.scrapeReviews(url).catch(() => []);

    if (variants.length === 0) {
      throw new Error(`No variants found for ${name}`);
    }

    // Prefer explicitly marked default; fall back to lowest price-per-wash
    const defaultVariant =
      variants.find((v) => v.isDefault) ||
      variants.reduce((best, current) =>
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
        scrapedAt: new Date(),
      },
      inStock: stockStatus && variants.some((v) => v.inStock),
      reviews,
      scrapedAt: new Date(),
    };
  }
}
