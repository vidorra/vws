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

export interface ProductData {
  name: string;
  supplier: string;
  url: string;
  price: PriceData;
  inStock: boolean;
  reviews?: ReviewData[];
}

export abstract class BaseScraper {
  abstract scrapePrice(url: string): Promise<PriceData>;
  abstract scrapeStock(url: string): Promise<boolean>;
  abstract scrapeReviews(url: string): Promise<ReviewData[]>;
  
  async scrapeProduct(url: string, name: string, supplier: string): Promise<ProductData> {
    const [price, inStock, reviews] = await Promise.all([
      this.scrapePrice(url),
      this.scrapeStock(url),
      this.scrapeReviews(url).catch(() => []) // Reviews are optional
    ]);

    return {
      name,
      supplier,
      url,
      price,
      inStock,
      reviews
    };
  }
}