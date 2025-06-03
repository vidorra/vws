import { MothersEarthScraper } from './mothersearth-scraper';
import { ProductData } from './base-scraper';

interface ScrapingTarget {
  name: string;
  supplier: string;
  url: string;
  scraper: any;
}

export class ScrapingCoordinator {
  private targets: ScrapingTarget[] = [
    {
      name: 'Wasstrips Original',
      supplier: "Mother's Earth",
      url: 'https://example.com/mothers-earth-wasstrips',
      scraper: MothersEarthScraper
    },
    // Add more products here as we implement more scrapers
  ];

  async scrapeAllProducts(): Promise<ProductData[]> {
    const results: ProductData[] = [];
    
    for (const target of this.targets) {
      try {
        console.log(`Scraping ${target.name} from ${target.supplier}...`);
        
        const scraper = new target.scraper();
        const productData = await scraper.scrapeProduct(
          target.url,
          target.name,
          target.supplier
        );
        
        results.push(productData);
        console.log(`Successfully scraped ${target.name}`);
      } catch (error) {
        console.error(`Failed to scrape ${target.name}:`, error);
        // Continue with other products even if one fails
      }
    }
    
    return results;
  }

  async scrapeBySupplier(supplier: string): Promise<ProductData[]> {
    const supplierTargets = this.targets.filter(
      t => t.supplier.toLowerCase() === supplier.toLowerCase()
    );
    
    const results: ProductData[] = [];
    
    for (const target of supplierTargets) {
      try {
        const scraper = new target.scraper();
        const productData = await scraper.scrapeProduct(
          target.url,
          target.name,
          target.supplier
        );
        
        results.push(productData);
      } catch (error) {
        console.error(`Failed to scrape ${target.name}:`, error);
      }
    }
    
    return results;
  }
}