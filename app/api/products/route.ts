import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { SiteKey } from '@/lib/site-config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ids = searchParams.get('ids');
    const site = (searchParams.get('site') ?? 'vaatwasstrips') as SiteKey;

    // If no IDs provided, return all products for the site (used by productfinder)
    if (!ids) {
      const products = await prisma.product.findMany({
        where: { site },
        include: {
          variants: { orderBy: { pricePerWash: 'asc' } },
        },
        orderBy: [{ displayOrder: 'asc' }, { currentPrice: 'asc' }],
      });

      return NextResponse.json({ products });
    }

    const productIds = ids.split(',').filter(Boolean);

    if (productIds.length === 0) {
      return NextResponse.json({
        error: 'No valid product IDs provided'
      }, { status: 400 });
    }

    // Fetch products with their variants, filtered by site
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        site,
      },
      include: {
        variants: {
          orderBy: {
            pricePerWash: 'asc'
          }
        }
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });

    // Ensure products are returned in the same order as requested
    const orderedProducts = productIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);

    return NextResponse.json({
      products: orderedProducts
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
}
