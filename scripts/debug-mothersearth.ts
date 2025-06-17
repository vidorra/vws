import { RealMothersEarthScraper } from '../lib/scrapers/real-mothersearth-scraper';

async function debugMothersEarth() {
  console.log('🔍 Debugging Mother\'s Earth scraper\n');
  
  const scraper = new RealMothersEarthScraper();
  const url = 'https://nl.mothersearth.com/products/dishwasher-sheet?variant=50107168784722';
  
  try {
    console.log('Scraping variants from:', url);
    const variants = await scraper.scrapeVariants(url);
    
    console.log(`\nFound ${variants.length} variants:`);
    variants.forEach((variant, index) => {
      console.log(`\nVariant ${index + 1}:`);
      console.log(`- Name: ${variant.name}`);
      console.log(`- Washes: ${variant.washCount}`);
      console.log(`- Price: €${variant.price}`);
      console.log(`- Per wash: €${variant.pricePerWash.toFixed(3)}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugMothersEarth().catch(console.error);