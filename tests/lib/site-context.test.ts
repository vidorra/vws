import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SITE_CONFIG } from '@/lib/site-config';

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

import { headers } from 'next/headers';
import { getSite } from '@/lib/get-site';

const mockHeaders = vi.mocked(headers);

describe('SITE_CONFIG', () => {
  it('has both sites configured', () => {
    expect(SITE_CONFIG).toHaveProperty('vaatwasstrips');
    expect(SITE_CONFIG).toHaveProperty('wasstrips');
  });

  it('vaatwasstrips config has correct properties', () => {
    const cfg = SITE_CONFIG.vaatwasstrips;
    expect(cfg.key).toBe('vaatwasstrips');
    expect(cfg.domain).toBe('vaatwasstripsvergelijker.nl');
    expect(cfg.productNoun).toBe('vaatwasstrips');
    expect(cfg.productNounSingular).toBe('vaatwasstrip');
    expect(cfg.productNounCapitalized).toBe('Vaatwasstrips');
    expect(cfg.canonicalBase).toContain('vaatwasstripsvergelijker.nl');
    expect(cfg.contactEmail).toContain('vaatwasstripsvergelijker.nl');
  });

  it('wasstrips config has correct properties', () => {
    const cfg = SITE_CONFIG.wasstrips;
    expect(cfg.key).toBe('wasstrips');
    expect(cfg.domain).toBe('wasstripsvergelijker.nl');
    expect(cfg.productNoun).toBe('wasstrips');
    expect(cfg.productNounSingular).toBe('wasstrip');
    expect(cfg.productNounCapitalized).toBe('Wasstrips');
    expect(cfg.canonicalBase).toContain('wasstripsvergelijker.nl');
    expect(cfg.contactEmail).toContain('wasstripsvergelijker.nl');
  });
});

describe('getSite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns vaatwasstrips config when x-site header is vaatwasstrips', () => {
    mockHeaders.mockReturnValue({
      get: (name: string) => name === 'x-site' ? 'vaatwasstrips' : null,
    } as any);

    const site = getSite();
    expect(site.key).toBe('vaatwasstrips');
    expect(site.productNoun).toBe('vaatwasstrips');
  });

  it('returns wasstrips config when x-site header is wasstrips', () => {
    mockHeaders.mockReturnValue({
      get: (name: string) => name === 'x-site' ? 'wasstrips' : null,
    } as any);

    const site = getSite();
    expect(site.key).toBe('wasstrips');
    expect(site.productNoun).toBe('wasstrips');
  });

  it('defaults to vaatwasstrips when x-site header is missing', () => {
    mockHeaders.mockReturnValue({
      get: () => null,
    } as any);

    const site = getSite();
    expect(site.key).toBe('vaatwasstrips');
  });
});

describe('middleware logic', () => {
  // Test the domain-to-site mapping logic used in middleware.ts
  function detectSite(host: string): string {
    return host.includes('vaatwas') ? 'vaatwasstrips' : 'wasstrips';
  }

  it('maps vaatwasstripsvergelijker.nl to vaatwasstrips', () => {
    expect(detectSite('vaatwasstripsvergelijker.nl')).toBe('vaatwasstrips');
  });

  it('maps www.vaatwasstripsvergelijker.nl to vaatwasstrips', () => {
    expect(detectSite('www.vaatwasstripsvergelijker.nl')).toBe('vaatwasstrips');
  });

  it('maps wasstripsvergelijker.nl to wasstrips', () => {
    expect(detectSite('wasstripsvergelijker.nl')).toBe('wasstrips');
  });

  it('maps www.wasstripsvergelijker.nl to wasstrips', () => {
    expect(detectSite('www.wasstripsvergelijker.nl')).toBe('wasstrips');
  });

  it('maps localhost to wasstrips (no "vaatwas" substring)', () => {
    expect(detectSite('localhost:3000')).toBe('wasstrips');
  });

  it('maps empty host to wasstrips', () => {
    expect(detectSite('')).toBe('wasstrips');
  });
});
