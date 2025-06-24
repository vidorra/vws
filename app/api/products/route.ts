import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json({ 
        error: 'No product IDs provided' 
      }, { status: 400 });
    }
    
    const productIds = ids.split(',').filter(Boolean);
    
    if (productIds.length === 0) {
      return NextResponse.json({ 
        error: 'No valid product IDs provided' 
      }, { status: 400 });
    }
    
    // Fetch products with their variants
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
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