import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingDown, Award, Star } from 'lucide-react';
import { getProducts, getProductsByCategory } from '@/lib/db/products';

export const metadata: Metadata = {
  title: 'Wasstrips Prijzen Vergelijken - Alle Categorieën',
  description: 'Vergelijk wasstrips prijzen in alle categorieën. Van budget tot premium, vind de perfecte wasstrips voor jouw budget en behoeften.',
  keywords: 'wasstrips prijzen, goedkoop, beste waarde, premium, vergelijken'
};

const priceCategories = [
  {
    slug: 'goedkoopste',
    title: 'Goedkoopste Wasstrips',
    description: 'Voor de prijsbewuste consument',
    icon: TrendingDown,
    color: 'bg-green-100 text-green-800',
    iconColor: 'text-green-600',
    priceRange: 'Vanaf €0.15 per was',
    features: [
      'Laagste prijs per wasbeurt',
      'Ideaal voor grote gezinnen',
      'Goede basiskwaliteit'
    ]
  },
  {
    slug: 'beste-waarde',
    title: 'Beste Prijs-Kwaliteit',
    description: 'Optimale balans tussen prijs en prestatie',
    icon: Award,
    color: 'bg-blue-100 text-blue-800',
    iconColor: 'text-blue-600',
    priceRange: '€0.22 - €0.25 per was',
    features: [
      'Uitstekende wasresultaten',
      'Populairste keuze',
      'Betrouwbare merken'
    ]
  },
  {
    slug: 'premium',
    title: 'Premium Wasstrips',
    description: 'Voor de beste wasresultaten',
    icon: Star,
    color: 'bg-purple-100 text-purple-800',
    iconColor: 'text-purple-600',
    priceRange: '€0.25+ per was',
    features: [
      '100% natuurlijke ingrediënten',
      'Superieure vlekverwijdering',
      'Eco-certificeringen'
    ]
  }
];

// Helper function to determine category
function getProductCategory(pricePerWash: number | null, rating: number | null, sustainability: number | null): string {
  if (!pricePerWash) return 'Onbekend';
  
  if (pricePerWash <= 0.20) return 'Goedkoopste';
  if (pricePerWash <= 0.25 && rating && rating >= 4.0) return 'Beste Waarde';
  if (pricePerWash > 0.25 || (sustainability && sustainability >= 8.5)) return 'Premium';
  
  return 'Goedkoopste';
}

export default async function PrijzenPage() {
  // Fetch products for the comparison table
  const products = await getProducts({
    inStock: true,
    orderBy: 'pricePerWash',
    order: 'asc'
  });

  // Take top products from each category for the table
  const tableProducts = products.slice(0, 6).map((product: any) => ({
    ...product,
    category: getProductCategory(product.pricePerWash, product.rating, product.sustainability)
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Prijzen</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">Wasstrips Prijzen Vergelijken</h1>
      <p className="text-xl text-gray-600 mb-12">
        Vind de perfecte wasstrips voor jouw budget. Van budget-vriendelijk tot premium kwaliteit.
      </p>

      {/* Price Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {priceCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link 
              key={category.slug}
              href={`/prijzen/${category.slug}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-12 w-12 ${category.iconColor}`} />
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${category.color}`}>
                    {category.priceRange}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition">
                  {category.title}
                </h2>
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                <ul className="space-y-2 mb-4">
                  {category.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="text-blue-600 font-semibold group-hover:text-blue-800 transition">
                  Bekijk producten →
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Price Comparison Table */}
      <section className="bg-white rounded-lg shadow-lg p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6">Snelle Prijsvergelijking</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prijs per pak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prijs per was
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beoordeling
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableProducts.map((product: any) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/merken/${product.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    €{product.currentPrice?.toFixed(2) || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    €{product.pricePerWash?.toFixed(2) || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.category === 'Goedkoopste' ? 'bg-green-100 text-green-800' :
                      product.category === 'Beste Waarde' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{product.rating?.toFixed(1) || '-'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose max-w-none">
        <h2 className="text-2xl font-bold mb-4">Hoe kies je de juiste prijscategorie?</h2>
        <p className="text-gray-600 mb-4">
          Bij het kiezen van wasstrips is prijs een belangrijke factor, maar niet de enige. 
          Hier zijn enkele overwegingen per categorie:
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Budget wasstrips (€0.15-€0.22 per was)</h3>
        <p className="text-gray-600 mb-4">
          Perfect als je veel wast en wilt besparen. Deze wasstrips bieden goede basisprestaties 
          tegen de laagste prijs. Ideaal voor dagelijkse was zoals handdoeken en beddengoed.
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Middenklasse wasstrips (€0.22-€0.25 per was)</h3>
        <p className="text-gray-600 mb-4">
          De gulden middenweg. Deze categorie biedt de beste balans tussen prijs en kwaliteit. 
          Geschikt voor alle soorten was, inclusief delicate kleding.
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Premium wasstrips (€0.25+ per was)</h3>
        <p className="text-gray-600 mb-4">
          Voor wie het beste wil. Premium wasstrips gebruiken hoogwaardige, vaak biologische 
          ingrediënten. Ze zijn zachter voor de huid en het milieu, en bieden superieure wasresultaten.
        </p>
      </section>
    </div>
  );
}