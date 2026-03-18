export const revalidate = 300;

import Link from 'next/link';
import { Star, Calendar, User } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSite } from '@/lib/get-site';
import { safeDbQuery } from '@/lib/db-safe';

export default async function ReviewsPage() {
  const site = getSite();
  const year = new Date().getFullYear();

  // Fetch verified reviews with their product info
  const reviews = await safeDbQuery(
    () => prisma.review.findMany({
      where: {
        verified: true,
        product: { site: site.key },
      },
      include: {
        product: { select: { name: true, slug: true, supplier: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    []
  );

  // Fetch brand stats (avg rating + review count per product)
  const brandStats = await safeDbQuery(
    () => prisma.product.findMany({
      where: { site: site.key },
      select: { name: true, slug: true, rating: true, reviewCount: true },
      orderBy: { reviewCount: 'desc' },
    }),
    []
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Reviews</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">{site.productNounCapitalized} Reviews {year}</h1>
      <p className="text-xl text-gray-600 mb-12">
        Lees wat andere gebruikers vinden van verschillende {site.productNoun} merken
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content - Reviews */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Recente Reviews</h2>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">Nog geen geverifieerde reviews beschikbaar.</p>
              <p className="text-gray-400 text-sm">Wees de eerste om een review te schrijven!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <h3 className="font-semibold">{review.title}</h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {review.userName}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {review.createdAt.toLocaleDateString('nl-NL')}
                        </span>
                        <span className="text-green-600 text-xs font-semibold">
                          ✓ Geverifieerd
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/merken/${review.product.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {review.product.supplier}
                    </Link>
                  </div>

                  <p className="text-gray-600 mb-4">{review.content}</p>

                  <Link
                    href={`/merken/${review.product.slug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Meer over {review.product.supplier} →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Brand Overview */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Merk Overzicht</h3>
            <div className="space-y-4">
              {brandStats.map((brand) => (
                <div key={brand.slug}>
                  <div className="flex justify-between items-center mb-1">
                    <Link
                      href={`/merken/${brand.slug}`}
                      className="font-medium hover:text-blue-600"
                    >
                      {brand.name}
                    </Link>
                    <span className="text-sm text-gray-600">
                      {brand.reviewCount} reviews
                    </span>
                  </div>
                  {brand.rating && (
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${(brand.rating / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{brand.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Write Review CTA */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-2">Deel jouw ervaring</h3>
            <p className="text-gray-600 mb-4">
              Help anderen de juiste keuze te maken door jouw review te delen
            </p>
            <Link
              href="/reviews/schrijven"
              className="block w-full text-center btn-primary py-2 rounded-lg"
            >
              Schrijf een review
            </Link>
          </div>

          {/* Review Guidelines */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold mb-3">Review Richtlijnen</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Wees eerlijk en objectief
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Deel specifieke ervaringen
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Vermeld hoe lang je het product gebruikt
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                Geen spam of promotie
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-16 prose max-w-none">
        <h2 className="text-2xl font-bold mb-4">Waarom zijn reviews belangrijk?</h2>
        <p className="text-gray-600 mb-4">
          Reviews van echte gebruikers geven je het beste inzicht in hoe {site.productNoun} in de praktijk presteren.
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>De werkelijke resultaten begrijpen</li>
          <li>Mogelijke problemen of beperkingen ontdekken</li>
          <li>Het beste merk voor jouw specifieke situatie kiezen</li>
          <li>Tips en tricks van andere gebruikers leren</li>
        </ul>
      </section>
    </div>
  );
}
