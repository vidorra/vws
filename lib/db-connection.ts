import { PrismaClient } from '@prisma/client';
import prisma from './prisma';

// Wrapper function to execute database operations with retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a connection error
      if (
        error.code === 'P2024' || // "A connection pool timeout occurred"
        error.code === 'P2025' || // "An operation failed because it depends on one or more records that were required but not found"
        error.message?.includes('Connection') ||
        error.message?.includes('Socket') ||
        error.message?.includes('ECONNRESET')
      ) {
        console.error(`Database connection error (attempt ${i + 1}/${maxRetries}):`, error.message);
        
        if (i < maxRetries - 1) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          
          // Try to reconnect
          try {
            await prisma.$disconnect();
            await prisma.$connect();
          } catch (reconnectError) {
            console.error('Failed to reconnect:', reconnectError);
          }
        }
      } else {
        // If it's not a connection error, throw immediately
        throw error;
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}

// Health check function for database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Ensure clean shutdown
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
}