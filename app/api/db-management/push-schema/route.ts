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

    // Push schema to database - try multiple approaches
    let result: { stdout: string; stderr: string } | null = null;
    let lastError: Error | null = null;
    
    // Try different approaches to run prisma
    const commands = [
      'npx prisma@5.22.0 db push --skip-generate',
      'npx prisma db push --skip-generate',
      'prisma db push --skip-generate',
      './node_modules/.bin/prisma db push --skip-generate || npx prisma db push --skip-generate'
    ];
    
    for (const command of commands) {
      try {
        console.log(`Trying command: ${command}`);
        result = await execAsync(command);
        
        // If we get here, the command succeeded
        if (result.stderr && !result.stderr.includes('already in sync')) {
          console.warn('Schema push stderr:', result.stderr);
        }
        
        break; // Success, exit the loop
      } catch (error) {
        console.error(`Command failed: ${command}`, error);
        lastError = error as Error;
        // Continue to next command
      }
    }
    
    if (!result && lastError) {
      throw lastError;
    }
    
    if (!result) {
      throw new Error('All prisma commands failed');
    }

    return NextResponse.json({
      success: true,
      message: 'Schema pushed successfully',
      output: result.stdout,
      stderr: result.stderr
    });
  } catch (error) {
    console.error('Schema push error:', error);
    return NextResponse.json(
      { error: 'Failed to push schema', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}