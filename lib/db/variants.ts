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
    const defaultVariant = variants.find((v: any) => v.isDefault) || variants[0];
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