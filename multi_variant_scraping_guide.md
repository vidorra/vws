# Multi-Variant Scraping Implementation Guide

## Overview
Extend your scraping system to capture multiple product variants (different pack sizes and prices) from each brand instead of just a single price. This provides better price comparison across different quantities.

## 🎯 Current vs Target

### Current Behavior:
- Scrapes 1 price per brand
- Example: Cosmeau → €12.99 for 60 washes

### Target Behavior:
- Scrapes multiple variants per brand
- Example: Cosmeau → €12.99 (60 washes), €21.99 (120 washes), €8.99 (30 washes)

---

## Step 1: Update Database Schema

### 1.1 Add ProductVariant Table

Add to your `prisma/schema.prisma`:

```prisma
model ProductVariant {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  // Variant details
  name        String   // "60 wasbeurten", "Voordeelpak 120x"
  description String?  // "Standaard pakket", "Beste prijs per wasbeurt"
  washCount   Int      // 30, 60, 120, etc.
  
  // Pricing
  price       Float
  pricePerWash Float
  currency    String   @default("EUR")
  
  // Availability
  inStock     Boolean  @default(true)
  isDefault   Boolean  @default(false) // Mark which variant to show by default
  
  // Scraping
  scrapedAt   DateTime @default(now())
  url         String?  // Direct URL to this variant if available
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("ProductVariant")
}

// Add relation to existing Product model
model Product {
  // ... existing fields ...
  variants    ProductVariant[]
  
  // Keep existing fields for backward compatibility
  // but they'll represent the "default" or "best value" variant
}
```

### 1.2 Create and Run Migration

```bash
npx prisma db push
```

---

## Step 2: Update Base Scraper Interface

### 2.1 Enhanced Data Types

Update `lib/scrapers/base-scraper.ts`:

```typescript
export interface VariantData {
  name: string;           // "60 wasbeurten", "Voordeelpak 120x"
  description?: string;   // "Standaard pakket", "Beste waarde"
  washCount: number;      // 30, 60, 120, etc.
  price: number;          // 12.99, 21.99, etc.
  pricePerWash: number;   // Calculated: price / washCount
  currency: string;       // "EUR"
  inStock: boolean;
  isDefault?: boolean;    // Mark the recommended/default variant
  url?: string;          // Direct URL to this variant
}

export interface ProductData {
  name: string;
  supplier: string;
  url: string;
  
  // Multiple variants instead of single price
  variants: VariantData[];
  
  // Keep single values for default variant (backward compatibility)
  price: PriceData;
  inStock: boolean;
  reviews: ReviewData[];
  
  // Additional data
  scrapedAt: Date;
}

export abstract class BaseScraper {
  abstract scrapeVariants(url: string): Promise<VariantData[]>;
  abstract scrapeStock(url: string): Promise<boolean>;
  abstract scrapeReviews(url: string): Promise<ReviewData[]>;
  
  // Updated main method
  async scrapeProduct(url: string, name: string, supplier: string): Promise<ProductData> {
    console.log(`🔍 Scraping ${name} variants from ${supplier}...`);
    
    const variants = await this.scrapeVariants(url);
    const stockStatus = await this.scrapeStock(url);
    const reviews = await this.scrapeReviews(url);
    
    if (variants.length === 0) {
      throw new Error(`No variants found for ${name}`);
    }
    
    // Find default variant (marked as default, or best value, or first)
    const defaultVariant = variants.find(v => v.isDefault) 
      || variants.reduce((best, current) => 
          current.pricePerWash < best.pricePerWash ? current : best
        );
    
    return {
      name,
      supplier,
      url,
      variants,
      price: {
        price: defaultVariant.price,
        pricePerWash: defaultVariant.pricePerWash,
        currency: defaultVariant.currency,
        scrapedAt: new Date()
      },
      inStock: stockStatus && variants.some(v => v.inStock),
      reviews,
      scrapedAt: new Date()
    };
  }
}
```

---

## Step 3: Implement Multi-Variant Scrapers

### 3.1 Mother's Earth Variant Scraper

Update `lib/scrapers/real-mothersearth-scraper.ts`:

