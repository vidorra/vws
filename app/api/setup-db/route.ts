import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execAsync = promisify(exec);

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

    // Write SQL to a temporary file
    const tempFile = '/tmp/import.sql';
    await fs.writeFile(tempFile, sql);

    // Import using psql command
    const dbUrl = process.env.DATABASE_URL;
    const { stdout, stderr } = await execAsync(`psql "${dbUrl}" < ${tempFile}`);
    
    // Clean up temp file
    await fs.unlink(tempFile);

    return NextResponse.json({ 
      success: true,
      message: 'Database imported successfully',
      output: stdout,
      errors: stderr 
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