# Vaatwasstrips Comparison Tool Implementation Guide

## 📋 Overview

This guide implements a comparison tool that allows users to select products for side-by-side comparison, with a focus on sustainability scores and detailed criteria breakdown.

## 🏗️ Architecture Overview

### Component Structure
```
components/
├── ComparisonCheckbox.tsx      # Checkbox component for each product card
├── ComparisonBar.tsx           # Fixed bottom bar showing selected products
├── ComparisonModal.tsx         # Full comparison view (modal/page)
└── ComparisonContext.tsx       # React context for comparison state

hooks/
└── useComparison.ts           # Custom hook for comparison logic

utils/
├── calculateSustainabilityScore.ts  # Auto-calculate scores from data
└── comparisonData.ts               # Data structure for comparisons
```

## 📊 Data Structure

### 1. Enhanced Product Interface

```typescript
// types/product.ts
export interface SustainabilityMetrics {
  verpakking: {
    score: number;
    details: {
      plasticFree: boolean;
      recyclable: boolean;
      compostable: boolean;
      certified: string[];
    };
  };
  ingredienten: {
    score: number;
    details: {
      biodegradable: boolean;
      certifications: string[];
      toxicityLevel: 'low' | 'medium' | 'high';
      fragranceFree: boolean;
    };
  };
  productie: {
    score: number;
    details: {
      location: string;
      co2Compensated: boolean;
      transportMethod: string;
      renewableEnergy: boolean;
    };
  };
  bedrijf: {
    score: number;
    details: {
      transparency: boolean;
      socialImpact: boolean;
      warranty: number; // days
      customerService: 'dutch' | 'international';
    };
  };
}

export interface ComparisonProduct extends Product {
  sustainabilityMetrics: SustainabilityMetrics;
  comparativeData: {
    pricePerWash: number;
    washesPerYear: number;
    yearlyPrice: number;
    packagingWastePerYear: number; // grams
    co2PerWash: number; // grams
  };
}
```

### 2. Relevant Comparison Data Points

```typescript
// Based on your methodology, these are the key comparison points:
const comparisonCategories = {
  price: {
    label: 'Prijs',
    items: [
      'pricePerWash',
      'bulkDiscount',
      'shippingCost',
      'yearlyPrice'
    ]
  },
  sustainability: {
    label: 'Duurzaamheid',
    items: [
      'totalScore',
      'verpakkingScore',
      'ingredientenScore',
      'productieScore',
      'bedrijfScore'
    ]
  },
  performance: {
    label: 'Prestaties',
    items: [
      'rating',
      'reviewCount',
      'washingPower',
      'fragranceOptions'
    ]
  },
  availability: {
    label: 'Beschikbaarheid',
    items: [
      'inStock',
      'deliveryTime',
      'availableAt',
      'variants'
    ]
  }
};
```

## 🛠️ Implementation Steps

### Step 1: Create Comparison Context

```typescript
// components/ComparisonContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ComparisonContextType {
  selectedProducts: string[];
  toggleProduct: (productId: string) => void;
  clearSelection: () => void;
  isSelected: (productId: string) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);
const MAX_COMPARISON_ITEMS = 4;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        // Show toast notification
        alert(`Maximaal ${MAX_COMPARISON_ITEMS} producten vergelijken`);
        return prev;
      }
      return [...prev, productId];
    });
  };

  const clearSelection = () => setSelectedProducts([]);
  const isSelected = (productId: string) => selectedProducts.includes(productId);
  const canAddMore = selectedProducts.length < MAX_COMPARISON_ITEMS;

  return (
    <ComparisonContext.Provider value={{
      selectedProducts,
      toggleProduct,
      clearSelection,
      isSelected,
      canAddMore
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
};
```

### Step 2: Add Comparison Checkbox to Product Cards