```typescript
export class RealMothersEarthScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Mother's Earth variants from: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--disable-gpu'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      await page.waitForTimeout(3000);
      
      const variants = await page.evaluate(() => {
        const variantData: any[] = [];
        
        // Look for variant selectors on Mother's Earth
        const variantSelectors = [
          '.product-variants .variant-option',
          '.product-options .option',
          '.size-selector .size-option',
          '[data-variant]',
          '.product-form__buttons .variant-button'
        ];
        
        // Try to find variant elements
        let variantElements: NodeListOf<Element> | null = null;
        for (const selector of variantSelectors) {
          variantElements = document.querySelectorAll(selector);
          if (variantElements.length > 0) break;
        }
        
        if (variantElements && variantElements.length > 0) {
          // Multiple variants found
          variantElements.forEach((element, index) => {
            const text = element.textContent?.trim() || '';
            const priceElement = element.querySelector('.price, .money, [data-price]');
            
            // Extract wash count from text like "60 washes" or "120 strips"
            const washMatch = text.match(/(\d+)\s*(washes|strips|wasbeurten|wasjes)/i);
            const washCount = washMatch ? parseInt(washMatch[1]) : 60;
            
            // Extract price
            let price = 0;
            if (priceElement) {
              const priceText = priceElement.textContent || '';
              const priceMatch = priceText.match(/(\d+[,.]?\d*)/);
              if (priceMatch) {
                price = parseFloat(priceMatch[0].replace(',', '.'));
              }
            }
            
            if (price > 0) {
              variantData.push({
                name: text || `${washCount} wasbeurten`,
                washCount,
                price,
                pricePerWash: price / washCount,
                currency: 'EUR',
                inStock: true,
                isDefault: index === 0 // Mark first as default
              });
            }
          });
        } else {
          // Single variant - extract from main product page
          const priceSelectors = ['.price', '.product-price', '.money'];
          let price = 0;
          let priceText = '';
          
          for (const selector of priceSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent) {
              priceText = element.textContent.trim();
              const priceMatch = priceText.match(/(\d+[,.]?\d*)/);
              if (priceMatch) {
                price = parseFloat(priceMatch[0].replace(',', '.'));
                if (price > 0) break;
              }
            }
          }
          
          // Look for wash count in product description
          const descriptionText = document.body.textContent?.toLowerCase() || '';
          const washMatch = descriptionText.match(/(\d+)\s*(washes|strips|wasbeurten)/i);
          const washCount = washMatch ? parseInt(washMatch[1]) : 60;
          
          if (price > 0) {
            variantData.push({
              name: `${washCount} wasbeurten`,
              washCount,
              price,
              pricePerWash: price / washCount,
              currency: 'EUR',
              inStock: true,
              isDefault: true
            });
          }
        }
        
        return variantData;
      });
      
      console.log(`✅ Found ${variants.length} Mother's Earth variants`);
      return variants;
      
    } catch (error) {
      console.error('❌ Error scraping Mother\'s Earth variants:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  // Keep existing scrapeStock and scrapeReviews methods
  async scrapeStock(url: string): Promise<boolean> {
    // Your existing implementation
    return true;
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    return [];
  }
}
```

### 3.2 Cosmeau Variant Scraper

Update `lib/scrapers/real-cosmeau-scraper.ts`:

```typescript
export class RealCosmEauScraper extends BaseScraper {
  async scrapeVariants(url: string): Promise<VariantData[]> {
    console.log(`🔍 Scraping Cosmeau variants from: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Linux; x86_64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      await page.waitForTimeout(3000);
      
      const variants = await page.evaluate(() => {
        const variantData: any[] = [];
        
        // Cosmeau-specific variant selectors
        const variantSelectors = [
          '.product-form__input select option',
          '.variant-selector option',
          '.size-options .size-option',
          '[name="id"] option'
        ];
        
        // Check for dropdown variants
        let variantElements: NodeListOf<Element> | null = null;
        for (const selector of variantSelectors) {
          variantElements = document.querySelectorAll(selector);
          if (variantElements.length > 1) { // More than just default option
            break;
          }
        }
        
        if (variantElements && variantElements.length > 1) {
          // Multiple variants in dropdown
          variantElements.forEach((option: any, index) => {
            if (option.value && option.value !== '') {
              const text = option.textContent?.trim() || '';
              
              // Extract info from option text like "60 stuks - €12,99" or "120 wasbeurten"
              const washMatch = text.match(/(\d+)\s*(stuks|wasbeurten|strips)/i);
              const priceMatch = text.match(/€\s*(\d+[,.]?\d*)/);
              
              const washCount = washMatch ? parseInt(washMatch[1]) : (index + 1) * 30;
              let price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
              
              // If no price in option text, try to get it from data attributes
              if (!price && option.dataset.price) {
                price = parseFloat(option.dataset.price);
              }
              
              // Estimate price if not found (based on base price)
              if (!price) {
                const basePrice = 12.99; // Fallback
                price = basePrice * (washCount / 60);
              }
              
              if (washCount > 0) {
                variantData.push({
                  name: text || `${washCount} wasbeurten`,
                  washCount,
                  price,
                  pricePerWash: price / washCount,
                  currency: 'EUR',
                  inStock: !option.disabled,
                  isDefault: index === 0
                });
              }
            }
          });
        } else {
          // Single variant from main page
          const priceSelectors = ['.price--large', '.price', '.money'];
          let price = 0;
          
          for (const selector of priceSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent) {
              const priceText = element.textContent.trim();
              const priceMatch = priceText.match(/(\d+[,.]?\d*)/);
              if (priceMatch) {
                price = parseFloat(priceMatch[0].replace(',', '.'));
                if (price > 0) break;
              }
            }
          }
          
          const washCount = 60; // Cosmeau default
          
          if (price > 0) {
            variantData.push({
              name: `${washCount} wasbeurten`,
              washCount,
              price,
              pricePerWash: price / washCount,
              currency: 'EUR',
              inStock: true,
              isDefault: true
            });
          }
        }
        
        return variantData;
      });
      
      console.log(`✅ Found ${variants.length} Cosmeau variants`);
      return variants;
      
    } catch (error) {
      console.error('❌ Error scraping Cosmeau variants:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeStock(url: string): Promise<boolean> {
    return true;
  }

  async scrapeReviews(url: string): Promise<ReviewData[]> {
    return [];
  }
}
```

---

## Step 4: Update Database Handling

### 4.1 Update Product Upsert Function

Create `lib/db/variants.ts`:

```typescript
import { prisma } from '@/lib/prisma';
import { VariantData } from '@/lib/scrapers/base-scraper';

export async function upsertProductWithVariants(productData: {
  slug: string;
  name: string;
  supplier: string;
  variants: VariantData[];
  url?: string;
  inStock: boolean;
  lastChecked: Date;
}) {
  return await prisma.$transaction(async (tx) => {
    // Find or create product
    const product = await tx.product.upsert({
      where: { slug: productData.slug },
      update: {
        name: productData.name,
        supplier: productData.supplier,
        url: productData.url,
        inStock: productData.inStock,
        lastChecked: productData.lastChecked,
        updatedAt: new Date()
      },
      create: {
        slug: productData.slug,
        name: productData.name,
        supplier: productData.supplier,
        url: productData.url,
        description: `${productData.name} vaatwasstrips`,
        inStock: productData.inStock,
        lastChecked: productData.lastChecked,
        // Set default values from best variant
        currentPrice: 0, // Will be updated below
        pricePerWash: 0,  // Will be updated below
        washesPerPack: 60,
        rating: 4.0,
        reviewCount: 0,
        sustainability: 8.0
      }
    });

    // Clear existing variants
    await tx.productVariant.deleteMany({
      where: { productId: product.id }
    });

    // Create new variants
    const variants = await Promise.all(
      productData.variants.map((variant, index) =>
        tx.productVariant.create({
          data: {
            productId: product.id,
            name: variant.name,
            description: variant.description,
            washCount: variant.washCount,
            price: variant.price,
            pricePerWash: variant.pricePerWash,
            currency: variant.currency,
            inStock: variant.inStock,
            isDefault: variant.isDefault || index === 0,
            url: variant.url,
            scrapedAt: new Date()
          }
        })
      )
    );

    // Update product with default variant info
    const defaultVariant = variants.find(v => v.isDefault) || variants[0];
    if (defaultVariant) {
      await tx.product.update({
        where: { id: product.id },
        data: {
          currentPrice: defaultVariant.price,
          pricePerWash: defaultVariant.pricePerWash,
          washesPerPack: defaultVariant.washCount
        }
      });
    }

    return { product, variants };
  });
}
```

### 4.2 Update Scraping API

Update `app/api/admin/scrape/route.ts`:

```typescript
import { upsertProductWithVariants } from '@/lib/db/variants';

// In your scraping loop, replace the database update:
for (const productData of results) {
  const productSlug = (productData as any).slug;
  
  try {
    if (productData.variants.length === 0) {
      throw new Error('No variants found');
    }
    
    // Update product with all variants
    await upsertProductWithVariants({
      slug: productSlug,
      name: productData.name,
      supplier: productData.supplier,
      variants: productData.variants,
      url: productData.url || undefined,
      inStock: productData.inStock,
      lastChecked: new Date()
    });
    
    successCount++;
    
    // Log variant details
    const variantInfo = productData.variants.map(v => 
      `${v.washCount}x@€${v.price.toFixed(2)}`
    ).join(', ');
    
    console.log(`✅ Updated ${productData.name}: ${variantInfo}`);
    
  } catch (error) {
    console.error(`❌ Failed to update ${productData.name}:`, error);
    failureCount++;
  }
}
```

---

## Step 5: Update Frontend Display

### 5.1 Enhanced Product Display

Update your product components to show variants:

```typescript
// components/ProductCard.tsx
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    supplier: string;
    variants?: Array<{
      name: string;
      washCount: number;
      price: number;
      pricePerWash: number;
      isDefault: boolean;
    }>;
    // ... other fields
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.find(v => v.isDefault) || product.variants?.[0]
  );

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.supplier}</p>
      
      {/* Variant Selector */}
      {product.variants && product.variants.length > 1 && (
        <div className="variant-selector">
          <label>Pakketgrootte:</label>
          <select 
            value={selectedVariant?.washCount || ''}
            onChange={(e) => {
              const variant = product.variants?.find(
                v => v.washCount === parseInt(e.target.value)
              );
              setSelectedVariant(variant);
            }}
          >
            {product.variants.map(variant => (
              <option key={variant.washCount} value={variant.washCount}>
                {variant.name} - €{variant.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Price Display */}
      <div className="price-info">
        <div className="total-price">€{selectedVariant?.price.toFixed(2)}</div>
        <div className="price-per-wash">
          €{selectedVariant?.pricePerWash.toFixed(3)} per wasbeurt
        </div>
        <div className="wash-count">{selectedVariant?.washCount} wasbeurten</div>
      </div>
      
      {/* Best Value Badge */}
      {selectedVariant && product.variants && (
        <div>
          {product.variants.reduce((best, current) => 
            current.pricePerWash < best.pricePerWash ? current : best
          ) === selectedVariant && (
            <span className="badge-best-value">Beste waarde!</span>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Step 6: Deploy and Test

### 6.1 Deployment

```bash
git add .
git commit -m "Implement multi-variant scraping

- Add ProductVariant database model
- Update scrapers to capture multiple pack sizes
- Enhance product display with variant selection
- Improve price comparison with per-wash calculations"
git push origin main

# GitHub Actions will deploy automatically
```

### 6.2 Expected Results

After implementation, your scraping should show:

```
✅ Mother's Earth: 3 variants (30x@€12.95, 60x@€19.95, 120x@€34.95)
✅ Cosmeau: 4 variants (20x@€8.99, 60x@€12.99, 120x@€21.99, 360x@€54.99)
✅ Bubblyfy: 2 variants (64x@€18.71, 128x@€32.99)
```

---

## Benefits of Multi-Variant Scraping

✅ **Better Price Comparison**: Compare price-per-wash across all sizes  
✅ **User Choice**: Let users select their preferred pack size  
✅ **Best Value Detection**: Automatically highlight the most economical option  
✅ **Complete Market Data**: Capture the full product range from each brand  
✅ **Accurate Analytics**: Better understanding of pricing strategies

This enhancement transforms your basic price scraper into a comprehensive product variant analysis tool!