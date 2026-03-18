/** JWT token expiry duration */
export const JWT_EXPIRY = '24h';

/** Bcrypt salt rounds for password hashing */
export const BCRYPT_ROUNDS = 10;

/** In-memory cache TTL for product/brands queries (milliseconds) */
export const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Rate limiting: max login attempts per window */
export const LOGIN_RATE_LIMIT = 5;

/** Rate limiting: time window for login attempts (milliseconds) */
export const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/** ISR revalidation interval for product pages (seconds) */
export const PAGE_REVALIDATE_SECONDS = 300; // 5 minutes

/**
 * @deprecated Use `getSite().canonicalBase` instead for multi-site support.
 * Kept temporarily for files not yet migrated.
 */
export const BASE_URL = 'https://vaatwasstripsvergelijker.nl';

/** Known vaatwasstrips product slugs — sitemap fallback when DB is unreachable */
export const KNOWN_PRODUCT_SLUGS_VAATWASSTRIPS = [
  'mothers-earth',
  'cosmeau',
  'bubblyfy',
  'bio-suds',
  'wasstrip-nl',
  'natuwash',
] as const;

/** Known wasstrips product slugs — sitemap fallback when DB is unreachable */
export const KNOWN_PRODUCT_SLUGS_WASSTRIPS = [
  'cosmeau-wasstrips',
  'mothers-earth-wasstrips',
  'natuwash-wasstrips',
  'bio-suds-wasstrips',
  'wasstrip-nl-wasstrips',
  'happysoaps-wasstrips',
] as const;

/** @deprecated Use site-specific slug arrays instead */
export const KNOWN_PRODUCT_SLUGS = KNOWN_PRODUCT_SLUGS_VAATWASSTRIPS;
