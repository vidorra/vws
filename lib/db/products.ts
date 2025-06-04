import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Get all products with optional filtering
export async function getProducts(options?: {
  inStock?: boolean;
  supplier?: string;
  minPrice?: number;
  maxPrice?: number;
  orderBy?: 'price' | 'rating' | 'name' | 'pricePerWash';
  order?: 'asc' | 'desc';
}) {
  const where: any = {};
  
  if (options?.inStock !== undefined) {
    where.inStock = options.inStock;
  }
  
  if (options?.supplier) {
    where.supplier = options.supplier;
  }
  
  if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
    where.currentPrice = {};
    if (options.minPrice !== undefined) {
      where.currentPrice.gte = options.minPrice;
    }
    if (options.maxPrice !== undefined) {
      where.currentPrice.lte = options.maxPrice;
    }
  }
  
  const orderBy: any = {};
  if (options?.orderBy) {
    let field: string;
    switch (options.orderBy) {
      case 'price':
        field = 'currentPrice';
        break;
      case 'pricePerWash':
        field = 'pricePerWash';
        break;
      default:
        field = options.orderBy;
    }
    orderBy[field] = options.order || 'asc';
  }
  
  return prisma.product.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: { reviews: true }
      }
    }
  });
}

// Get a single product by slug
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      priceHistory: {
        orderBy: { recordedAt: 'desc' },
        take: 30 // Last 30 price records
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10 // Latest 10 reviews
      }
    }
  });
}

// Create or update a product
export async function upsertProduct(data: {
  slug: string;
  name: string;
  supplier: string;
  currentPrice?: number;
  pricePerWash?: number;
  washesPerPack?: number;
  inStock?: boolean;
  description?: string;
  longDescription?: string;
  url?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  sustainability?: number;
  features?: string[];
  pros?: string[];
  cons?: string[];
  availability?: string;
}) {
  const product = await prisma.product.upsert({
    where: { slug: data.slug },
    update: {
      ...data,
      lastChecked: new Date()
    },
    create: data
  });
  
  // If price changed, add to price history
  if (data.currentPrice !== undefined) {
    const lastPrice = await prisma.priceHistory.findFirst({
      where: { productId: product.id },
      orderBy: { recordedAt: 'desc' }
    });
    
    if (!lastPrice || lastPrice.price !== data.currentPrice) {
      await prisma.priceHistory.create({
        data: {
          productId: product.id,
          price: data.currentPrice,
          pricePerWash: data.pricePerWash || data.currentPrice / (data.washesPerPack || 60)
        }
      });
    }
  }
  
  return product;
}

// Get products by category
export async function getProductsByCategory(category: 'goedkoopste' | 'beste-waarde' | 'premium') {
  switch (category) {
    case 'goedkoopste':
      return prisma.product.findMany({
        where: {
          inStock: true,
          currentPrice: { not: null }
        },
        orderBy: { pricePerWash: 'asc' },
        take: 10
      });
      
    case 'beste-waarde':
      // Products with good balance of price and rating
      return prisma.product.findMany({
        where: {
          inStock: true,
          rating: { gte: 4.0 },
          pricePerWash: { lte: 0.25 }
        },
        orderBy: [
          { rating: 'desc' },
          { pricePerWash: 'asc' }
        ]
      });
      
    case 'premium':
      return prisma.product.findMany({
        where: {
          inStock: true,
          sustainability: { gte: 8.5 }
        },
        orderBy: [
          { sustainability: 'desc' },
          { rating: 'desc' }
        ]
      });
      
    default:
      return [];
  }
}

// Get price history for a product
export async function getProductPriceHistory(productId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return prisma.priceHistory.findMany({
    where: {
      productId,
      recordedAt: { gte: startDate }
    },
    orderBy: { recordedAt: 'asc' }
  });
}

// Update product stock status
export async function updateProductStock(slug: string, inStock: boolean) {
  return prisma.product.update({
    where: { slug },
    data: {
      inStock,
      lastChecked: new Date()
    }
  });
}

// Get products that need scraping (not checked in last 24 hours)
export async function getProductsForScraping() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return prisma.product.findMany({
    where: {
      lastChecked: { lt: yesterday }
    },
    orderBy: { lastChecked: 'asc' }
  });
}

// Search products
export async function searchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { supplier: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }
  });
}

// Get product statistics
export async function getProductStats() {
  const [totalProducts, inStockCount, avgPrice, avgRating] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { inStock: true } }),
    prisma.product.aggregate({
      _avg: { currentPrice: true }
    }),
    prisma.product.aggregate({
      _avg: { rating: true }
    })
  ]);
  
  return {
    totalProducts,
    inStockCount,
    outOfStockCount: totalProducts - inStockCount,
    averagePrice: avgPrice._avg.currentPrice || 0,
    averageRating: avgRating._avg.rating || 0
  };
}

// Get trending products (most price changes in last 7 days)
export async function getTrendingProducts() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const trending = await prisma.priceHistory.groupBy({
    by: ['productId'],
    where: {
      recordedAt: { gte: weekAgo }
    },
    _count: {
      productId: true
    },
    orderBy: {
      _count: {
        productId: 'desc'
      }
    },
    take: 5
  });
  
  const productIds = trending.map((t: any) => t.productId);
  
  return prisma.product.findMany({
    where: {
      id: { in: productIds }
    }
  });
}

// Get products with recent price drops
export async function getProductsWithPriceDrops() {
  const products = await prisma.product.findMany({
    include: {
      priceHistory: {
        orderBy: { recordedAt: 'desc' },
        take: 2
      }
    }
  });
  
  return products.filter((product: any) => {
    if (product.priceHistory.length < 2) return false;
    const [current, previous] = product.priceHistory;
    return current.price < previous.price;
  }).map((product: any) => ({
    ...product,
    priceDrop: product.priceHistory[1].price - product.priceHistory[0].price,
    priceDropPercentage: ((product.priceHistory[1].price - product.priceHistory[0].price) / product.priceHistory[1].price) * 100
  }));
}