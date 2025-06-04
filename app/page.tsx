export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingDown, Award, Star, ExternalLink } from 'lucide-react';
import { getProductsSafe } from '@/lib/db-safe';

export const metadata: Metadata = {
  title: 'Vaatwasstrips Vergelijker Nederland - Beste Prijzen 2024',
  description: 'Vergelijk vaatwasstrips van alle Nederlandse aanbieders. Bespaar tot 75% op je afwas met milieuvriendelijke alternatieven. Actuele prijzen 2024.',
  keywords: 'vaatwasstrips, vergelijken, nederland, prijs, milieuvriendelijk, afwassen',
  openGraph: {
    title: 'Vaatwasstrips Vergelijker Nederland 2024',
    description: 'De meest complete vergelijking van vaatwasstrips in Nederland',
    type: 'website',
    url: 'https://vaatwasstripsvergelijker.nl',
    images: ['/og-image.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaatwasstrips Vergelijker Nederland 2024',
    description: 'Vergelijk vaatwasstrips van alle Nederlandse aanbieders'
  }
};

// Traditional tablets for comparison
const traditionalTablets = [
  { name: 'Dreft Tablets', pricePerWash: 0.68, sustainability: 3.2, increase: 325 },
  { name: 'Sun Tablets', pricePerWash: 0.57, sustainability: 3.8, increase: 256 },
  { name: 'Finish Tablets', pricePerWash: 0.64, sustainability: 4.1, increase: 300 }
];

const faqs = [
  {
    question: 'Zijn vaatwasstrips even effectief als tabletten?',
    answer: 'Vaatwasstrips kunnen even effectief zijn, maar de prestaties kunnen variëren per merk en type vervuiling. Voor hardnekkige vlekken zoals thee-aanslag kunnen ze minder effectief zijn.'
  },
  {
    question: 'Hoeveel kan ik besparen?',
    answer: 'Gemiddeld kun je 60-75% besparen ten opzichte van traditionele vaatwastabletten, afhankelijk van het merk dat je kiest.'
  },
  {
    question: 'Zijn ze echt milieuvriendelijker?',
    answer: 'Ja, vaatwasstrips hebben doorgaans minder plastic verpakking, zijn biologisch afbreekbaar en bevatten minder schadelijke chemicaliën.'
  },
  {
    question: 'Hoe gebruik ik vaatwasstrips?',
    answer: 'Scheur een strip doormidden en plaats een halve strip in het vaatwasmiddelvakje. Eén strip is goed voor twee wasbeurten.'
  }
];

// Helper function to get product badges
function getProductBadges(product: any) {
  const badges = [];
  
  // Check if it's trending (you can implement getTrendingProducts later)
  if (product.pricePerWash && product.pricePerWash <= 0.20) {
    badges.push('Beste waarde');
  }
  
  // Add more badge logic as needed
  return badges;
}

// Helper function to get product color scheme
function getProductColorScheme(supplier: string) {
  const colorSchemes: Record<string, { color: string; bgColor: string; borderColor: string; emoji: string }> = {
    "Wasstrip.nl": {
      color: 'rgb(132, 204, 22)',
      bgColor: 'rgb(236, 252, 203)',
      borderColor: 'border-green-400',
      emoji: '🌿'
    },
    "Mother's Earth": {
      color: 'rgb(34, 197, 94)',
      bgColor: 'rgb(220, 252, 231)',
      borderColor: 'border-green-400',
      emoji: '🌍'
    },
    "Bubblyfy": {
      color: 'rgb(6, 182, 212)',
      bgColor: 'rgb(207, 250, 254)',
      borderColor: 'border-gray-200',
      emoji: '💧'
    },
    "Cosmeau": {
      color: 'rgb(59, 130, 246)',
      bgColor: 'rgb(219, 234, 254)',
      borderColor: 'border-gray-200',
      emoji: '🧽'
    },
    "Bio-Suds": {
      color: 'rgb(16, 185, 129)',
      bgColor: 'rgb(209, 250, 229)',
      borderColor: 'border-gray-200',
      emoji: '🍃'
    }
  };
  
  return colorSchemes[supplier] || {
    color: 'rgb(107, 114, 128)',
    bgColor: 'rgb(243, 244, 246)',
    borderColor: 'border-gray-200',
    emoji: '📦'
  };
}

export default async function HomePage() {
  // Fetch products from database with error handling
  const products = await getProductsSafe();
  
  // Sort by price per wash if available
  const sortedProducts = products.sort((a: any, b: any) => {
    const priceA = a.pricePerWash || a.currentPrice || 0;
    const priceB = b.pricePerWash || b.currentPrice || 0;
    return priceA - priceB;
  });
  
  // Calculate lowest price
  const lowestPrice = sortedProducts.length > 0 && sortedProducts[0].pricePerWash
    ? sortedProducts[0].pricePerWash.toFixed(2)
    : '0.16';
  
  // Calculate stats from products
  const stats = {
    totalProducts: products.length,
    averagePrice: products.length > 0
      ? (products.reduce((sum: number, p: any) => sum + (p.currentPrice || 0), 0) / products.length).toFixed(2)
      : 0,
    brandsCount: new Set(products.map((p: any) => p.supplier)).size
  };
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vaatwasstrips Vergelijker",
    "url": "https://vaatwasstripsvergelijker.nl",
    "description": "Vergelijk vaatwasstrips van alle Nederlandse aanbieders",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://vaatwasstripsvergelijker.nl/zoeken?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Vergelijk Vaatwasstrips in Nederland
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ontdek de beste vaatwasstrips voor jouw budget en milieubewustzijn. 
            Bespaar tot <span className="font-bold text-green-600">75%</span> ten opzichte van traditionele tabletten.
          </p>
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-blue-600">€{lowestPrice}</div>
              <div className="text-sm text-gray-500">Laagste prijs per wasbeurt</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-green-600">75%</div>
              <div className="text-sm text-gray-500">Besparing vs. tablets</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-purple-600">{stats.totalProducts}</div>
              <div className="text-sm text-gray-500">Aanbieders vergeleken</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-500">Milieuvriendelijk</div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg text-sm btn-primary flex items-center space-x-2">
              <span>Alle producten</span>
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200">
              <span>Op voorraad</span>
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200">
              <TrendingDown className="h-4 w-4" />
              <span>Trending</span>
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200">
              <Award className="h-4 w-4" />
              <span>Beste waarde</span>
            </button>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700">
            <option value="price">Sorteer op prijs</option>
            <option value="rating">Sorteer op beoordeling</option>
            <option value="sustainability">Sorteer op duurzaamheid</option>
          </select>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {products.map((product: any) => {
            const colorScheme = getProductColorScheme(product.supplier);
            const badges = getProductBadges(product);
            const originalPrice = product.pricePerWash ? product.pricePerWash * 1.4 : 0.30;
            
            return (
              <div 
                key={product.id} 
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  !product.inStock ? 'opacity-75' : ''
                } ${colorScheme.borderColor}`}
              >
                <div className="p-6 pb-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{colorScheme.emoji}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{product.rating || 4.0}</span>
                          </div>
                          <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {badges.map((badge, index) => (
                        <span 
                          key={index}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            badge === 'Beste waarde' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold" style={{ color: colorScheme.color }}>
                          €{product.pricePerWash?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-sm text-gray-600">per wasbeurt</div>
                        <div className="text-sm text-gray-400 line-through">€{originalPrice.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">€{product.currentPrice?.toFixed(2) || '0.00'}</div>
                        <div className="text-sm text-gray-600">{product.washesPerPack} wasbeurten</div>
                      </div>
                    </div>
                  </div>

                  {/* Sustainability */}
                  {product.sustainability && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Duurzaamheid</span>
                        <span className="text-sm font-bold text-green-600">{product.sustainability}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${product.sustainability * 10}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Kenmerken</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 3).map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ backgroundColor: colorScheme.bgColor, color: colorScheme.color }}
                          >
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{product.features.length - 3} meer
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pros and Cons */}
                  {((product.pros && product.pros.length > 0) || (product.cons && product.cons.length > 0)) && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {product.pros && product.pros.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-green-600 mb-1">Voordelen</h5>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {product.pros.map((pro: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-1">✓</span>{pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {product.cons && product.cons.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-red-600 mb-1">Nadelen</h5>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {product.cons.map((con: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="text-red-500 mr-1">✗</span>{con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Availability */}
                  {product.availability && (
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>Beschikbaarheid:</span>
                      <span className="font-medium">{product.availability}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 pb-6">
                  <div className="flex space-x-2">
                    {product.inStock ? (
                      <Link 
                        href={product.url || '#'} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-4 rounded-xl btn-primary text-center"
                      >
                        Naar website
                      </Link>
                    ) : (
                      <button
                        className="flex-1 py-3 px-4 rounded-xl font-medium transition-all bg-gray-100 text-gray-400 cursor-not-allowed"
                        disabled
                      >
                        Uitverkocht
                      </button>
                    )}
                    <Link 
                      href={`/merken/${product.slug}`}
                      className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-600" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Vergelijking met Traditionele Vaatwastabletten
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Prijs per wasbeurt</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Duurzaamheid</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Besparing</th>
                </tr>
              </thead>
              <tbody>
                {traditionalTablets.map((tablet, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{tablet.name}</td>
                    <td className="py-3 px-4 text-red-600 font-semibold">€{tablet.pricePerWash.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-red-400 h-2 rounded-full" 
                            style={{ width: `${tablet.sustainability * 10}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{tablet.sustainability}/10</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-red-600 font-semibold">+{tablet.increase}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Veelgestelde Vragen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}