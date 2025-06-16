import { NextRequest, NextResponse } from 'next/server';
import { ScrapingCoordinator } from '@/lib/scrapers/scraping-coordinator';
import { prisma } from '@/lib/prisma';
import { upsertProduct } from '@/lib/db/products';

export async function GET(request: NextRequest) {
  // Verify DB management secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const dbManagementSecret = process.env.DB_MANAGEMENT_SECRET;
  
  if (!dbManagementSecret || authHeader !== `Bearer ${dbManagementSecret}`) {
    console.log('❌ Unauthorized cron request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  console.log('🔄 Starting scheduled scraping...');
  
  try {
    const coordinator = new ScrapingCoordinator();
    const results = await coordinator.scrapeAllProducts();
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const productData of results) {
      try {
        if (productData.price.price > 0) {
          await upsertProduct({
            slug: (productData as any).slug,
            name: productData.name,
            supplier: productData.supplier,
            currentPrice: productData.price.price,
            pricePerWash: productData.price.pricePerWash,
            inStock: productData.inStock
          });
          successCount++;
        } else {
          failureCount++;
        }
      } catch (error) {
        console.error(`Failed to update ${productData.name}:`, error);
        failureCount++;
      }
    }
    
    console.log(`✅ Scheduled scraping completed: ${successCount}/${results.length} successful`);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      }
    });
    
  } catch (error) {
    console.error('❌ Scheduled scraping failed:', error);
    return NextResponse.json(
      { error: 'Scraping failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}