import { RealMothersEarthScraper } from './real-mothersearth-scraper';
import { RealCosmEauScraper } from './real-cosmeau-scraper';
import { RealBubblyfyScraper } from './real-bubblyfy-scraper';
import { RealBioSudsScraper } from './real-biosuds-scraper';
import { RealWasstripNlScraper } from './real-wasstripnl-scraper';
import { RealNatuwashScraper } from './real-natuwash-scraper';
import { ProductData } from './base-scraper';

interface ScrapingTarget {
  name: string;
  supplier: string;
  url: string;
  scraper: any;
  productSlug: string;
}

export class ScrapingCoordinator {
  private targets: ScrapingTarget[] = [
    {
      name: 'Wasstrips Original',
      supplier: "Mother's Earth",
      url: 'https://nl.mothersearth.com/collections/dishwasher-sheets', // ✅ Working
      scraper: RealMothersEarthScraper,
      productSlug: 'mothers-earth'
    },
    {
      name: 'Cosmeau Vaatwasstrips',
      supplier: 'Cosmeau',
      url: 'https://cosmeau.com/products/vaatwasstrips', // ✅ Fixed
      scraper: RealCosmEauScraper,
      productSlug: 'cosmeau'
    },
    {
      name: 'Bubblyfy Wasstrips',
      supplier: 'Bubblyfy',
      url: 'https://www.bubblyfy.nl/products/vaatwasstrips', // ✅ Fixed
      scraper: RealBubblyfyScraper,
      productSlug: 'bubblyfy'
    },
    {
      name: 'Bio-Suds Wasstrips',
      supplier: 'Bio-Suds',
      url: 'https://www.bio-suds.com/products/bio-suds-milieuvriendelijke-vaatwasstrips', // ✅ Correct
      scraper: RealBioSudsScraper,
      productSlug: 'bio-suds'
    },
    {
      name: 'Wasstrip.nl Vaatwasstrips',
      supplier: 'Wasstrip.nl',
      url: 'https://wasstrip.nl/p/vaatwasstrips-80-wasbeurten/', // ✅ Fixed
      scraper: RealWasstripNlScraper,
      productSlug: 'wasstrip-nl'
    },
    {
      name: 'Natuwash Vaatwasstrips',
      supplier: 'Natuwash',
      url: 'https://natuwash.com/products/vaatwasstrips', // ✅ Correct
      scraper: RealNatuwashScraper,
      productSlug: 'natuwash'
    }
  ];

  async scrapeAllProducts(): Promise<ProductData[]> {
    const results: ProductData[] = [];
    
    console.log(`🚀 Starting scrape of ${this.targets.length} products...`);
    
    for (const target of this.targets) {
      try {
        console.log(`\n📦 Scraping ${target.name} from ${target.supplier}...`);
        
        // Add delay between scrapes to be respectful
        if (results.length > 0) {
          console.log('⏳ Waiting 3 seconds before next scrape...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        const scraper = new target.scraper();
        const productData = await scraper.scrapeProduct(
          target.url,
          target.name,
          target.supplier
        );
        
        // Add the product slug for database updates
        (productData as any).slug = target.productSlug;
        
        results.push(productData);
        console.log(`✅ Successfully scraped ${target.name}`);
        
      } catch (error) {
        console.error(`❌ Failed to scrape ${target.name}:`, error);
        // Continue with other products even if one fails
        
        // You might want to create a failed result entry
        results.push({
          name: target.name,
          supplier: target.supplier,
          url: target.url,
          price: {
            price: 0,
            pricePerWash: 0,
            currency: 'EUR',
            scrapedAt: new Date()
          },
          inStock: true, // Default
          reviews: []
        } as ProductData);
      }
    }
    
    console.log(`\n🎉 Scraping completed! ${results.length} products processed.`);
    return results;
  }

  async scrapeBySupplier(supplier: string): Promise<ProductData[]> {
    const supplierTargets = this.targets.filter(
      t => t.supplier.toLowerCase() === supplier.toLowerCase()
    );
    
    console.log(`🎯 Scraping ${supplierTargets.length} products for ${supplier}...`);
    
    const results: ProductData[] = [];
    
    for (const target of supplierTargets) {
      try {
        const scraper = new target.scraper();
        const productData = await scraper.scrapeProduct(
          target.url,
          target.name,
          target.supplier
        );
        
        (productData as any).slug = target.productSlug;
        results.push(productData);
        
      } catch (error) {
        console.error(`❌ Failed to scrape ${target.name}:`, error);
      }
    }
    
    return results;
  }

  // Method to get all configured targets (useful for admin)
  getTargets(): ScrapingTarget[] {
    return this.targets.map(t => ({
      name: t.name,
      supplier: t.supplier,
      url: t.url,
      scraper: t.scraper.name,
      productSlug: t.productSlug
    }));
  }
}