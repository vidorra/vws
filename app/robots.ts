import { MetadataRoute } from 'next';
import { getSite } from '@/lib/get-site';

export default function robots(): MetadataRoute.Robots {
  const site = getSite();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/data-beheer/', '/api/', '/_next/'],
      },
    ],
    sitemap: `${site.canonicalBase}/sitemap.xml`,
  };
}
