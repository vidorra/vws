'use client';

import { useState, useEffect, useMemo } from 'react';
import OptimizedProductCard from '@/components/OptimizedProductCard';
import { calculateProductAwards } from '@/utils/calculateAwards';
import Link from 'next/link';
import { Check, Star, Leaf, Euro, Tag, Package, Info, ChevronDown } from 'lucide-react';
import { ComparisonProvider } from '@/components/ComparisonContext';
import { ComparisonBar } from '@/components/ComparisonBar';

interface HomePageProps {
  initialProducts: any[];
}

export default function HomePage({ initialProducts }: HomePageProps) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'reviews' | 'sustainability' | 'price' | 'tryout'>('default');
  const [packSize, setPackSize] = useState<'all' | 'standard' | 'large'>('all');
  const [loading, setLoading] = useState(true);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    // Transform products to include variants in the expected format
    const transformedProducts = initialProducts.map((product: any) => ({
      ...product,
      logo: undefined, // Will be set by color scheme
      sustainabilityScore: product.sustainability,
      variants: product.variants && product.variants.length > 0
        ? product.variants.map((v: any) => ({
            ...v,
            name: v.name
              .replace(/(\d+)\s*[Ss]tuks?/g, (match: string, num: string) => `${num} Pack${parseInt(num) > 1 ? 's' : ''}`)
              .replace(/(\d+)\s*[Ss]tuk/g, (match: string, num: string) => `${num} Pack${parseInt(num) > 1 ? 's' : ''}`)
          }))
        : [{
            id: `${product.id}-default`,
            name: `${product.washesPerPack || 60} wasbeurten`,
            washCount: product.washesPerPack || 60,
            price: product.currentPrice || 15.95,
            pricePerWash: product.pricePerWash || 0.25,
            isDefault: true
          }]
    }));
    
    // Calculate awards and set state
    const productsWithAwards = calculateProductAwards(transformedProducts);
    
    // Debug: Log products with awards
    console.log('Products with awards:', productsWithAwards.map((p: any) => ({
      name: p.name,
      awards: p.awards,
      lowestVariantPrice: p.variants ? Math.min(...p.variants.map((v: any) => v.pricePerWash)) : p.pricePerWash
    })));
    
    setSuppliers(productsWithAwards);
    setLoading(false);
  }, [initialProducts]);

  const sortOptions = [
    { key: 'default', label: 'Standaard', icon: null },
    { key: 'reviews', label: 'Reviews ↓', icon: Star },
    { key: 'sustainability', label: 'Duurzaam ↓', icon: Leaf },
    { key: 'price', label: 'Prijs ↑', icon: Euro },
    { key: 'tryout', label: 'Try-out ↑', icon: Tag }
  ];

  // Filter and sort logic
  const filteredSuppliers = useMemo(() => {
    let filtered = [...suppliers];

    // Apply sorting
    switch (sortBy) {
      case 'reviews':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'sustainability':
        filtered.sort((a, b) => (b.sustainability || 0) - (a.sustainability || 0));
        break;
      case 'price':
        filtered.sort((a, b) => {
          const priceA = Math.min(...(a.variants || []).map((v: any) => v.pricePerWash));
          const priceB = Math.min(...(b.variants || []).map((v: any) => v.pricePerWash));
          return priceA - priceB;
        });
        break;
      case 'tryout':
        filtered.sort((a, b) => {
          const priceA = Math.min(...(a.variants || []).map((v: any) => v.price));
          const priceB = Math.min(...(b.variants || []).map((v: any) => v.price));
          return priceA - priceB;
        });
        break;
      case 'default':
      default:
        // Keep original order
        break;
    }

    // Apply pack size filter
    if (packSize !== 'all') {
      filtered = filtered.map(product => {
        if (!product.variants || product.variants.length === 0) return product;
        
        const filteredVariants = product.variants.filter((variant: any) => {
          const washCount = variant.washCount || 60;
          if (packSize === 'standard') {
            return washCount <= 100; // Standard packs: 60-100 washes
          } else {
            return washCount > 100; // Large discount packs: 100+ washes
          }
        });

        // Only include products that have variants matching the filter
        if (filteredVariants.length > 0) {
          return { ...product, variants: filteredVariants };
        }
        return null;
      }).filter(Boolean);
    }

    return filtered;
  }, [suppliers, sortBy, packSize]);

  // Calculate stats from products
  const sortedProducts = [...suppliers].sort((a: any, b: any) => {
    const priceA = a.pricePerWash || a.currentPrice || 0;
    const priceB = b.pricePerWash || b.currentPrice || 0;
    return priceA - priceB;
  });

  const lowestPrice = sortedProducts.length > 0 && sortedProducts[0].pricePerWash
    ? sortedProducts[0].pricePerWash.toFixed(2)
    : '0.26';
    
  const lastProduct = sortedProducts[sortedProducts.length - 1];
  const highestPrice = sortedProducts.length > 0 && lastProduct?.pricePerWash !== null && lastProduct?.pricePerWash !== undefined
    ? lastProduct.pricePerWash.toFixed(2)
    : '0.48';
    
  const sustainabilityScores = suppliers
    .map((p: any) => p.sustainability)
    .filter((s: any) => s != null)
    .sort((a: number, b: number) => a - b);
    
  const minSustainability = sustainabilityScores.length > 0 ? sustainabilityScores[0].toFixed(1) : '6.2';
  const maxSustainability = sustainabilityScores.length > 0 ? sustainabilityScores[sustainabilityScores.length - 1].toFixed(1) : '9.4';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vaatwasstrips Vergelijker Nederland",
    "url": "https://vaatwasstripsvergelijker.nl",
    "description": "Onafhankelijke vergelijking van alle Nederlandse vaatwasstrips aanbieders",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://vaatwasstripsvergelijker.nl/zoeken?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <ComparisonProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main>
        {/* Hero Section with Background Image */}
        <div
          className="relative bg-cover bg-center"
          style={{
            width: 'calc(100% - 48px)',
            margin: '-96px auto 0 auto',
            backgroundImage: 'url(/hero.png)',
            minHeight: '70vh',
            height: '70vh',
            borderBottomLeftRadius: '1.5rem',
            borderBottomRightRadius: '1.5rem',
            borderTopLeftRadius: '0',
            borderTopRightRadius: '0'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40" style={{
            borderBottomLeftRadius: '1.5rem',
            borderBottomRightRadius: '1.5rem'
          }}></div>
          
          {/* Hero Content */}
          <div className="relative z-10 flex items-center h-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Vaatwasstrips Vergelijken Nederland
                </h1>
                <p className="text-xl md:text-2xl text-white mb-8">
                  Onafhankelijke vergelijking van alle Nederlandse aanbieders
                </p>
                <a
                  href="#vergelijking"
                  className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg rounded-xl"
                >
                  Bekijk Vergelijking →
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Feature List */}
          <div className="bg-white rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Transparante duurzaamheidsscores</span>
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Actuele prijzen van Nederlandse webshops</span>
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Geverifieerde reviews en beoordelingen</span>
              </div>
            </div>
          </div>
          


          {/* Product Filters and Cards - Using new award-based filtering */}
          <div id="vergelijking" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Nederlandse Vaatwasstrips Aanbieders Vergelijking
            </h2>
          
          {/* Sort and Filter Section */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
            {/* Sort Options */}
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key as any)}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 ${
                    sortBy === key
                      ? 'btn-primary'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 font-medium transition-all'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Pack Size Filter - Button Group */}
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                <button
                  onClick={() => setPackSize('all')}
                  className={`px-4 py-2 rounded-md text-sm ${
                    packSize === 'all'
                      ? 'btn-primary'
                      : 'text-gray-700 hover:bg-gray-50 font-medium transition-all'
                  }`}
                >
                  Alle maten
                </button>
                <button
                  onClick={() => setPackSize('standard')}
                  className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 ${
                    packSize === 'standard'
                      ? 'btn-primary'
                      : 'text-gray-700 hover:bg-gray-50 font-medium transition-all'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  Standaard packs
                </button>
                <button
                  onClick={() => setPackSize('large')}
                  className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 ${
                    packSize === 'large'
                      ? 'btn-primary'
                      : 'text-gray-700 hover:bg-gray-50 font-medium transition-all'
                  }`}
                >
                  <Tag className="h-4 w-4" />
                  Voordeelverpakkingen
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Producten laden...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {filteredSuppliers.map((product) => (
                  <OptimizedProductCard 
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
              
              {filteredSuppliers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Geen producten gevonden met de huidige filters.</p>
                </div>
              )}
            </>
          )}
        </div>

          {/* Methodology Section */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-200">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Duurzaamheidsscores gebaseerd op geverifieerde certificeringen</span>
            </div>
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="text-blue-600 text-sm hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Lees methodologie</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showMethodology ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
            {showMethodology && (
              <div className="bg-blue-50 rounded-2xl p-4 text-sm text-gray-700 mt-2">
              <p className="mb-2">Onze duurzaamheidsscores worden berekend op basis van:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Verpakking (25%): Plastic gebruik en recycleerbaarheid</li>
                <li>Ingrediënten (30%): Certificeringen en biologische afbreekbaarheid</li>
                <li>Productie (25%): Locatie en CO2-compensatie</li>
                <li>Bedrijf (20%): Transparantie en sociale impact</li>
              </ul>
              </div>
            )}
          </div>

          {/* Comparison Table */}
          <ComparisonTable lowestPrice={lowestPrice} highestPrice={highestPrice} minSustainability={minSustainability} maxSustainability={maxSustainability} />

          {/* FAQ Section */}
          <FAQSection lowestPrice={lowestPrice} highestPrice={highestPrice} />

          {/* Call-to-Action Section */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vergelijk Alle Opties</h2>
            <p className="text-gray-600 mb-6">Hulp bij kiezen?</p>
            <button className="btn-primary px-8 py-4 rounded-xl text-lg">
              Start Productfinder Tool →
            </button>
            <p className="text-sm text-gray-500 mt-2">5 vragen over gebruikssituatie en prioriteiten</p>
          </div>

          {/* Disclaimer */}
          <DisclaimerSection />

            {/* SEO Footer */}
            <SEOFooter />
            
            {/* Extra padding for comparison bar */}
            <div className="h-20"></div>
        </div>
      </main>
      
      {/* Comparison Bar - Fixed at bottom */}
      <ComparisonBar />
    </ComparisonProvider>
  );
}

// Comparison Table Component
function ComparisonTable({ lowestPrice, highestPrice, minSustainability, maxSustainability }: any) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Vaatwasstrips vs Traditionele Tabletten: Dataoverzicht
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Categorie</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Vaatwasstrips</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Budget Tabletten</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Premium Tabletten</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 font-medium">Prijs/wasbeurt</td>
              <td className="py-3 px-4">€{lowestPrice}-€{highestPrice}</td>
              <td className="py-3 px-4">€0.14-0.26</td>
              <td className="py-3 px-4">€0.45-0.65</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 font-medium">Effectiviteit</td>
              <td className="py-3 px-4">30-45% (CHOICE tests)</td>
              <td className="py-3 px-4">85-90% (CHOICE tests)</td>
              <td className="py-3 px-4">90-95% (CHOICE tests)</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 font-medium">Beschikbaarheid</td>
              <td className="py-3 px-4">Online only</td>
              <td className="py-3 px-4">Alle retailers</td>
              <td className="py-3 px-4">Alle retailers</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 font-medium">Verpakking plastic</td>
              <td className="py-3 px-4">0-25%</td>
              <td className="py-3 px-4">60-80%</td>
              <td className="py-3 px-4">60-80%</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 font-medium">Duurzaamheidsscore</td>
              <td className="py-3 px-4">{minSustainability}-{maxSustainability}/10</td>
              <td className="py-3 px-4">4.0-5.5/10</td>
              <td className="py-3 px-4">4.5-6.0/10</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Kostenanalyse per Jaar (4 wasbeurten/week)</h3>
          <ul className="space-y-1 text-sm">
            <li>• <strong>Vaatwasstrips:</strong> €{(parseFloat(lowestPrice) * 208).toFixed(0)}-€{(parseFloat(highestPrice) * 208).toFixed(0)} per jaar</li>
            <li>• <strong>Budget tabletten:</strong> €29-54 per jaar</li>
            <li>• <strong>Premium tabletten:</strong> €94-135 per jaar</li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Geschiktheid per Gebruikssituatie</h3>
          <ul className="space-y-1 text-sm">
            <li>• <strong>Lichte vervuiling:</strong> Alle opties geschikt</li>
            <li>• <strong>Zware vervuiling:</strong> Traditionele tabletten effectiever</li>
            <li>• <strong>Gevoelige huid:</strong> Hypoallergene strips of parfumvrije tabletten</li>
            <li>• <strong>Milieu-impact:</strong> Strips hebben voordeel door minder plastic</li>
            <li>• <strong>Budget:</strong> Budget tabletten meestal goedkoopst</li>
            <li>• <strong>Gemak:</strong> Tabletten breder verkrijgbaar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// FAQ Section Component
function FAQSection({ lowestPrice, highestPrice }: any) {
  const faqs = [
    {
      question: 'Wat is het prijsverschil met traditionele tabletten?',
      answer: `Vaatwasstrips kosten €${lowestPrice}-€${highestPrice} per wasbeurt. Budget tabletten kosten €0.14-0.26 per wasbeurt, premium tabletten €0.45-0.65 per wasbeurt. Het verschil hangt af van het gekozen merk en segment.`
    },
    {
      question: 'Hoe presteren vaatwasstrips qua reinigingskracht?',
      answer: 'Volgens CHOICE Australia tests (2024) behalen vaatwasstrips 30-45% effectiviteit vergeleken met 85-95% voor traditionele tabletten. Prestaties variëren per vervuilingstype en merk.'
    },
    {
      question: 'Wat zijn de milieuvriendelijke aspecten?',
      answer: 'Vaatwasstrips bevatten doorgaans 75% minder plastic verpakking dan traditionele PVA-wrapped tabletten. Ze zijn compacter voor transport en bevatten geen microplastics. Productie vindt echter vaak in China plaats.'
    },
    {
      question: 'Welke certificeringen hebben de merken?',
      answer: "Natuwash heeft als enige merk OECD 301B certificering voor biologische afbreekbaarheid. Cosmeau is dermatologisch getest. Andere merken hebben eigen claims zonder externe certificering."
    },
    {
      question: 'Hoe doseer ik vaatwasstrips?',
      answer: 'Standaard dosering is een halve strip per normale wasbeurt. Voor zware vervuiling kan een hele strip nodig zijn. Bij kleine/oude vaatwassers wordt een kwart strip aanbevolen om schuimvorming te voorkomen.'
    },
    {
      question: 'Waar zijn vaatwasstrips verkrijgbaar?',
      answer: 'Alle merken zijn uitsluitend online verkrijgbaar via merkwebsites, Bol.com en gespecialiseerde retailers. Geen fysieke verkoop in Nederlandse supermarkten of drogisterijen.'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-8 mb-12 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Veelgestelde Vragen over Vaatwasstrips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Q: {faq.question}</h3>
            <p className="text-gray-600 text-sm">A: {faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Disclaimer Section Component
function DisclaimerSection() {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 text-sm text-gray-600">
      <h3 className="font-semibold text-gray-900 mb-3">Disclaimer & Transparantie</h3>
      <p className="mb-2">
        <strong>Prijsinformatie:</strong> Alle prijzen geverifieerd via officiële retailers december 2024. 
        Prijzen kunnen wijzigen door promoties en voorraad.
      </p>
      <p className="mb-2">
        <strong>Review Verificatie:</strong> Review aantallen gecontroleerd via Trustpilot, Google Reviews 
        en merkwebsites. Discrepanties worden vermeld.
      </p>
      <p className="mb-2">
        <strong>Duurzaamheidsscores:</strong> Gebaseerd op geverifieerde certificeringen en transparante 
        methodologie beschikbaar op <Link href="/methodologie" className="text-blue-600 hover:underline">methodologie-pagina</Link>.
      </p>
      <p>
        <strong>Onafhankelijkheid:</strong> Deze vergelijking bevat geen betaalde plaatsingen. 
        Eventuele affiliate-commissies bij doorverwijzingen beïnvloeden niet de objectieve data-presentatie.
      </p>
    </div>
  );
}

// SEO Footer Component
function SEOFooter() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Vaatwasstrips Vergelijker Nederland</h3>
      <p className="text-gray-600 mb-4">
        Onafhankelijke vergelijkingssite voor Nederlandse vaatwasstrips markt. Objectieve data over prijzen,
        duurzaamheid en prestaties zonder commerciële beïnvloeding.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
        <div>
          <p><strong>Contact:</strong> info@vaatwasstrips-vergelijker.nl</p>
          <p><strong>Data Update:</strong> June 2025</p>
          <p><strong>Methodologie:</strong> <Link href="/methodologie" className="text-blue-600 hover:underline">Beschikbaar via aparte pagina</Link></p>
        </div>
        <div>
          <p className="font-semibold mb-2">Gerelateerde Zoektermen:</p>
          <p className="italic">
            vaatwasstrips nederland, dishwasher strips vergelijking, milieuvriendelijk afwasmiddel,
            vaatwasstrips prijs, duurzame vaatwas, wasstrip kopen, vaatwasstrips test
          </p>
        </div>
      </div>
    </div>
  );
}