export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Vaatwasstrips Merken | Alle Merken Vergelijken',
  description: 'Ontdek alle merken vaatwasstrips die wij vergelijken. Van premium merken tot huismerken.',
};

async function getBrands() {
  try {
    const products = await prisma.product.findMany({
      select: {
        supplier: true,
      },
      distinct: ['supplier'],
      orderBy: {
        supplier: 'asc',
      },
    });

    return products.map((p: { supplier: string }) => p.supplier);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function MerkenPage() {
  const brands = await getBrands();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Alle Vaatwasstrips Merken</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((supplier: string) => (
          <Link
            key={supplier}
            href={`/merken/${supplier.toLowerCase().replace(/\s+/g, '-')}`}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="font-semibold">{supplier}</h2>
          </Link>
        ))}
      </div>

      {brands.length === 0 && (
        <p className="text-gray-500">Geen merken gevonden.</p>
      )}
    </div>
  );
}