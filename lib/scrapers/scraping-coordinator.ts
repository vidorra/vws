import { RealMothersEarthScraper } from './real-mothersearth-scraper';
import { RealCosmEauScraper } from './real-cosmeau-scraper';
import { RealBubblyfyScraper } from './real-bubblyfy-scraper';
import { RealBioSudsScraper } from './real-biosuds-scraper';
import { RealWasstripNlScraper } from './real-wasstripnl-scraper';
import { RealNatuwashScraper } from './real-natuwash-scraper';
import { WasstripsCosmEauScraper } from './wasstrips-cosmeau-scraper';
import { WasstripsMothersEarthScraper } from './wasstrips-mothersearth-scraper';
import { WasstripsNatuwashScraper } from './wasstrips-natuwash-scraper';
import { WasstripsBioSudsScraper } from './wasstrips-biosuds-scraper';
import { WasstripsWasstripNlScraper } from './wasstrips-wasstripnl-scraper';
import { WasstripsHappySoapsScraper } from './wasstrips-happysoaps-scraper';
import { ProductData } from './base-scraper';
import type { SiteKey } from '../site-config';

interface ScrapingTarget {
  name: string;
  supplier: string;
  url: string;
  scraper: any;
  productSlug: string;
  site: SiteKey;
}

export class ScrapingCoordinator {
  private targets: ScrapingTarget[] = [
    // === Vaatwasstrips targets ===
    {
      name: "Mother's Earth Vaatwasstrips",
      supplier: "Mother's Earth",
      url: 'https://nl.mothersearth.com/products/dishwasher-sheet?variant=50107168784722',
      scraper: RealMothersEarthScraper,
      productSlug: 'mothers-earth',
      site: 'vaatwasstrips',
    },
    {
      name: 'Cosmeau Vaatwasstrips',
      supplier: 'Cosmeau',
      url: 'https://cosmeau.com/products/vaatwasstrips',
      scraper: RealCosmEauScraper,
      productSlug: 'cosmeau',
      site: 'vaatwasstrips',
    },
    {
      name: 'Bubblyfy Vaatwasstrips',
      supplier: 'Bubblyfy',
      url: 'https://www.bubblyfy.nl/products/vaatwasstrips',
      scraper: RealBubblyfyScraper,
      productSlug: 'bubblyfy',
      site: 'vaatwasstrips',
    },
    {
      name: 'Bio-Suds Vaatwasstrips',
      supplier: 'Bio-Suds',
      url: 'https://www.bio-suds.com/products/bio-suds-milieuvriendelijke-vaatwasstrips',
      scraper: RealBioSudsScraper,
      productSlug: 'bio-suds',
      site: 'vaatwasstrips',
    },
    {
      name: 'Wasstrip.nl Vaatwasstrips',
      supplier: 'Wasstrip.nl',
      url: 'https://wasstrip.nl/p/vaatwasstrips-80-wasbeurten/',
      scraper: RealWasstripNlScraper,
      productSlug: 'wasstrip-nl',
      site: 'vaatwasstrips',
    },
    {
      name: 'Natuwash Vaatwasstrips',
      supplier: 'Natuwash',
      url: 'https://natuwash.com/products/vaatwasstrips',
      scraper: RealNatuwashScraper,
      productSlug: 'natuwash',
      site: 'vaatwasstrips',
    },
    // === Wasstrips (laundry) targets ===
    {
      name: 'Cosmeau Wasstrips',
      supplier: 'Cosmeau',
      url: 'https://cosmeau.com/products/wasstrips',
      scraper: WasstripsCosmEauScraper,
      productSlug: 'cosmeau-wasstrips',
      site: 'wasstrips',
    },
    {
      name: "Mother's Earth Wasstrips",
      supplier: "Mother's Earth",
      url: 'https://nl.mothersearth.com/products/milieuvriendelijke-wasvellen-60',
      scraper: WasstripsMothersEarthScraper,
      productSlug: 'mothers-earth-wasstrips',
      site: 'wasstrips',
    },
    {
      name: 'Natuwash Wasstrips',
      supplier: 'Natuwash',
      url: 'https://natuwash.com/products/wasstrips',
      scraper: WasstripsNatuwashScraper,
      productSlug: 'natuwash-wasstrips',
      site: 'wasstrips',
    },
    {
      name: 'Bio-Suds Wasstrips',
      supplier: 'Bio-Suds',
      url: 'https://www.bio-suds.com/products/bio-suds-biologische-wasstrips',
      scraper: WasstripsBioSudsScraper,
      productSlug: 'bio-suds-wasstrips',
      site: 'wasstrips',
    },
    {
      name: 'Wasstrip.nl Wasstrips',
      supplier: 'Wasstrip.nl',
      url: 'https://wasstrip.nl/c/producten/',
      scraper: WasstripsWasstripNlScraper,
      productSlug: 'wasstrip-nl-wasstrips',
      site: 'wasstrips',
    },
    {
      name: 'HappySoaps Wasstrips',
      supplier: 'HappySoaps',
      url: 'https://nl.happysoaps.com/products/laundry-sheets-gekleurde-witte-was-35-stuks',
      scraper: WasstripsHappySoapsScraper,
      productSlug: 'happysoaps-wasstrips',
      site: 'wasstrips',
    },
  ];

