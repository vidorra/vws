import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Mock data for now - will be replaced with database queries
const mockProducts = [
  {
    id: '1',
    name: 'Wasstrips Original',
    supplier: "Mother's Earth",
    price: 14.95,
    pricePerWash: 0.25,
    inStock: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Eco Wasstrips',
    supplier: 'Cosmeau',
    price: 12.99,
    pricePerWash: 0.22,
    inStock: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Wasstrips Fresh',
    supplier: 'Bubblyfy',
    price: 13.50,
    pricePerWash: 0.23,
    inStock: false,
    lastUpdated: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
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

    // In production, this would fetch from database
    const dashboardData = {
      products: mockProducts,
      lastScrape: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      totalProducts: mockProducts.length,
      inStockCount: mockProducts.filter(p => p.inStock).length,
      outOfStockCount: mockProducts.filter(p => !p.inStock).length
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}