import { NextResponse } from 'next/server';

// Mock data - in production this would come from database
const staticPages = [
  '',
  '/merken',
  '/prijzen',
  '/reviews',
  '/gids',
  '/blog'
];

const brands = [
  'mothers-earth',
  'cosmeau',
  'bubblyfy',
  'bio-suds'
];

const priceCategories = [
  'goedkoopste',
  'beste-waarde',
  'premium'
];

const guides = [
  'beginners',
  'milieuvriendelijk',
  'kopen-tips'
];

const blogPosts = [
  'wasstrips-vs-wasmiddel',
  'duurzaam-wassen',
  'besparen-wasmiddel'
];

export async function GET() {
  const baseUrl = 'https://wasstripsvergelijker.nl';
  const currentDate = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  
  <!-- Brand pages -->
  ${brands.map(brand => `
  <url>
    <loc>${baseUrl}/merken/${brand}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- Price category pages -->
  ${priceCategories.map(category => `
  <url>
    <loc>${baseUrl}/prijzen/${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  <!-- Guide pages -->
  ${guides.map(guide => `
  <url>
    <loc>${baseUrl}/gids/${guide}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
  <!-- Blog posts -->
  ${blogPosts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}