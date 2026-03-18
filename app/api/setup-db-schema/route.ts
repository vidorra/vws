import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: Request) {
  try {
    // Check for secret key
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== 'setup-secret-vws-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Test database connection
    await prisma.$connect();
    
    // Run the seed function
    const { main } = await import('@/prisma/seed');
    await main();
    
    // Get count of products
    const productCount = await prisma.product.count();
    
    return NextResponse.json({ 
      success: true,
      message: 'Database seeded successfully',
      productCount
    });
  } catch (error: any) {
    console.error('Database setup error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}