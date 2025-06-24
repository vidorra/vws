'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Leaf, Euro, Package, Check, X, Info, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  supplier: string;
  rating?: number | null;
  reviewCount: number;
  sustainability?: number | null;
  features: string[];
  pros: string[];
  cons: string[];
  variants?: any[];
  currentPrice?: number | null;
  pricePerWash?: number | null;
  washesPerPack: number;
  inStock: boolean;
  url?: string | null;
}

export default function VergelijkPage() {
  const searchParams = useSearchParams();
  const productIds = searchParams.get('products')?.split(',').filter(Boolean) || [];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      if (productIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch products from API
        const response = await fetch(`/api/products?ids=${productIds.join(',')}`);
        if (!response.ok) {
          throw new Error('Failed to load products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Er is een fout opgetreden bij het laden van de producten.');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [productIds.join(',')]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Producten laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Terug naar homepage
          </Link>
        </div>
      </div>
    );
  }

  if (products.length < 2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Selecteer minimaal 2 producten</h1>
          <p className="text-gray-600 mb-6">
            Om producten te kunnen vergelijken, moet je minimaal 2 producten selecteren.
          </p>
          <Link
            href="/"
            className="btn-primary px-6 py-3 rounded-xl inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar producten
          </Link>
        </div>
      </div>
    );
  }

  // Get the best variant for each product (lowest price per wash)
  const getProductData = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      const bestVariant = product.variants.reduce((best, current) => 
        current.pricePerWash < best.pricePerWash ? current : best
      );
      return {
        ...product,
        price: bestVariant.price,
        pricePerWash: bestVariant.pricePerWash,
        washCount: bestVariant.washCount,
        variantName: bestVariant.name
      };
    }
    return {
      ...product,
      price: product.currentPrice || 0,
      pricePerWash: product.pricePerWash || 0,
      washCount: product.washesPerPack || 60,
      variantName: `${product.washesPerPack || 60} wasbeurten`
    };
  };

  const productsData = products.map(getProductData);

  // Calculate yearly costs (4 washes per week = 208 per year)
  const washesPerYear = 208;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Vergelijk {products.length} producten</h1>
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Terug naar overzicht
            </Link>
          </div>

          {/* Main Content Container */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-blue-50 to-green-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 z-10 bg-gradient-to-r from-blue-50 to-green-50">
                            Eigenschap
                          </th>
                          {productsData.map((product) => (
                            <th key={product.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                              <div className="font-semibold text-base normal-case text-gray-900">{product.name}</div>
                              <div className="text-xs font-normal text-gray-500 mt-1">{product.supplier}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                    
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Price Section */}
                      <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                        <td colSpan={products.length + 1} className="px-6 py-3 font-semibold text-blue-900">
                          <div className="flex items-center space-x-2">
                            <Euro className="h-5 w-5" />
                            <span>Prijs & Kosten</span>
                          </div>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">Geselecteerde variant</td>
                        {productsData.map((product) => (
                          <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.variantName}
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">Prijs</td>
                        {productsData.map((product) => (
                          <td key={product.id} className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-bold text-gray-900">€{product.price.toFixed(2)}</span>
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">Prijs per wasbeurt</td>
                        {productsData.map((product) => (
                          <td key={product.id} className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-green-600">
                              €{product.pricePerWash.toFixed(3)}
                            </span>
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">Kosten per jaar</td>
                        {productsData.map((product) => (
                          <td key={product.id} className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">€{(product.pricePerWash * washesPerYear).toFixed(2)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              (bij {washesPerYear} wasbeurten)
                            </div>
                          </td>
                        ))}
                      </tr>
                      
                      {/* Sustainability Section */}
                      <tr className="bg-gradient-to-r from-green-50 to-green-100">
                        <td colSpan={products.length + 1} className="px-6 py-3 font-semibold text-green-900">
                          <div className="flex items-center space-x-2">
                            <Leaf className="h-5 w-5" />
                            <span>Duurzaamheid</span>
                          </div>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">Duurzaamheidsscore</td>
                        {productsData.map((product) => (
                          <td key={product.id} className="px-6 py-4 whitespace-nowrap">
                            {product.sustainability ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(product.sustainability / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="font-medium text-sm">{product.sustainability}/10</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Geen data</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      
                      {/* Performance Section */}
                      <tr className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                        <td colSpan={products.length + 1} className="px-6 py-3 font-semibold text-yellow-900">
                          <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5" />
                            <span>Prestaties & Reviews</span>
                          </div>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">Beoordeling</td>
                        {productsData.map((product) => (
                          <td key={product.id} className="px-6 py-4 whitespace-nowrap">
                            {product.rating ? (
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="font-medium text-sm">{product.rating}</span>
                                <span className="text-gray-500 text-sm">({product.reviewCount})</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Geen reviews</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      
                      {/* Availability Section */}
                      <tr className="bg-gradient-to-r from-purple-50 to-purple-100">
                        <td colSpan={products.length + 1} className="px-6 py-3 font-semibold text-purple-900">
                          <div className="flex items-center space-x-2">
                            <Package className="h-5 w-5" />
                            <span>Beschikbaarheid</span>
                          </div>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">Voorraad</td>
                        {productsData.map((product) => (
                          <td key={product.id} className="px-6 py-4 whitespace-nowrap">
                            {product.inStock ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Op voorraad
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                <X className="h-3 w-3 mr-1" />
                                Uitverkocht
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                      
                      {/* Features Section */}
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <td colSpan={products.length + 1} className="px-6 py-3 font-semibold text-gray-900">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="h-5 w-5" />
                            <span>Kenmerken</span>
                          </div>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">Belangrijkste kenmerken</td>
                        {productsData.map((product) => (
                          <td key={product.id} className="px-6 py-4">
                            {product.features.length > 0 ? (
                              <ul className="space-y-1">
                                {product.features.slice(0, 3).map((feature, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-green-500 mr-1">•</span>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-gray-400 text-sm">Geen kenmerken</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      
                      {/* Action Row */}
                      <tr className="bg-gradient-to-r from-blue-50 to-green-50">
                        <td className="px-6 py-4 font-medium sticky left-0 bg-gradient-to-r from-blue-50 to-green-50 z-10"></td>
                        {productsData.map((product) => (
                          <td key={product.id} className="px-6 py-6">
                            {product.url && (
                              <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-block"
                              >
                                Bekijk product →
                              </a>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-6">
                {/* Price Comparison */}
                <ComparisonSection
                  title="Prijs & Kosten"
                  icon={<Euro className="h-5 w-5" />}
                  bgColor="bg-gradient-to-r from-blue-50 to-blue-100"
                  items={[
                    {
                      label: 'Prijs',
                      values: productsData.map(p => `€${p.price.toFixed(2)}`),
                      highlight: true
                    },
                    {
                      label: 'Prijs per wasbeurt',
                      values: productsData.map(p => `€${p.pricePerWash.toFixed(3)}`),
                      highlight: true,
                      highlightColor: 'text-green-600'
                    },
                    {
                      label: 'Kosten per jaar',
                      values: productsData.map(p => `€${(p.pricePerWash * washesPerYear).toFixed(2)}`),
                      subtitle: `(${washesPerYear} wasbeurten)`
                    }
                  ]}
                  products={productsData}
                />

                {/* Sustainability Comparison */}
                <ComparisonSection
                  title="Duurzaamheid"
                  icon={<Leaf className="h-5 w-5" />}
                  bgColor="bg-gradient-to-r from-green-50 to-green-100"
                  items={[
                    {
                      label: 'Duurzaamheidsscore',
                      values: productsData.map(p => p.sustainability ? `${p.sustainability}/10` : 'Geen data'),
                      custom: true,
                      renderCustom: (product: any) => product.sustainability ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(product.sustainability / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{product.sustainability}/10</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Geen data</span>
                      )
                    }
                  ]}
                  products={productsData}
                />

                {/* Performance Comparison */}
                <ComparisonSection
                  title="Prestaties & Reviews"
                  icon={<Star className="h-5 w-5" />}
                  bgColor="bg-gradient-to-r from-yellow-50 to-yellow-100"
                  items={[
                    {
                      label: 'Beoordeling',
                      values: productsData.map(p => p.rating ? `${p.rating} (${p.reviewCount})` : 'Geen reviews'),
                      custom: true,
                      renderCustom: (product: any) => product.rating ? (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-gray-500">({product.reviewCount})</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Geen reviews</span>
                      )
                    }
                  ]}
                  products={productsData}
                />

                {/* Availability Comparison */}
                <ComparisonSection
                  title="Beschikbaarheid"
                  icon={<Package className="h-5 w-5" />}
                  bgColor="bg-gradient-to-r from-purple-50 to-purple-100"
                  items={[
                    {
                      label: 'Voorraad',
                      values: productsData.map(p => p.inStock ? 'Op voorraad' : 'Uitverkocht'),
                      custom: true,
                      renderCustom: (product: any) => product.inStock ? (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Op voorraad
                        </span>
                      ) : (
                        <span className="text-red-600 text-sm font-medium flex items-center">
                          <X className="h-3 w-3 mr-1" />
                          Uitverkocht
                        </span>
                      )
                    }
                  ]}
                  products={productsData}
                />

                {/* Action Buttons */}
                <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
                  {productsData.map((product) => (
                    <div key={product.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.supplier}</div>
                        </div>
                        {product.url && (
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            Bekijk →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Tip: Kies op basis van jouw prioriteiten</h3>
                <p className="text-gray-600 text-sm">
                  Voor de laagste prijs per wasbeurt, kijk naar de groene prijzen. 
                  Voor duurzaamheid, let op de duurzaamheidsscore. 
                  Voor betrouwbaarheid, check de reviews en beoordelingen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonSection({ title, icon, bgColor, items, products }: any) {
  return (
    <div className={`${bgColor} rounded-xl p-4`}>
      <div className="flex items-center space-x-2 mb-3">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {items.map((item: any, idx: number) => (
          <div key={idx}>
            <div className="text-sm font-medium text-gray-700 mb-2">
              {item.label}
              {item.subtitle && (
                <span className="text-xs text-gray-500 ml-1">{item.subtitle}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {products.map((product: any, pidx: number) => (
                <div key={pidx} className="bg-white rounded-lg p-2">
                  <div className="text-xs text-gray-500">{product.name}</div>
                  {item.custom && item.renderCustom ? (
                    item.renderCustom(product)
                  ) : (
                    <div className={`text-sm font-medium ${
                      item.highlight ? (item.highlightColor || 'text-gray-900') : 'text-gray-700'
                    }`}>
                      {item.values[pidx]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}