import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ScrapingCoordinator } from '@/lib/scrapers/scraping-coordinator';

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize scraping coordinator
    const coordinator = new ScrapingCoordinator();
    
    // Start scraping
    console.log('Starting manual scrape...');
    const results = await coordinator.scrapeAllProducts();
    
    // In production, this would save to database
    // For now, we'll just return the results
    const scrapingResults = {
      success: true,
      timestamp: new Date().toISOString(),
      productsScraped: results.length,
      results: results.map(product => ({
        name: product.name,
        supplier: product.supplier,
        price: product.price.price,
        pricePerWash: product.price.pricePerWash,
        inStock: product.inStock,
        reviewCount: product.reviews?.length || 0
      }))
    };

    console.log(`Scraping completed. ${results.length} products scraped.`);
    
    return NextResponse.json(scrapingResults);
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { 
        error: 'Scraping failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}