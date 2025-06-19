import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Run raw SQL to add the column
    await prisma.$executeRaw`
      ALTER TABLE "Product" 
      ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 999
    `;
    
    // Update display orders
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 1 WHERE "supplier" = 'Natuwash'`;
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 2 WHERE "supplier" = 'Wasstrip.nl'`;
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 3 WHERE "supplier" = 'Bio-Suds'`;
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 4 WHERE "supplier" = 'Bubblyfy'`;
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 5 WHERE "supplier" = 'Cosmeau'`;
    await prisma.$executeRaw`UPDATE "Product" SET "displayOrder" = 6 WHERE "supplier" = 'Mother''s Earth'`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database fixed successfully - displayOrder column added and values set' 
    });
  } catch (error: any) {
    console.error('Database fix error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}