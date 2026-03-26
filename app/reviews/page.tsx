export const revalidate = 300;

import Link from 'next/link';
import { Star, Calendar, User, Check, X } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSite } from '@/lib/get-site';
import { safeDbQuery } from '@/lib/db-safe';

export default async function ReviewsPage() {
  const site = getSite();
  const year = new Date().getFullYear();

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
      <p className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        {' • '}
        <span>Reviews</span>
      </p>

      <div className="card p-6 mb-8">
        <h1 className="text-3xl font-bold text-primary mb-3">{site.productNounCapitalized} Reviews {year}</h1>
        <p className="text-gray-600">
          Lees wat andere gebruikers vinden van verschillende {site.productNoun} merken
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-primary">Recente Reviews</h2>

          {reviews.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-500 mb-2">Nog geen geverifieerde reviews beschikbaar.</p>
              <p className="text-gray-400 text-sm">Wees de eerste om een review te schrijven!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="card p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <h3 className="font-semibold text-gray-900">{review.title}</h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-1" />
                          {review.userName}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {review.createdAt.toLocaleDateString('nl-NL')}
                        </span>
                        <span className="text-primary text-xs font-medium flex items-center">
                          <Check className="h-3 w-3 mr-0.5" />
                          Geverifieerd
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/merken/${review.product.slug}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      {review.product.supplier}
                    </Link>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{review.content}</p>

                  <Link
                    href={`/merken/${review.product.slug}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Meer over {review.product.supplier} →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Brand Overview */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Merk Overzicht</h3>
            <div className="space-y-4">
              {brandStats.map((brand) => (
                <div key={brand.slug}>
                  <div className="flex justify-between items-center mb-1">
                    <Link
                      href={`/merken/${brand.slug}`}
                      className="font-medium hover:text-primary"
                    >
                      {brand.name}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {brand.reviewCount} reviews
                    </span>
                  </div>
                  {brand.rating && (
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div
                          className="bg-yellow-400 h-1.5 rounded-full"
                          style={{ width: `${(brand.rating / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{brand.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Write Review CTA */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Deel jouw ervaring</h3>
            <p className="text-gray-600 text-sm mb-4">
              Help anderen de juiste keuze te maken
            </p>
            <Link
              href="/reviews/schrijven"
              className="block w-full text-center btn-primary py-2.5 rounded-lg"
            >
              Schrijf een review
            </Link>
          </div>

          {/* Review Guidelines */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Review richtlijnen</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                Wees eerlijk en objectief
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                Deel specifieke ervaringen
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                Vermeld hoe lang je het product gebruikt
              </li>
              <li className="flex items-start">
                <X className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                Geen spam of promotie
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
