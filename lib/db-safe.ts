import { prisma } from './prisma';

export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    console.error('Database query error:', error);
    return fallback;
  }
}

export async function getProductsSafe() {
  return safeDbQuery(
    async () => {
      return await prisma.product.findMany({
        orderBy: { currentPrice: 'asc' },
      });
    },
    []
  );
}

export async function getBrandsSafe() {
  return safeDbQuery(
    async () => {
      const products = await prisma.product.findMany({
        select: { supplier: true },
        distinct: ['supplier'],
        orderBy: { supplier: 'asc' },
      });
      return products.map((p: { supplier: string }) => p.supplier);
    },
    []
  );
}