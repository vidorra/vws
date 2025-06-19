# Simplified Award-Based Filtering Implementation Guide

## 📋 Overview
This guide shows how to implement the award-based filtering system using the **new card structure we created** with variants and minimal, essential filtering options.

---

## 🎯 Simplified Filtering Plan

Keep it simple with only these essential filters:
- **Alle producten** (default)
- **Beste reviews** (Star award)  
- **Meest duurzaam** (Leaf award)
- **Beste prijs** (Euro award)
- **Op voorraad**

**No complex multi-select or advanced filtering** - just clean, simple award-based filtering.

---

## 🚀 Implementation Steps

### Step 1: Update Product Interface
Add the awards system to your existing product type:

```typescript
// Add this to your product interface
interface ProductAwards {
  bestReview?: boolean;
  bestSustainability?: boolean;  
  bestPrice?: boolean;
}

interface Product {
  // ... your existing fields
  awards?: ProductAwards;
  variants: Array<{
    id: number;
    name: string;
    washCount: number;
    price: number;
    pricePerWash: number;
    isDefault: boolean;
    originalPrice?: number;
  }>;
}
```

### Step 2: Award Calculation Logic
Add this function to calculate which products get awards:

```typescript
// utils/calculateAwards.ts
export function calculateProductAwards(products: Product[]): Product[] {
  if (products.length === 0) return products;

  // Find the best in each category
  const bestRating = Math.max(...products.map(p => p.rating || 0));
  const bestSustainability = Math.max(...products.map(p => p.sustainabilityScore || 0));
  
  // Get best price from all variants across all products
  const allVariants = products.flatMap(p => p.variants || []);
  const bestPricePerWash = Math.min(...allVariants.map(v => v.pricePerWash));

  return products.map(product => {
    // Check if this product has the best price variant
    const hasBestPrice = product.variants?.some(v => v.pricePerWash === bestPricePerWash) || false;
    
    return {
      ...product,
      awards: {
        bestReview: product.rating === bestRating,
        bestSustainability: product.sustainabilityScore === bestSustainability,
        bestPrice: hasBestPrice
      }
    };
  });
}
```

### Step 3: Update Your Homepage Filter Section
Replace your current filter buttons with this simplified version:

```tsx
// In your homepage component (app/page.tsx)
import { Star, Leaf, Euro, Package } from 'lucide-react';

const [filter, setFilter] = useState('all');

const filters = [
  { key: 'all', label: 'Alle producten', icon: null },
  { key: 'best-review', label: 'Beste reviews', icon: Star },
  { key: 'most-sustainable', label: 'Meest duurzaam', icon: Leaf },
  { key: 'best-price', label: 'Beste prijs', icon: Euro },
  { key: 'in-stock', label: 'Op voorraad', icon: Package }
];

// Replace your current filter section with:
<div className="flex flex-wrap gap-2 mb-8">
  {filters.map(({ key, label, icon: Icon }) => (
    <button
      key={key}
      onClick={() => setFilter(key)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
        filter === key
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </button>
  ))}
</div>
```

### Step 4: Update Filter Logic
Replace your current filtering logic:

```tsx
// Filter logic
const filteredSuppliers = useMemo(() => {
  let filtered = [...suppliers];

  switch (filter) {
    case 'best-review':
      filtered = filtered.filter(p => p.awards?.bestReview === true);
      break;
    case 'most-sustainable':
      filtered = filtered.filter(p => p.awards?.bestSustainability === true);
      break;
    case 'best-price':
      filtered = filtered.filter(p => p.awards?.bestPrice === true);
      break;
    case 'in-stock':
      filtered = filtered.filter(p => p.inStock === true);
      break;
    case 'all':
    default:
      break;
  }

  return filtered;
}, [suppliers, filter]);
```

### Step 5: Integrate New Card Structure
Replace your current product cards with our new variant-enabled card structure. Here's the complete component integration:

```tsx
// Import the new card component
import OptimizedProductCard from './components/OptimizedProductCard';

// In your homepage grid section, replace the current card mapping:
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
  {filteredSuppliers.map((product) => (
    <OptimizedProductCard 
      key={product.id}
      product={product}
    />
  ))}
</div>
```

