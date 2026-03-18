export const revalidate = 300;

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Check, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSite } from '@/lib/get-site';

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      select: { slug: true, site: true },
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    // DB unavailable during build (e.g. Docker build with dummy URL) — pages will be generated on-demand
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const site = getSite();
  const product = await prisma.product.findFirst({
    where: { slug: params.slug, site: site.key },
    select: { name: true, description: true, rating: true, reviewCount: true, pricePerWash: true, supplier: true },
  });

  if (!product) {
    return { title: 'Merk niet gevonden' };
  }

  const year = new Date().getFullYear();

  return {
    title: `${product.name} Review & Prijzen - ${year}`,
    description: `Uitgebreide review van ${product.name}. Actuele prijzen, voor- en nadelen, en ${product.reviewCount} gebruikerservaringen. €${product.pricePerWash?.toFixed(2)} per wasbeurt.`,
    keywords: `${product.supplier}, ${site.productNoun}, review, prijs, kopen, ${year}`,
    openGraph: {
      title: `${product.name} Review ${year}`,
      description: product.description ?? undefined,
      type: 'article',
    },
  };
}

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const site = getSite();

  const product = await prisma.product.findFirst({
    where: { slug: params.slug, site: site.key },
    include: {
      variants: { orderBy: { washCount: 'asc' } },
      priceHistory: { orderBy: { recordedAt: 'desc' }, take: 12 },
      reviews: { where: { verified: true }, orderBy: { createdAt: 'desc' }, take: 5 },
    },
  });

  if (!product) {
    notFound();
  }

  const year = new Date().getFullYear();

  // Price trend from history
  const latestPrice = product.priceHistory[0];
  const previousPrice = product.priceHistory[1];
  const priceChange = latestPrice && previousPrice
    ? latestPrice.price - previousPrice.price
    : 0;

  // Features as key-value from the features array
  const featureEntries = product.features.map((f) => {
    const [key, ...rest] = f.split(':');
    return rest.length > 0 ? [key.trim(), rest.join(':').trim()] : [f, ''];
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.supplier
    },
    "offers": {
      "@type": "Offer",
      "price": product.currentPrice,
      "priceCurrency": "EUR",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${site.canonicalBase}/merken/${params.slug}`
    },
    ...(product.rating && product.reviewCount > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount
      }
    } : {})
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": site.canonicalBase },
      { "@type": "ListItem", "position": 2, "name": "Merken", "item": `${site.canonicalBase}/merken` },
      { "@type": "ListItem", "position": 3, "name": product.supplier, "item": `${site.canonicalBase}/merken/${params.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/merken" className="hover:text-blue-600">Merken</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.supplier}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{product.name} Review {year}</h1>
          <p className="text-xl text-gray-600">{product.description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Overzicht</h2>
              {product.longDescription && (
                <p className="text-gray-600 mb-6">{product.longDescription}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                {product.pros.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-600 mb-2">Voordelen</h3>
                    <ul className="space-y-2">
                      {product.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.cons.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-red-600 mb-2">Nadelen</h3>
                    <ul className="space-y-2">
                      {product.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Variants */}
            {product.variants.length > 0 && (
              <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Beschikbare Verpakkingen</h2>
                <div className="space-y-3">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="flex justify-between items-center py-3 border-b last:border-0">
                      <div>
                        <span className="font-medium">{variant.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({variant.washCount} wasbeurten)</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">€{variant.price.toFixed(2)}</div>
                        <div className="text-sm text-green-600">€{variant.pricePerWash.toFixed(3)}/wasbeurt</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Specifications */}
            {featureEntries.length > 0 && (
              <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Kenmerken</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Price History */}
            {product.priceHistory.length > 0 && (
              <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Prijsgeschiedenis</h2>
                <div className="space-y-2">
                  {product.priceHistory.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">
                        {entry.recordedAt.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long' })}
                      </span>
                      <span className="font-semibold">€{entry.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* User Reviews */}
            {product.reviews.length > 0 && (
              <section className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Gebruikersreviews</h2>
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="font-semibold text-sm">{review.title}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{review.content}</p>
                      <div className="text-xs text-gray-500">
                        {review.userName} — {review.createdAt.toLocaleDateString('nl-NL')}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Box */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 sticky top-24">
              <div className="text-center mb-4">
                {product.currentPrice && (
                  <div className="text-3xl font-bold text-blue-600">€{product.currentPrice.toFixed(2)}</div>
                )}
                {product.pricePerWash && (
                  <div className="text-gray-600">€{product.pricePerWash.toFixed(2)} per wasbeurt</div>
                )}
                {priceChange !== 0 && (
                  <div className="flex items-center justify-center mt-2">
                    {priceChange < 0 ? (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${priceChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {priceChange < 0 ? `€${Math.abs(priceChange).toFixed(2)} goedkoper` : `€${priceChange.toFixed(2)} duurder`}
                    </span>
                  </div>
                )}
                {priceChange === 0 && product.priceHistory.length > 1 && (
                  <div className="flex items-center justify-center mt-2">
                    <Minus className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">Prijs stabiel</span>
                  </div>
                )}
              </div>

              {product.rating && (
                <div className="flex items-center justify-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-6 w-6 ${i < Math.floor(product.rating!) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
                </div>
              )}

              {product.sustainability && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Duurzaamheidsscore</span>
                    <span className="font-semibold text-green-600">{product.sustainability}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(product.sustainability / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className={`text-center mb-6 font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? '✓ Op voorraad' : '✗ Uitverkocht'}
              </div>

              {product.url && (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center btn-primary py-3 rounded-lg font-semibold"
                >
                  Bekijk bij leverancier →
                </a>
              )}

              <p className="text-xs text-gray-500 mt-4 text-center">
                * We ontvangen mogelijk een commissie
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
