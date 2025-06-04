import { NextRequest, NextResponse } from 'next/server';
import { main as seedDatabase } from '@/prisma/seed';

// This endpoint is for database seeding
// It should be protected and only used by administrators
export async function POST(request: NextRequest) {
  try {
    // Check for admin secret in headers for additional security
    const authHeader = request.headers.get('x-admin-secret');
    const expectedSecret = process.env.DB_MANAGEMENT_SECRET;
    
    if (!expectedSecret || authHeader !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Run the seed function
    const productCount = await seedDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      productCount
    });
  } catch (error) {
    console.error('Database seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}