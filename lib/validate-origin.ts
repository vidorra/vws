import { SITE_CONFIG } from './site-config';

const ALLOWED_ORIGINS = [
  ...Object.values(SITE_CONFIG).map((s) => `https://${s.domain}`),
  ...Object.values(SITE_CONFIG).map((s) => `https://www.${s.domain}`),
  'http://localhost:3000',
  'http://localhost:3001',
];

/**
 * Validates the Origin header against allowed domains.
 * Returns null if valid, or an error message if invalid.
 */
export function validateOrigin(origin: string | null): string | null {
  if (!origin) {
    return 'Missing Origin header';
  }
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return `Origin not allowed: ${origin}`;
  }
  return null;
}
