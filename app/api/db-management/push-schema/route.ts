import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// This endpoint is for database schema management
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

    // Push schema to database using the installed Prisma version
    const { stdout, stderr } = await execAsync('./node_modules/.bin/prisma db push --skip-generate');
    
    if (stderr && !stderr.includes('already in sync')) {
      console.error('Schema push stderr:', stderr);
      return NextResponse.json(
        { error: 'Schema push failed', details: stderr },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Schema pushed successfully',
      output: stdout
    });
  } catch (error) {
    console.error('Schema push error:', error);
    return NextResponse.json(
      { error: 'Failed to push schema', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}