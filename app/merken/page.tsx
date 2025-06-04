import { Metadata } from 'next';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/db/products';

export const metadata: Metadata = {
  title: 'Alle Wasstrips Merken - Vergelijk & Reviews 2024',
  description: 'Overzicht van alle wasstrips merken in Nederland. Vergelijk Mother\'s Earth, Cosmeau, Bubblyfy en meer. Uitgebreide reviews en actuele prijzen.',
  keywords: 'wasstrips merken, mothers earth, cosmeau, bubblyfy, bio suds, vergelijken'
};

export default async function BrandsPage() {
  // Fetch all products from database
  const products = await getProducts({
    orderBy: 'name',
    order: 'asc'
  });

  // Group products by supplier/brand
  const brandMap = new Map<string, any[]>();
  products.forEach((product: any) => {
    if (!brandMap.has(product.supplier)) {
      brandMap.set(product.supplier, []);
    }
    brandMap.get(product.supplier)?.push(product);
  });

  // Convert to array of brands with aggregated data
  const brands = Array.from(brandMap.entries()).map(([supplier, products]) => {
    const avgPrice = products.reduce((sum, p) => sum + (p.currentPrice || 0), 0) / products.length;
    const avgPricePerWash = products.reduce((sum, p) => sum + (p.pricePerWash || 0), 0) / products.length;
    const avgRating = products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length;
    const totalReviews = products.reduce((sum, p) => sum + (p.reviewCount || 0), 0);
    
    // Get the first product as representative
    const representativeProduct = products[0];
    
    return {
      slug: representativeProduct.slug,
      name: supplier,
      description: representativeProduct.description || `${supplier} biedt hoogwaardige vaatwasstrips voor een schone was`,
      price: avgPrice,
      pricePerWash: avgPricePerWash,
      rating: avgRating,
      reviews: totalReviews,
      features: representativeProduct.features || [],
      productCount: products.length
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Merken</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">Alle Wasstrips Merken</h1>
      <p className="text-xl text-gray-600 mb-12">
        Vergelijk alle populaire wasstrips merken in Nederland. Van budget tot premium.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {brands.map((brand) => (
          <div key={brand.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{brand.name}</h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    €{brand.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    €{brand.pricePerWash.toFixed(2)}/was
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{brand.description}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(brand.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {brand.rating.toFixed(1)} ({brand.reviews} reviews)
                </span>
              </div>

              {brand.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Kenmerken:</h3>
                  <ul className="space-y-1">
                    {brand.features.slice(0, 3).map((feature: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                    {brand.features.length > 3 && (
                      <li className="text-sm text-gray-500 italic">
                        +{brand.features.length - 3} meer kenmerken
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Link 
                  href={`/merken/${brand.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Lees volledige review <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                {brand.productCount > 1 && (
                  <span className="text-sm text-gray-500">
                    {brand.productCount} producten
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SEO Content */}
      <section className="mt-16 prose max-w-none">
        <h2 className="text-2xl font-bold mb-4">Waarom Wasstrips?</h2>
        <p className="text-gray-600 mb-4">
          Wasstrips zijn de toekomst van wassen. Deze innovatieve alternatieven voor traditioneel wasmiddel 
          bieden tal van voordelen: ze zijn milieuvriendelijk, nemen weinig ruimte in beslag, en zijn 
          makkelijk te doseren. Geen gemorst wasmiddel meer!
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Hoe kiezen we de beste merken?</h3>
        <p className="text-gray-600 mb-4">
          Wij testen en vergelijken alle grote wasstrips merken op de Nederlandse markt. We kijken naar 
          wasvermogen, prijs per wasbeurt, milieuvriendelijkheid, en gebruikerservaringen. Zo help we je 
          de beste keuze te maken voor jouw situatie.
        </p>
      </section>
    </div>
  );
}