  private async scrapeTarget(target: ScrapingTarget): Promise<ProductData & { slug: string }> {
    console.log(`📦 Scraping ${target.name} (${target.url})`);
    try {
      const scraper = new target.scraper();
      const productData = await scraper.scrapeProduct(target.url, target.name, target.supplier);
      const result = { ...productData, slug: target.productSlug };
      console.log(`✅ ${target.name} — €${productData.price.price}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed: ${target.name}`, error);
      return {
        name: target.name,
        supplier: target.supplier,
        url: target.url,
        variants: [],
        price: { price: 0, pricePerWash: 0, currency: 'EUR', scrapedAt: new Date() },
        inStock: false,
        reviews: [],
        scrapedAt: new Date(),
        slug: target.productSlug,
      };
    }
  }

  async scrapeAllProducts(): Promise<ProductData[]> {
    console.log(`🚀 Starting parallel scrape of ${this.targets.length} products...`);

    const settled = await Promise.allSettled(
      this.targets.map(target => this.scrapeTarget(target))
    );

    const results = settled.map(r => (r.status === 'fulfilled' ? r.value : null)).filter(Boolean) as ProductData[];

    console.log(`🎉 Scraping completed! ${results.length} products processed.`);
    return results;
  }

  async scrapeBySupplier(supplier: string): Promise<ProductData[]> {
    const supplierTargets = this.targets.filter(
      t => t.supplier.toLowerCase() === supplier.toLowerCase()
    );
    console.log(`🎯 Scraping ${supplierTargets.length} products for ${supplier}...`);
    const settled = await Promise.allSettled(supplierTargets.map(t => this.scrapeTarget(t)));
    return settled.map(r => (r.status === 'fulfilled' ? r.value : null)).filter(Boolean) as ProductData[];
  }

  async scrapeBySite(site: SiteKey): Promise<ProductData[]> {
    const siteTargets = this.targets.filter(t => t.site === site);
    console.log(`🎯 Scraping ${siteTargets.length} products for site: ${site}...`);
    const settled = await Promise.allSettled(siteTargets.map(t => this.scrapeTarget(t)));
    return settled.map(r => (r.status === 'fulfilled' ? r.value : null)).filter(Boolean) as ProductData[];
  }

  // Method to get all configured targets (useful for admin)
  getTargets(): ScrapingTarget[] {
    return this.targets.map(t => ({
      name: t.name,
      supplier: t.supplier,
      url: t.url,
      scraper: t.scraper.name,
      productSlug: t.productSlug,
      site: t.site,
    }));
  }
}