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

// Base Product interface matching your database schema
export interface Product {
  id: string;
  slug: string;
  name: string;
  supplier: string;
  description?: string | null;
  longDescription?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  
  // Pricing
  currentPrice?: number | null;
  pricePerWash?: number | null;
  washesPerPack: number;
  currency: string;
  
  // Stock & Availability
  inStock: boolean;
  availability?: string | null;
  lastChecked: Date;
  
  // Ratings
  rating?: number | null;
  reviewCount: number;
  
  // Sustainability
  sustainability?: number | null;
  
  // Features
  features: string[];
  pros: string[];
  cons: string[];
  
  // Display
  displayOrder: number;
  
  // SEO
  metaTitle?: string | null;
  metaDescription?: string | null;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  description?: string | null;
  washCount: number;
  price: number;
  pricePerWash: number;
  currency: string;
  inStock: boolean;
  isDefault: boolean;
  scrapedAt: Date;
  url?: string | null;
  createdAt: Date;
  updatedAt: Date;
}