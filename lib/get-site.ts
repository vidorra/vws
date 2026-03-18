import { headers } from 'next/headers';
import { SITE_CONFIG, type SiteConfig, type SiteKey } from './site-config';

/** Server-side only: reads x-site header set by middleware. */
export function getSite(): SiteConfig {
  const site = (headers().get('x-site') ?? 'vaatwasstrips') as SiteKey;
  return SITE_CONFIG[site];
}
