import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import { safeDbQuery, getProductsSafe, getBrandsSafe, invalidateCache } from '@/lib/db-safe';

const mockFindMany = vi.mocked(prisma.product.findMany);

describe('safeDbQuery', () => {
  it('returns query result on success', async () => {
    const result = await safeDbQuery(async () => 'success', 'fallback');
    expect(result).toBe('success');
  });

  it('returns fallback on error', async () => {
    const result = await safeDbQuery(
      async () => { throw new Error('DB error'); },
      'fallback'
    );
    expect(result).toBe('fallback');
  });

  it('returns typed fallback array on error', async () => {
    const result = await safeDbQuery(
      async () => { throw new Error('DB error'); },
      [] as string[]
    );
    expect(result).toEqual([]);
  });
});

describe('getProductsSafe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    invalidateCache(); // clear between tests
  });

  it('returns products from DB', async () => {
    const mockProducts = [{ id: '1', name: 'Test Product', variants: [] }];
    mockFindMany.mockResolvedValue(mockProducts as never);

    const result = await getProductsSafe();
    expect(result).toEqual(mockProducts);
    expect(mockFindMany).toHaveBeenCalledOnce();
  });

  it('returns cached result on second call', async () => {
    const mockProducts = [{ id: '1', name: 'Cached Product', variants: [] }];
    mockFindMany.mockResolvedValue(mockProducts as never);

    await getProductsSafe();
    await getProductsSafe(); // second call should hit cache

    expect(mockFindMany).toHaveBeenCalledOnce(); // DB only queried once
  });

  it('returns empty array on DB error', async () => {
    mockFindMany.mockRejectedValue(new Error('Connection refused'));
    const result = await getProductsSafe();
    expect(result).toEqual([]);
  });
});

describe('getBrandsSafe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    invalidateCache();
  });

  it('returns brand names from products', async () => {
    mockFindMany.mockResolvedValue([
      { supplier: 'Cosmeau' },
      { supplier: 'Bubblyfy' },
    ] as never);

    const result = await getBrandsSafe();
    expect(result).toEqual(['Cosmeau', 'Bubblyfy']);
  });

  it('returns cached brands on second call', async () => {
    mockFindMany.mockResolvedValue([{ supplier: 'Cosmeau' }] as never);

    await getBrandsSafe();
    await getBrandsSafe();

    expect(mockFindMany).toHaveBeenCalledOnce();
  });

  it('returns empty array on DB error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB error'));
    const result = await getBrandsSafe();
    expect(result).toEqual([]);
  });
});

describe('invalidateCache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    invalidateCache();
  });

  it('clears specific cache key', async () => {
    mockFindMany.mockResolvedValue([] as never);
    await getProductsSafe(); // populate cache with key 'products_vaatwasstrips'
    invalidateCache('products_vaatwasstrips');
    await getProductsSafe(); // should hit DB again
    expect(mockFindMany).toHaveBeenCalledTimes(2);
  });

  it('clears all cache when called without key', async () => {
    mockFindMany.mockResolvedValue([] as never);
    await getProductsSafe();
    invalidateCache();
    await getProductsSafe();
    expect(mockFindMany).toHaveBeenCalledTimes(2);
  });
});
