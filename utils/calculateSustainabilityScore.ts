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
  const verpakkingDetails = {
    plasticFree: !productData.packaging?.includes('plastic') && !productData.features?.some((f: string) => f.toLowerCase().includes('plastic')),
    recyclable: productData.features?.some((f: string) => f.toLowerCase().includes('recycl')) || false,
    compostable: productData.features?.some((f: string) => f.toLowerCase().includes('compost')) || false,
    certified: extractCertifications(productData)
  };
  const verpakkingScore = calculateVerpakkingScore(verpakkingDetails);

  // Ingrediënten Score (30%)
  const ingredientenDetails = {
    biodegradable: productData.features?.some((f: string) => 
      f.toLowerCase().includes('biologisch afbreekbaar') || 
      f.toLowerCase().includes('biodegradable') ||
      f.toLowerCase().includes('oecd 301b')
    ) || false,
    certifications: extractCertifications(productData),
    toxicityLevel: determineToxicityLevel(productData),
    fragranceFree: productData.features?.some((f: string) => 
      f.toLowerCase().includes('parfumvrij') || 
      f.toLowerCase().includes('fragrance-free') ||
      f.toLowerCase().includes('geurvrij')
    ) || false
  };
  const ingredientenScore = calculateIngredientenScore(ingredientenDetails);

  // Productie Score (25%)
  const productieDetails = {
    location: determineProductionLocation(productData),
    co2Compensated: productData.features?.some((f: string) => 
      f.toLowerCase().includes('co2') || 
      f.toLowerCase().includes('klimaatneutraal')
    ) || false,
    transportMethod: 'standard', // Default, could be enhanced with more data
    renewableEnergy: productData.features?.some((f: string) => 
      f.toLowerCase().includes('groene energie') || 
      f.toLowerCase().includes('renewable energy')
    ) || false
  };
  const productieScore = calculateProductieScore(productieDetails);

  // Bedrijf Score (20%)
  const bedrijfDetails = {
    transparency: productData.supplier ? isTransparentSupplier(productData.supplier) : false,
    socialImpact: productData.features?.some((f: string) => 
      f.toLowerCase().includes('social') || 
      f.toLowerCase().includes('fair trade')
    ) || false,
    warranty: 30, // Default warranty days
    customerService: (productData.supplier && isDutchSupplier(productData.supplier) ? 'dutch' : 'international') as 'dutch' | 'international'
  };
  const bedrijfScore = calculateBedrijfScore(bedrijfDetails);

  return {
    verpakking: { score: verpakkingScore, details: verpakkingDetails },
    ingredienten: { score: ingredientenScore, details: ingredientenDetails },
    productie: { score: productieScore, details: productieDetails },
    bedrijf: { score: bedrijfScore, details: bedrijfDetails }
  };
}

// Helper functions
function extractCertifications(productData: any): string[] {
  const certifications: string[] = [];
  const features = productData.features || [];
  
  const certKeywords = [
    'OECD 301B',
    'Ecocert',
    'EU Ecolabel',
    'Cradle to Cradle',
    'Leaping Bunny',
    'Vegan',
    'Cruelty-free',
    'FSC',
    'PEFC'
  ];
  
  features.forEach((feature: string) => {
    certKeywords.forEach(cert => {
      if (feature.toLowerCase().includes(cert.toLowerCase())) {
        certifications.push(cert);
      }
    });
  });
  
  return Array.from(new Set(certifications)); // Remove duplicates
}

function determineToxicityLevel(productData: any): 'low' | 'medium' | 'high' {
  const features = productData.features || [];
  const lowToxicityKeywords = ['hypoallergeen', 'mild', 'gentle', 'sensitive skin', 'dermatologisch getest'];
  const highToxicityKeywords = ['bleach', 'chlorine', 'ammonia'];
  
  const hasLowToxicity = features.some((f: string) => 
    lowToxicityKeywords.some(keyword => f.toLowerCase().includes(keyword))
  );
  
  const hasHighToxicity = features.some((f: string) => 
    highToxicityKeywords.some(keyword => f.toLowerCase().includes(keyword))
  );
  
  if (hasHighToxicity) return 'high';
  if (hasLowToxicity) return 'low';
  return 'medium';
}

function determineProductionLocation(productData: any): string {
  // Based on known supplier locations
  const supplierLocations: Record<string, string> = {
    "Wasstrip.nl": "Nederland",
    "Mother's Earth": "China",
    "Bubblyfy": "China",
    "Cosmeau": "Nederland",
    "Bio-Suds": "China",
    "Natuwash": "China"
  };
  
  return supplierLocations[productData.supplier] || "Unknown";
}

function isTransparentSupplier(supplier: string): boolean {
  // Suppliers known for transparency
  const transparentSuppliers = ["Cosmeau", "Natuwash", "Wasstrip.nl"];
  return transparentSuppliers.includes(supplier);
}

function isDutchSupplier(supplier: string): boolean {
  const dutchSuppliers = ["Wasstrip.nl", "Cosmeau"];
  return dutchSuppliers.includes(supplier);
}

// Individual scoring functions
function calculateVerpakkingScore(details: any): number {
  let score = 5.0; // Base score
  
  if (details.plasticFree) score += 2.5;
  if (details.recyclable) score += 1.5;
  if (details.compostable) score += 1.0;
  if (details.certified.length > 0) score += 0.5 * Math.min(details.certified.length, 2);
  
  return Math.min(10, score);
}

function calculateIngredientenScore(details: any): number {
  let score = 5.0; // Base score
  
  if (details.biodegradable) score += 2.0;
  if (details.fragranceFree) score += 1.0;
  if (details.toxicityLevel === 'low') score += 1.5;
  if (details.toxicityLevel === 'high') score -= 1.5;
  if (details.certifications.length > 0) score += 0.5 * Math.min(details.certifications.length, 3);
  
  return Math.min(10, Math.max(0, score));
}

function calculateProductieScore(details: any): number {
  let score = 5.0; // Base score
  
  // Location scoring
  if (details.location === 'Nederland') score += 2.5;
  else if (details.location === 'Europa') score += 1.5;
  else if (details.location === 'China') score -= 1.0;
  
  if (details.co2Compensated) score += 1.5;
  if (details.renewableEnergy) score += 1.0;
  
  return Math.min(10, Math.max(0, score));
}

function calculateBedrijfScore(details: any): number {
  let score = 5.0; // Base score
  
  if (details.transparency) score += 2.0;
  if (details.socialImpact) score += 1.5;
  if (details.customerService === 'dutch') score += 1.5;
  
  return Math.min(10, score);
}

// Calculate total sustainability score
export function calculateTotalSustainabilityScore(metrics: SustainabilityMetrics): number {
  const totalScore = 
    metrics.verpakking.score * weights.verpakking +
    metrics.ingredienten.score * weights.ingredienten +
    metrics.productie.score * weights.productie +
    metrics.bedrijf.score * weights.bedrijf;
  
  return Math.round(totalScore * 10) / 10; // Round to 1 decimal
}