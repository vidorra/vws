import { NextRequest, NextResponse } from 'next/server';
import { ScrapingCoordinator } from '@/lib/scrapers/scraping-coordinator';
import { prisma } from '@/lib/prisma';
import { upsertProductWithVariants } from '@/lib/db/variants';

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
      const productSlug = (productData as any).slug;
      
      try {
        if (productData.variants.length === 0) {
          throw new Error(`No variants found for ${productData.name}`);
        }
        
        // Update product with all variants
        await upsertProductWithVariants({
          slug: productSlug,
          name: productData.name,
          supplier: productData.supplier,
          variants: productData.variants,
          url: productData.url || undefined,
          inStock: productData.inStock,
          lastChecked: new Date()
        });
        
        successCount++;
        
        // Log variant details
        const variantInfo = productData.variants.map(v =>
          `${v.washCount}x@€${v.price.toFixed(2)}`
        ).join(', ');
        
        console.log(`✅ ${productData.name}: ${variantInfo}`);
        
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