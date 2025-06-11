import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db-connection';

export async function GET() {
  let dbStatus = 'unknown';
  let dbError = null;
  
  try {
    const isConnected = await checkDatabaseConnection();
    dbStatus = isConnected ? 'connected' : 'disconnected';
  } catch (error: any) {
    dbStatus = 'error';
    dbError = error.message;
  }
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      error: dbError,
      hasUrl: !!process.env.DATABASE_URL
    },
    env: {
      nodeEnv: process.env.NODE_ENV
    }
  });
}