### Step 6: Update OptimizedProductCard to Accept Props
Modify your card component to accept real product data:

```tsx
// components/OptimizedProductCard.tsx
interface OptimizedProductCardProps {
  product: {
    id: number;
    name: string;
    logo: string;
    supplier: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    website?: string;
    sustainabilityScore: number;
    awards?: {
      bestReview?: boolean;
      bestSustainability?: boolean;
      bestPrice?: boolean;
    };
    colors: {
      primary: string;
      secondary: string;
    };
    variants: Array<{
      id: number;
      name: string;
      washCount: number;
      price: number;
      pricePerWash: number;
      isDefault: boolean;
      originalPrice?: number;
    }>;
  };
}

export default function OptimizedProductCard({ product }: OptimizedProductCardProps) {
  // Replace mockProduct with the actual product prop
  // All the existing logic stays the same, just use `product` instead of `mockProduct`
  
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find(v => v.isDefault) || product.variants[0]
  );
  
  // ... rest of your component logic stays exactly the same
  // Just replace all instances of `mockProduct` with `product`
}
```

---

## 📊 Data Integration

### Update Your Homepage Data Flow:

```tsx
// In app/page.tsx
import { calculateProductAwards } from '../utils/calculateAwards';

export default function HomePage() {
  const [suppliers, setSuppliers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch your products (replace with your actual data fetching)
    const fetchProducts = async () => {
      try {
        // Your existing product fetching logic
        const products = await getProducts(); // or however you get your data
        
        // Calculate awards and set state
        const productsWithAwards = calculateProductAwards(products);
        setSuppliers(productsWithAwards);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data if needed
        setSuppliers(mockProducts);
      }
    };
    
    fetchProducts();
  }, []);

  // ... rest of your component
}
```

---

## 🎨 Award Badge Display

The new card structure already includes award display logic. Make sure your product data includes the colors for each brand:

```typescript
// Example product data structure
const productData = {
  id: 1,
  name: "Cleanly",
  logo: "✨",
  supplier: "CLEANLY",
  rating: 4.6,
  reviews: 1250,
  inStock: true,
  sustainabilityScore: 8.7,
  awards: {
    bestReview: true,    // Will show star badge
    bestSustainability: false,
    bestPrice: false
  },
  colors: {
    primary: "#f59e0b",     // Your brand colors
    secondary: "#fef3c7"
  },
  variants: [
    {
      id: 1,
      name: "Starterspack - 32 strips",
      washCount: 64,
      price: 15.95,
      pricePerWash: 0.25,
      isDefault: true,
      originalPrice: 19.95
    }
    // ... more variants
  ]
};
```

---

## 🧪 Testing Checklist

### Essential Tests:
- [ ] Award calculation works with your real product data
- [ ] Filter buttons correctly filter products
- [ ] Variant selector works on all product cards
- [ ] Award badges display correctly on cards
- [ ] Mobile responsive behavior works
- [ ] "Standaard" tag shows for default variants
- [ ] Button styling uses `rounded-xl btn-primary text-center`

### Quick Test:
1. Load homepage
2. Click "Beste reviews" filter → Should show only products with `bestReview: true`
3. Click on a product's variant dropdown → Should show all variants with pricing
4. Verify award badges appear in the card headers

---

## 🚀 Deployment

1. **Add the award calculation function**
2. **Update your homepage filter section** 
3. **Replace product cards with the new OptimizedProductCard**
4. **Update your product data to include awards and variants**
5. **Test the filtering functionality**

This keeps it simple and focused - just essential award-based filtering with your new card structure that includes variants. No overcomplicated multi-select or advanced features that you don't need! 🎯

---

## 💡 Key Benefits

✅ **Simple filtering** - Only 5 essential filter options
✅ **Award-based recognition** - Clear visual hierarchy  
✅ **Variant support** - Users can see all pack sizes and prices
✅ **Mobile optimized** - Bottom sheet on mobile, dropdown on desktop
✅ **Your existing design** - Uses your button classes and styling
✅ **Real data integration** - Works with your actual product data

This implementation gives you the award system benefits with the new card structure, without overcomplicating the filtering experience! 🚀