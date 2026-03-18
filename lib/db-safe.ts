import { prisma } from './prisma';
import { logger } from './logger';
import { CACHE_TTL_MS } from './constants';
import type { SiteKey } from './site-config';

export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    logger.error('Database query error', error instanceof Error ? error : new Error(String(error)));
    return fallback;
  }
}

// Simple TTL cache for server-side use (per Node.js process)
const cache = new Map<string, { data: unknown; expiresAt: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) return null;
  return entry.data as T;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export function invalidateCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}

async function fetchProducts(site: SiteKey) {
  return safeDbQuery(
    () => prisma.product.findMany({
      where: { site },
      orderBy: [{ displayOrder: 'asc' }, { currentPrice: 'asc' }],
      include: { variants: { orderBy: { washCount: 'asc' } } },
    }),
    []
  );
}

export async function getProductsSafe(site: SiteKey = 'vaatwasstrips') {
  const cacheKey = `products_${site}`;
  const cached = getCached<Awaited<ReturnType<typeof fetchProducts>>>(cacheKey);
  if (cached) return cached;
  const data = await fetchProducts(site);
  setCached(cacheKey, data);
  return data;
}

export async function getBrandsSafe(site: SiteKey = 'vaatwasstrips') {
  const cacheKey = `brands_${site}`;
  const cached = getCached<string[]>(cacheKey);
  if (cached) return cached;

  const data = await safeDbQuery(
    async () => {
      const products = await prisma.product.findMany({
        where: { site },
        select: { supplier: true },
        distinct: ['supplier'],
        orderBy: { supplier: 'asc' },
      });
      return products.map((p: { supplier: string }) => p.supplier);
    },
    []
  );

  setCached(cacheKey, data);
  return data;
}
