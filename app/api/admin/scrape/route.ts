import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ScrapingCoordinator } from '@/lib/scrapers/scraping-coordinator';
import { prisma } from '@/lib/prisma';
import { upsertProduct } from '@/lib/db/products';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Create scraping log
    const scrapingLog = await prisma.scrapingLog.create({
      data: {
        supplier: 'all',
        status: 'running',
        message: 'Manual scraping started'
      }
    });
    
    try {
      // Initialize scraping coordinator
      const coordinator = new ScrapingCoordinator();
      const results = await coordinator.scrapeAllProducts();
      
      // Process results and update database
      let successCount = 0;
      let failureCount = 0;
      
      for (const productData of results) {
        const productSlug = (productData as any).slug;
        
        try {
          if (productData.price.price === 0) {
            throw new Error(`No valid price found - URL: ${productData.url}`);
          }
          
          // Update product in database
          await upsertProduct({
            slug: productSlug,
            name: productData.name,
            supplier: productData.supplier,
            currentPrice: productData.price.price,
            pricePerWash: productData.price.pricePerWash,
            inStock: productData.inStock,
            url: productData.url || undefined,
            reviewCount: productData.reviews?.length || 0
          });
          
          successCount++;
          
          // Log individual product scrape with URL
          await prisma.scrapingLog.create({
            data: {
              supplier: productData.supplier,
              status: 'success',
              message: `Price: €${productData.price.price} - URL: ${productData.url}`,
              newPrice: productData.price.price,
              completedAt: new Date()
            }
          });
        } catch (error) {
          console.error(`Failed to update product ${productData.name}:`, error);
          console.error(`Product URL: ${productData.url}`);
          failureCount++;
          
          // Log failure with URL
          const errorMessage = error instanceof Error ? error.message : 'Database update failed';
          await prisma.scrapingLog.create({
            data: {
              supplier: productData.supplier,
              status: 'failed',
              message: `${errorMessage} - URL: ${productData.url}`,
              completedAt: new Date()
            }
          });
        }
      }
      
      // Update main scraping log
      await prisma.scrapingLog.update({
        where: { id: scrapingLog.id },
        data: {
          status: failureCount === 0 ? 'success' : 'partial',
          message: `Scraped ${successCount} products successfully, ${failureCount} failed`,
          completedAt: new Date(),
          duration: Date.now() - scrapingLog.startedAt.getTime()
        }
      });
      
      return NextResponse.json({
        success: true,
        results: {
          total: results.length,
          successful: successCount,
          failed: failureCount,
          products: results.map(p => ({
            name: p.name,
            supplier: p.supplier,
            price: p.price.price,
            inStock: p.inStock
          }))
        }
      });
      
    } catch (error) {
      // Update scraping log with error
      await prisma.scrapingLog.update({
        where: { id: scrapingLog.id },
        data: {
          status: 'failed',
          message: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date()
        }
      });
      
      throw error;
    }
    
  } catch (error) {
    console.error('Scraping API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scraping failed' },
      { status: 500 }
    );
  }
}