import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getProductStats } from '@/lib/db/products';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get products from database with variants
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { reviews: true }
        },
        variants: {
          orderBy: { washCount: 'asc' }
        }
      }
    });
    
    // Get statistics
    const stats = await getProductStats();
    
    // Get last scrape time
    const lastScrape = await prisma.scrapingLog.findFirst({
      where: { status: 'success' },
      orderBy: { completedAt: 'desc' },
      select: { completedAt: true }
    });
    
    // Format products for dashboard - include all fields needed for editing
    const formattedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      supplier: product.supplier,
      price: product.currentPrice,
      currentPrice: product.currentPrice,
      pricePerWash: product.pricePerWash,
      washesPerPack: product.washesPerPack,
      inStock: product.inStock,
      lastUpdated: product.lastChecked,
      url: product.url,
      description: product.description,
      features: product.features,
      pros: product.pros,
      cons: product.cons,
      sustainability: product.sustainability,
      rating: product.rating,
      reviewCount: product._count?.reviews || 0,
      variants: product.variants || []
    }));
    
    return NextResponse.json({
      products: formattedProducts,
      lastScrape: lastScrape?.completedAt || null,
      stats: {
        totalProducts: stats.totalProducts,
        inStock: stats.inStockCount,
        outOfStock: stats.outOfStockCount,
        averagePrice: stats.averagePrice
      }
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}