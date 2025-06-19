import React, { useState, useEffect } from 'react';
import { Star, ExternalLink, ChevronDown, Check, Leaf, Euro, Tag } from 'lucide-react';
import Link from 'next/link';

interface ProductVariant {
  id: number | string;
  name: string;
  washCount: number;
  price: number;
  pricePerWash: number;
  isDefault: boolean;
  originalPrice?: number;
}

interface ProductAwards {
  bestReview?: boolean;
  bestSustainability?: boolean;
  bestDealPrice?: boolean;
  bestTryPrice?: boolean;
}

interface OptimizedProductCardProps {
  product: {
    id: string;
    name: string;
    logo?: string;
    supplier: string;
    rating: number | null;
    reviewCount: number;
    inStock: boolean;
    url?: string | null;
    sustainabilityScore?: number | null;
    awards?: ProductAwards;
    colors?: {
      primary: string;
      secondary: string;
    };
    variants: ProductVariant[];
  };
}

// Helper function to get product color scheme
function getProductColorScheme(supplier: string) {
  const colorSchemes: Record<string, { primary: string; secondary: string; emoji: string }> = {
    "Wasstrip.nl": {
      primary: 'rgb(132, 204, 22)',
      secondary: 'rgb(236, 252, 203)',
      emoji: '🌿'
    },
    "Mother's Earth": {
      primary: 'rgb(34, 197, 94)',
      secondary: 'rgb(220, 252, 231)',
      emoji: '🌍'
    },
    "Bubblyfy": {
      primary: 'rgb(6, 182, 212)',
      secondary: 'rgb(207, 250, 254)',
      emoji: '💧'
    },
    "Cosmeau": {
      primary: 'rgb(59, 130, 246)',
      secondary: 'rgb(219, 234, 254)',
      emoji: '🧽'
    },
    "Bio-Suds": {
      primary: 'rgb(16, 185, 129)',
      secondary: 'rgb(209, 250, 229)',
      emoji: '🍃'
    },
    "Natuwash": {
      primary: 'rgb(34, 197, 94)',
      secondary: 'rgb(220, 252, 231)',
      emoji: '🌱'
    }
  };
  
  return colorSchemes[supplier] || {
    primary: 'rgb(107, 114, 128)',
    secondary: 'rgb(243, 244, 246)',
    emoji: '📦'
  };
}