```typescript
// components/ComparisonCheckbox.tsx
import { useComparison } from './ComparisonContext';
import { Check } from 'lucide-react';

interface ComparisonCheckboxProps {
  productId: string;
  productName: string;
}

export function ComparisonCheckbox({ productId, productName }: ComparisonCheckboxProps) {
  const { toggleProduct, isSelected, canAddMore } = useComparison();
  const selected = isSelected(productId);
  
  return (
    <label className="flex items-center space-x-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={selected}
        onChange={() => toggleProduct(productId)}
        disabled={!selected && !canAddMore}
        className="sr-only"
      />
      <div className={`
        w-5 h-5 rounded border-2 transition-all
        ${selected 
          ? 'bg-blue-600 border-blue-600' 
          : 'border-gray-300 group-hover:border-gray-400'
        }
        ${!selected && !canAddMore ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className="text-sm text-gray-600">Vergelijk</span>
    </label>
  );
}

// Update OptimizedProductCard.tsx to include this checkbox
// Add in the card header or footer:
<ComparisonCheckbox productId={product.id} productName={product.name} />
```

### Step 3: Create Comparison Bar

```typescript
// components/ComparisonBar.tsx
import { useComparison } from './ComparisonContext';
import { X } from 'lucide-react';
import Link from 'next/link';

