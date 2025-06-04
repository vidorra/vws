import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Check for secret key
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== 'setup-secret-vws-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the SQL content from the request body
    const { sql } = await request.json();
    
    if (!sql) {
      return NextResponse.json({ error: 'No SQL content provided' }, { status: 400 });
    }

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errors: string[] = [];

    // Execute each statement
    for (const statement of statements) {
      try {
        // Skip certain PostgreSQL-specific commands that Prisma doesn't support
        if (
          statement.toUpperCase().startsWith('SET ') ||
          statement.toUpperCase().startsWith('SELECT PG_') ||
          statement.toUpperCase().startsWith('ALTER SEQUENCE') ||
          statement.toUpperCase().startsWith('CREATE SEQUENCE') ||
          statement.toUpperCase().startsWith('DROP SEQUENCE')
        ) {
          continue;
        }

        // Execute the SQL statement
        await prisma.$executeRawUnsafe(statement);
        successCount++;
      } catch (error: any) {
        // Log but don't fail on individual statement errors
        errors.push(`Statement error: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Database import completed. ${successCount} statements executed successfully.`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Database import error:', error);
    return NextResponse.json({
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}

// DELETE THIS ENDPOINT AFTER USE!
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== 'setup-secret-vws-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ 
    message: 'Database setup endpoint ready. POST your SQL backup content to import.',
    usage: 'POST /api/setup-db?secret=setup-secret-vws-2024 with body: { "sql": "your sql content" }'
  });
}