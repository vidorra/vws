import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getSite } from '@/lib/get-site';
import { KNOWN_PRODUCT_SLUGS_VAATWASSTRIPS, KNOWN_PRODUCT_SLUGS_WASSTRIPS } from '@/lib/constants';

const priceCategories = ['goedkoopste', 'beste-waarde', 'premium'];

const blogSlugs = [
  'wasstrips-vs-wasmiddel',
  'duurzaam-wassen',
  'besparen-wasmiddel',
  'wasstrips-geschiedenis',
  'vlekken-verwijderen',
];

const gidsSlugs = ['beginners', 'milieuvriendelijk', 'kopen-tips', 'troubleshooting'];

const troubleshootingSlugs = [
  'strip-lost-niet-op',
  'witte-aanslag',
  'dosering-problemen',
  'gevoelige-huid',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSite();
  const baseUrl = site.canonicalBase;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily', lastModified: now },
    { url: `${baseUrl}/merken`, priority: 0.8, changeFrequency: 'weekly', lastModified: now },
    { url: `${baseUrl}/prijzen`, priority: 0.8, changeFrequency: 'daily', lastModified: now },
    { url: `${baseUrl}/overzicht`, priority: 0.7, changeFrequency: 'weekly', lastModified: now },
    { url: `${baseUrl}/vergelijk`, priority: 0.7, changeFrequency: 'weekly', lastModified: now },
    { url: `${baseUrl}/reviews`, priority: 0.6, changeFrequency: 'weekly', lastModified: now },
    { url: `${baseUrl}/methodologie`, priority: 0.5, changeFrequency: 'monthly', lastModified: now },
    { url: `${baseUrl}/productfinder`, priority: 0.7, changeFrequency: 'monthly', lastModified: now },
    { url: `${baseUrl}/privacybeleid`, priority: 0.3, changeFrequency: 'yearly', lastModified: now },
  ];

  // Gids routes
  const gidsRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/gids`, priority: 0.6, changeFrequency: 'monthly', lastModified: now },
    ...gidsSlugs.map(slug => ({
      url: `${baseUrl}/gids/${slug}`,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),
    ...troubleshootingSlugs.map(slug => ({
      url: `${baseUrl}/gids/troubleshooting/${slug}`,
      priority: 0.5,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),
  ];

  // Blog routes
  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/blog`, priority: 0.6, changeFrequency: 'weekly', lastModified: now },
    ...blogSlugs.map(slug => ({
      url: `${baseUrl}/blog/${slug}`,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
      lastModified: now,
    })),
  ];

  // Fetch live product slugs from DB filtered by site
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { site: site.key },
      select: { slug: true, updatedAt: true },
    });
    productRoutes = products.map(p => ({
      url: `${baseUrl}/merken/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.8,
      changeFrequency: 'daily' as const,
    }));
  } catch {
    const fallbackSlugs = site.key === 'vaatwasstrips'
      ? KNOWN_PRODUCT_SLUGS_VAATWASSTRIPS
      : KNOWN_PRODUCT_SLUGS_WASSTRIPS;
    productRoutes = fallbackSlugs.map(slug => ({
      url: `${baseUrl}/merken/${slug}`,
      priority: 0.8,
      changeFrequency: 'daily' as const,
    }));
  }

  const priceRoutes: MetadataRoute.Sitemap = priceCategories.map(cat => ({
    url: `${baseUrl}/prijzen/${cat}`,
    priority: 0.7,
    changeFrequency: 'daily',
    lastModified: now,
  }));

  return [...staticRoutes, ...gidsRoutes, ...blogRoutes, ...productRoutes, ...priceRoutes];
}