export function ComparisonBar() {
  const { selectedProducts, clearSelection } = useComparison();
  
  if (selectedProducts.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {selectedProducts.length} product{selectedProducts.length > 1 ? 'en' : ''} geselecteerd
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={clearSelection}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Wis selectie
          </button>
          
          <Link
            href={`/vergelijk?products=${selectedProducts.join(',')}`}
            className="btn-primary px-6 py-2 rounded-xl"
          >
            Vergelijk producten →
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Create Comparison Page/Modal

```typescript
// app/vergelijk/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProductsByIds } from '@/lib/products';

export default function VergelijkPage() {
  const searchParams = useSearchParams();
  const productIds = searchParams.get('products')?.split(',') || [];
  const [products, setProducts] = useState<ComparisonProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const loadedProducts = await getProductsByIds(productIds);
      setProducts(loadedProducts);
      setLoading(false);
    }
    loadProducts();
  }, [productIds]);

  if (loading) return <div>Laden...</div>;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vergelijk Vaatwasstrips</h1>
      
      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4">Eigenschap</th>
              {products.map(product => (
                <th key={product.id} className="p-4 text-center">
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.supplier}</div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {/* Price Section */}
            <tr className="bg-gray-50">
              <td colSpan={products.length + 1} className="p-2 font-semibold">
                💰 Prijs
              </td>
            </tr>
            <tr>
              <td className="p-4">Prijs per wasbeurt</td>
              {products.map(product => (
                <td key={product.id} className="p-4 text-center">
                  €{product.pricePerWash.toFixed(3)}
                </td>
              ))}
            </tr>
            
            {/* Sustainability Section */}
            <tr className="bg-gray-50">
              <td colSpan={products.length + 1} className="p-2 font-semibold">
                🌱 Duurzaamheid
              </td>
            </tr>
            <tr>
              <td className="p-4">Totale score</td>
              {products.map(product => (
                <td key={product.id} className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(product.sustainability / 10) * 100}%` }}
                      />
                    </div>
                    <span className="ml-2">{product.sustainability}/10</span>
                  </div>
                </td>
              ))}
            </tr>
            
            {/* Add more rows for each comparison criterion */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Step 5: Automated Sustainability Score Calculation

```typescript
// utils/calculateSustainabilityScore.ts
import { SustainabilityMetrics } from '@/types/product';

interface ScoreWeights {
  verpakking: 0.25;
  ingredienten: 0.30;
  productie: 0.25;
  bedrijf: 0.20;
}

const weights: ScoreWeights = {
  verpakking: 0.25,
  ingredienten: 0.30,
  productie: 0.25,
  bedrijf: 0.20
};

export function calculateSustainabilityScore(productData: any): SustainabilityMetrics {
  // Verpakking Score (25%)
  const verpakkingScore = calculateVerpakkingScore({
    plasticFree: !productData.packaging?.includes('plastic'),
    recyclable: productData.certifications?.includes('recyclable'),
    compostable: productData.packaging?.includes('compostable'),
    certified: productData.certifications || []
  });

  // Ingrediënten Score (30%)
  const ingredientenScore = calculateIngredientenScore({
    biodegradable: productData.certifications?.includes('OECD 301B'),
    certifications: productData.certifications || [],
    toxicityLevel: determineToxyLevel(productData),
    fragranceFree: productData.features?.includes('fragrance-free')
  });

  // Productie Score (25%)
  const productieScore = calculateProductieScore({
    location: productData.productionLocation || 'Unknown',
    co2Compensated: productData.features?.includes('CO2-neutral'),
    transportMethod: 'standard',
    renewableEnergy: false
  });

  // Bedrijf Score (20%)
  const bedrijfScore = calculateBedrijfScore({
    transparency: productData.transparencyLevel || false,
    socialImpact: productData.socialImpact || false,
    warranty: productData.warrantyDays || 30,
    customerService: productData.dutchSupport ? 'dutch' : 'international'
  });

  return {
    verpakking: { score: verpakkingScore, details: {...} },
    ingredienten: { score: ingredientenScore, details: {...} },
    productie: { score: productieScore, details: {...} },
    bedrijf: { score: bedrijfScore, details: {...} }
  };
}

// Individual scoring functions
function calculateVerpakkingScore(details: any): number {
  let score = 6.0; // Base score
  if (details.plasticFree) score += 2.0;
  if (details.recyclable) score += 1.0;
  if (details.compostable) score += 1.0;
  return Math.min(10, score);
}

// ... implement other scoring functions
```

## 🎨 UI/UX Considerations

### Mobile Optimization
- Use horizontal scrolling for comparison table on mobile
- Maximum 2-3 products visible at once on small screens
- Sticky row headers for easy reference
- Collapsible sections for detailed criteria

### Visual Indicators
- Green/orange/red color coding for scores
- Progress bars for numerical comparisons
- Icons for certifications and features
- Highlight best values in each row

### User Flow
1. User browses products on homepage
2. Clicks "Vergelijk" checkbox on interesting products
3. Comparison bar appears at bottom
4. Clicks "Vergelijk producten" to see full comparison
5. Can remove/add products from comparison view

## 📱 Mobile-First Comparison Design

```typescript
// For mobile screens, use card-based comparison instead of table
<div className="grid grid-cols-1 md:hidden gap-4">
  {comparisonCategories.map(category => (
    <div key={category.label} className="bg-white rounded-xl p-4 border">
      <h3 className="font-semibold mb-4">{category.label}</h3>
      
      <div className="space-y-3">
        {category.items.map(item => (
          <div key={item}>
            <h4 className="text-sm text-gray-600 mb-2">{item.label}</h4>
            <div className="grid grid-cols-2 gap-2">
              {products.map(product => (
                <div key={product.id} className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">{product.name}</div>
                  <div className="font-medium">{product[item.key]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>
```

## 🔄 Integration with Existing Code

### Update HomePage.tsx
```typescript
// Wrap the component with ComparisonProvider
import { ComparisonProvider } from '@/components/ComparisonContext';
import { ComparisonBar } from '@/components/ComparisonBar';

export default function HomePage({ initialProducts }: HomePageProps) {
  return (
    <ComparisonProvider>
      {/* Existing homepage content */}
      
      {/* Add comparison bar at the end */}
      <ComparisonBar />
    </ComparisonProvider>
  );
}
```

### Update OptimizedProductCard
Add the comparison checkbox in the card header or footer area.

## 📊 Data Fetching for Comparison

```typescript
// lib/products.ts
export async function getProductsByIds(ids: string[]): Promise<ComparisonProduct[]> {
  // Fetch products from your database
  const products = await db.product.findMany({
    where: { id: { in: ids } },
    include: {
      variants: true,
      certifications: true,
      reviews: true
    }
  });
  
  // Calculate sustainability scores
  return products.map(product => ({
    ...product,
    sustainabilityMetrics: calculateSustainabilityScore(product),
    comparativeData: calculateComparativeData(product)
  }));
}
```

## 🚀 Next Steps

1. **Phase 1**: Implement basic comparison selection and UI
2. **Phase 2**: Add automated sustainability scoring
3. **Phase 3**: Integrate with real product data from scrapers
4. **Phase 4**: Add advanced features (export, share, save comparisons)

This implementation provides a solid foundation for comparing dishwasher strips with a focus on sustainability metrics while maintaining good UX across devices.