export default function OptimizedProductCard({ product }: OptimizedProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find(v => v.isDefault) || product.variants[0]
  );
  const [showVariants, setShowVariants] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get color scheme
  const colorScheme = product.colors || getProductColorScheme(product.supplier);
  const logo = product.logo || getProductColorScheme(product.supplier).emoji;

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Find best value variant (lowest price per wash)
  const bestValueVariant = product.variants.reduce((best, current) => 
    current.pricePerWash < best.pricePerWash ? current : best
  );

  const handleVariantChange = async (variant: ProductVariant) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    setSelectedVariant(variant);
    setShowVariants(false);
    setLoading(false);
  };

  const savings = selectedVariant.originalPrice ? selectedVariant.originalPrice - selectedVariant.price : 0;
  const savingsPercentage = selectedVariant.originalPrice ? Math.round((savings / selectedVariant.originalPrice) * 100) : 0;
  const isBestValue = selectedVariant.id === bestValueVariant.id;

  // Mobile-first variant selector (modal-style)
  const MobileVariantSelector = () => (
    <>
      {/* Backdrop */}
      {showVariants && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowVariants(false)}
        />
      )}
      
      {/* Mobile Modal */}
      {showVariants && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-center">Kies pakketgrootte</h3>
          </div>
          
          <div className="p-4 space-y-3">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variant)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedVariant.id === variant.id 
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-4' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-900 mb-1">{variant.name}</div>
                    <div className="text-sm text-gray-600 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{variant.washCount} wasbeurten</span>
                      </div>
                      {variant.isDefault && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Standaard
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-lg">€{variant.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">€{variant.pricePerWash.toFixed(3)}/was</div>
                    {variant.originalPrice && variant.originalPrice > variant.price && (
                      <div className="text-xs text-gray-400 line-through">
                        €{variant.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 transition-all duration-300">
        
        {/* Header - Mobile Optimized */}
        <div className="p-4 md:p-6 pb-3 md:pb-4">
          {/* Logo and Product Name - Full Width */}
          <div className="flex items-center space-x-2 md:space-x-3 mb-3">
            <div className="text-2xl md:text-3xl flex-shrink-0">{logo}</div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 flex-1">{product.name}</h3>
          </div>
          
          {/* Review Score (left) and Award Badges (right) */}
          <div className="flex items-center justify-between">
            {/* Review Score - Left Side */}
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600">{product.rating || 4.0}</span>
              <span className="text-xs md:text-sm text-gray-400">({product.reviewCount})</span>
            </div>

            {/* Award Badges - Right Side */}
            <div className="flex flex-wrap gap-1 justify-end">
              {product.awards?.bestReview && (
                <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full whitespace-nowrap">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Beste review
                </span>
              )}
              {product.awards?.bestSustainability && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full whitespace-nowrap">
                  <Leaf className="h-3 w-3 mr-1" />
                  Meest duurzaam
                </span>
              )}
              {product.awards?.bestDealPrice && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full whitespace-nowrap">
                  <Euro className="h-3 w-3 mr-1" />
                  Beste deal prijs
                </span>
              )}
              {product.awards?.bestTryPrice && (
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full whitespace-nowrap">
                  <Tag className="h-3 w-3 mr-1" />
                  Beste try-out
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Variant Selector - Responsive */}
        <div className="px-4 md:px-6 pb-3 md:pb-4">
          <div className="relative">
            {/* Always show button for mobile, conditional for desktop */}
            <button
              onClick={() => setShowVariants(!showVariants)}
              className="w-full p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-gray-200 flex items-center justify-between hover:from-blue-100 hover:to-green-100 transition-all"
              disabled={loading}
            >
              <div className="text-left flex-1">
                <div className="font-medium text-gray-900">{selectedVariant.name}</div>
                <div className="text-sm text-gray-600 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{selectedVariant.washCount} wasbeurten</span>
                  </div>
                  {selectedVariant.isDefault && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Standaard
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${loading ? 'animate-spin' : ''} ${showVariants ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Mobile uses modal, desktop uses dropdown */}
            {isMobile ? (
              <MobileVariantSelector />
            ) : (
              showVariants && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl z-20">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant)}
                      className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0 transition-colors ${
                        selectedVariant.id === variant.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{variant.name}</div>
                          <div className="text-sm text-gray-600 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span>{variant.washCount} wasbeurten</span>
                            </div>
                            {variant.isDefault && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                Standaard
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">€{variant.price.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">€{variant.pricePerWash.toFixed(3)}/was</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Price Section - Mobile Optimized */}
        <div className="px-4 md:px-6 pb-3 md:pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline space-x-2">
              <span className={`font-bold text-gray-900 ${loading ? 'opacity-50' : ''} text-xl md:text-2xl`}>
                €{selectedVariant.price.toFixed(2)}
              </span>
              {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                <span className="text-sm md:text-lg text-gray-400 line-through">
                  €{selectedVariant.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {savingsPercentage > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs md:text-sm font-semibold rounded-full flex-shrink-0">
                -{savingsPercentage}%
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center text-xs md:text-sm text-gray-600 mb-3">
            <span>€{selectedVariant.pricePerWash.toFixed(3)} per wasbeurt</span>
            <span>{selectedVariant.washCount} wasbeurten</span>
          </div>
          
          {/* Sustainability Score - Mobile Optimized */}
          {product.sustainabilityScore && (
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-600">Duurzaamheid</span>
              <div className="flex items-center space-x-2">
                <div className="w-12 md:w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(product.sustainabilityScore / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700 min-w-0">
                  {product.sustainabilityScore}/10
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Mobile Optimized */}
        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="flex space-x-2">
            <button
              className={`flex-1 py-3 px-3 md:px-4 rounded-xl btn-primary text-center font-medium transition-all text-sm md:text-base ${
                product.inStock
                  ? 'text-white active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                backgroundColor: product.inStock ? colorScheme.primary : undefined
              }}
              disabled={!product.inStock || loading}
              onClick={() => {
                if (product.url && product.inStock) {
                  window.open(product.url, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {loading ? 'Laden...' : product.inStock ? 'Naar website' : 'Uitverkocht'}
            </button>
            <Link 
              href={`/merken/${product.supplier.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors active:scale-95 flex items-center justify-center"
            >
              <ExternalLink className="h-4 w-4 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}