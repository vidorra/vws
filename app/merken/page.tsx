export const revalidate = 300;

import Link from 'next/link';
import { getBrandsSafe } from '@/lib/db-safe';
import { getSite } from '@/lib/get-site';
import { ArrowRight } from 'lucide-react';

export default async function MerkenPage() {
  const site = getSite();
  const brands = await getBrandsSafe(site.key);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <p className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        {' • '}
        <span>Merken</span>
      </p>

      <div className="card p-6 mb-8">
        <h1 className="text-3xl font-bold text-primary mb-3">Alle {site.productNounCapitalized} Merken</h1>
        <p className="text-gray-600">
          Ontdek alle {site.productNoun} merken die beschikbaar zijn in Nederland. Klik op een merk voor prijzen, reviews en details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((supplier: string) => (
          <Link
            key={supplier}
            href={`/merken/${supplier.toLowerCase().replace(/\s+/g, '-')}`}
            className="card p-5 hover:border-primary transition-colors group"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{supplier}</h2>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-gray-500">Geen merken gevonden.</p>
        </div>
      )}
    </div>
  );
}
