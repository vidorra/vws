'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TrendingDown, Award, Star, ExternalLink } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  supplier: string;
  currentPrice: number | null;
  pricePerWash?: number | null;
  washesPerPack: number | null;
  rating?: number | null;
  reviewCount: number;
  sustainability?: number | null;
  features?: string[] | null;
  pros?: string[] | null;
  cons?: string[] | null;
  availability?: string | null;
  inStock: boolean;
  url?: string | null;
  slug: string;
}

interface ProductFiltersProps {
  products: Product[];
}

// Helper function to get product badges
function getProductBadges(product: Product) {
  const badges = [];
  
  if (product.pricePerWash && product.pricePerWash <= 0.20) {
    badges.push('Beste waarde');
  }
  
  // Add trending badge for products with high ratings
  if (product.rating && product.rating >= 4.5) {
    badges.push('Trending');
  }
  
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

export default function ProductFilters({ products }: ProductFiltersProps) {
  const [filter, setFilter] = useState<'all' | 'inStock' | 'trending' | 'bestValue'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'sustainability'>('price');

  const filteredAndSortedProducts = useMemo(() => {
    // First, filter products
    let filtered = [...products];
    
    switch (filter) {
      case 'inStock':
        filtered = filtered.filter(p => p.inStock);
        break;
      case 'trending':
        filtered = filtered.filter(p => p.rating && p.rating >= 4.5);
        break;
      case 'bestValue':
        filtered = filtered.filter(p => p.pricePerWash && p.pricePerWash <= 0.20);
        break;
    }
    
    // Then, sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = a.pricePerWash || a.currentPrice || 0;
          const priceB = b.pricePerWash || b.currentPrice || 0;
          return priceA - priceB;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'sustainability':
          return (b.sustainability || 0) - (a.sustainability || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [products, filter, sortBy]);

  return (
    <>
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              filter === 'all' 
                ? 'btn-primary' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span>Alle producten</span>
          </button>
          <button 
            onClick={() => setFilter('inStock')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              filter === 'inStock' 
                ? 'btn-primary' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span>Op voorraad</span>
          </button>
          <button 
            onClick={() => setFilter('trending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              filter === 'trending' 
                ? 'btn-primary' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <TrendingDown className="h-4 w-4" />
            <span>Trending</span>
          </button>
          <button 
            onClick={() => setFilter('bestValue')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              filter === 'bestValue' 
                ? 'btn-primary' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Beste waarde</span>
          </button>
        </div>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'sustainability')}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
        >
          <option value="price">Sorteer op prijs</option>
          <option value="rating">Sorteer op beoordeling</option>
          <option value="sustainability">Sorteer op duurzaamheid</option>
        </select>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {filteredAndSortedProducts.map((product) => {
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
                        €{product.pricePerWash ? product.pricePerWash.toFixed(2) : '0.00'}
                      </div>
                      <div className="text-sm text-gray-600">per wasbeurt</div>
                      <div className="text-sm text-gray-400 line-through">€{originalPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">€{product.currentPrice ? product.currentPrice.toFixed(2) : '0.00'}</div>
                      <div className="text-sm text-gray-600">{product.washesPerPack || 0} wasbeurten</div>
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

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Geen producten gevonden met de huidige filters.</p>
        </div>
      )}
    </>
  );
}