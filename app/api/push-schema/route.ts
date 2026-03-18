import { NextResponse } from 'next/server';
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

    // Run prisma db push
    const { stdout, stderr } = await execAsync('npx prisma db push --skip-generate');
    
    return NextResponse.json({ 
      success: true,
      message: 'Schema pushed successfully',
      output: stdout,
      errors: stderr
    });
  } catch (error: any) {
    console.error('Schema push error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}