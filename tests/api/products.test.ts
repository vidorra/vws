import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import { GET } from '@/app/api/products/route';
import { NextRequest } from 'next/server';

const mockFindMany = vi.mocked(prisma.product.findMany);

function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'));
}

describe('GET /api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns all products when no IDs provided', async () => {
    const mockProducts = [
      { id: '1', name: 'Product A', site: 'vaatwasstrips', variants: [] },
      { id: '2', name: 'Product B', site: 'vaatwasstrips', variants: [] },
    ];
    mockFindMany.mockResolvedValue(mockProducts as any);

    const response = await GET(createRequest('/api/products?site=vaatwasstrips'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.products).toHaveLength(2);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { site: 'vaatwasstrips' },
      })
    );
  });

  it('filters by site parameter', async () => {
    mockFindMany.mockResolvedValue([]);

    await GET(createRequest('/api/products?site=wasstrips'));

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { site: 'wasstrips' },
      })
    );
  });

  it('defaults to vaatwasstrips when no site param', async () => {
    mockFindMany.mockResolvedValue([]);

    await GET(createRequest('/api/products'));

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { site: 'vaatwasstrips' },
      })
    );
  });

  it('returns products by IDs when IDs provided', async () => {
    const mockProducts = [
      { id: 'abc', name: 'Product A', variants: [] },
    ];
    mockFindMany.mockResolvedValue(mockProducts as any);

    const response = await GET(createRequest('/api/products?ids=abc,def&site=vaatwasstrips'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: { in: ['abc', 'def'] },
          site: 'vaatwasstrips',
        },
      })
    );
  });

  it('returns all products when IDs param is empty string', async () => {
    mockFindMany.mockResolvedValue([]);

    const response = await GET(createRequest('/api/products?ids=&site=vaatwasstrips'));
    const data = await response.json();

    // Empty string is falsy, so falls through to "return all products" branch
    expect(response.status).toBe(200);
    expect(data.products).toBeDefined();
  });

  it('returns 500 on database error', async () => {
    mockFindMany.mockRejectedValue(new Error('Connection refused'));

    const response = await GET(createRequest('/api/products?site=vaatwasstrips'));

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch products');
  });
});
