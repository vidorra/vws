'use client';

import { useState, useEffect, useMemo } from 'react';
import OptimizedProductCard from '@/components/OptimizedProductCard';
import { calculateProductAwards } from '@/utils/calculateAwards';
import Link from 'next/link';
import { Star, Leaf, Euro, Tag, Package, ChevronDown, Check } from 'lucide-react';
import { ComparisonProvider } from '@/components/ComparisonContext';
import { ComparisonBar } from '@/components/ComparisonBar';
import { useSite } from '@/components/SiteProvider';

interface HomePageProps {
  initialProducts: any[];
}

export default function HomePage({ initialProducts }: HomePageProps) {
  const site = useSite();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'reviews' | 'sustainability' | 'price' | 'tryout'>('default');
  const [packSize, setPackSize] = useState<'all' | 'standard' | 'large'>('all');
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const transformedProducts = initialProducts.map((product: any) => ({
      ...product,
      logo: undefined,
      sustainabilityScore: product.sustainability,
      variants: product.variants && product.variants.length > 0
        ? product.variants.map((v: any) => ({
            ...v,
            name: v.name
              .replace(/(\d+)\s*[Ss]tuks?/g, (_match: string, num: string) => `${num} Pack${parseInt(num) > 1 ? 's' : ''}`)
              .replace(/(\d+)\s*[Ss]tuk/g, (_match: string, num: string) => `${num} Pack${parseInt(num) > 1 ? 's' : ''}`)
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

    const productsWithAwards = calculateProductAwards(transformedProducts);
    setSuppliers(productsWithAwards);
    setLoading(false);
  }, [initialProducts]);

  const sortOptions = [
    { key: 'default', label: 'Standaard', icon: null },
    { key: 'reviews', label: 'Reviews', icon: Star },
    { key: 'sustainability', label: 'Duurzaam', icon: Leaf },
    { key: 'price', label: 'Prijs', icon: Euro },
    { key: 'tryout', label: 'Try-out', icon: Tag }
  ];

  const filteredSuppliers = useMemo(() => {
    let filtered = [...suppliers];

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
        break;
    }

    if (packSize !== 'all') {
      filtered = filtered.map(product => {
        if (!product.variants || product.variants.length === 0) return product;

        const filteredVariants = product.variants.filter((variant: any) => {
          const washCount = variant.washCount || 60;
          if (packSize === 'standard') {
            return washCount <= 100;
          } else {
            return washCount > 100;
          }
        });

        if (filteredVariants.length > 0) {
          return { ...product, variants: filteredVariants };
        }
        return null;
      }).filter(Boolean);
    }

    return filtered;
  }, [suppliers, sortBy, packSize]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": `${site.name} Nederland`,
    "url": site.canonicalBase,
    "description": site.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${site.canonicalBase}/zoeken?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // FAQ data for schema + display
  const faqs = site.key === 'vaatwasstrips' ? [
    { question: 'Hoe doseer ik vaatwasstrips?', answer: 'Standaard dosering is een halve strip per normale wasbeurt. Voor zware vervuiling kan een hele strip nodig zijn. Bij kleine/oude vaatwassers wordt een kwart strip aanbevolen.' },
    { question: 'Zijn vaatwasstrips milieuvriendelijk?', answer: 'Vaatwasstrips bevatten doorgaans 75% minder plastic verpakking dan traditionele tabletten. Ze zijn compacter voor transport en bevatten geen microplastics.' },
    { question: 'Waar zijn vaatwasstrips verkrijgbaar?', answer: 'Alle merken zijn uitsluitend online verkrijgbaar via merkwebsites, Bol.com en gespecialiseerde retailers.' },
    { question: 'Welke certificeringen hebben de merken?', answer: 'Natuwash heeft als enige merk OECD 301B certificering voor biologische afbreekbaarheid. Cosmeau is dermatologisch getest.' },
  ] : [
    { question: 'Hoe doseer ik wasstrips?', answer: 'Gebruik 1 strip voor een normale wasbeurt. Voor grote of extra vuile ladingen kun je 2 strips gebruiken. Plaats de strip direct op de was, niet in het wasmiddelvak.' },
    { question: 'Zijn wasstrips milieuvriendelijk?', answer: 'Wasstrips bevatten doorgaans 75% minder plastic verpakking dan vloeibaar wasmiddel. Ze zijn compacter voor transport en biologisch afbreekbaar.' },
    { question: 'Waar zijn wasstrips verkrijgbaar?', answer: 'Wasstrips zijn verkrijgbaar via merkwebsites, Bol.com en geselecteerde drogisterijen.' },
    { question: 'Welke certificeringen hebben de merken?', answer: 'Natuwash heeft OECD 301B certificering. Cosmeau is dermatologisch getest. HappySoaps produceert in Zweden.' },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };

  return (
    <ComparisonProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>
        {/* Hero Section */}
        <div className="relative bg-cover bg-center w-full -mt-24 min-h-[420px] rounded-b-3xl overflow-hidden" style={{ backgroundImage: 'url(/hero.png)' }}>
          <div className="absolute inset-0 bg-black/40 rounded-b-3xl" />
          <div className="relative z-10 flex items-center min-h-[420px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full pt-24">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {site.productNounCapitalized} Vergelijken
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6">
                {site.tagline}
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                <a href="#vergelijking" className="btn-primary inline-flex items-center px-8 py-4 text-lg rounded-xl">
                  Bekijk Vergelijking →
                </a>
              </div>
              {/* Trust line */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/80 text-sm">
                <span className="flex items-center"><Check className="h-4 w-4 mr-1.5" />Onafhankelijke vergelijking</span>
                <span className="flex items-center"><Check className="h-4 w-4 mr-1.5" />Actuele prijzen</span>
                <span className="flex items-center"><Check className="h-4 w-4 mr-1.5" />Geverifieerde reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Product Filters and Cards */}
          <div id="vergelijking" className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {site.productNounCapitalized} Vergelijking
            </h2>

            {/* Sort and Filter */}
            <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {sortOptions.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key as any)}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 transition-all ${
                      sortBy === key
                        ? 'btn-primary'
                        : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200 font-medium'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white/80 p-1">
                  <button
                    onClick={() => setPackSize('all')}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      packSize === 'all' ? 'btn-primary' : 'text-gray-700 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    Alle maten
                  </button>
                  <button
                    onClick={() => setPackSize('standard')}
                    className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-all ${
                      packSize === 'standard' ? 'btn-primary' : 'text-gray-700 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <Package className="h-4 w-4" />
                    Standaard
                  </button>
                  <button
                    onClick={() => setPackSize('large')}
                    className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-all ${
                      packSize === 'large' ? 'btn-primary' : 'text-gray-700 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <Tag className="h-4 w-4" />
                    Voordeel
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
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {filteredSuppliers.map((product) => (
                    <OptimizedProductCard key={product.id} product={product} />
                  ))}
                </div>

                {filteredSuppliers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Geen producten gevonden met de huidige filters.</p>
                  </div>
                )}
              </>
            )}

            {/* Methodology link */}
            <div className="flex items-center justify-between card p-4">
              <span className="text-sm text-gray-600">Scores gebaseerd op geverifieerde certificeringen</span>
              <Link href="/methodologie" className="text-primary text-sm hover:underline font-medium">
                Lees methodologie →
              </Link>
            </div>
          </div>

          {/* FAQ Section — Accordion */}
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Veelgestelde vragen</h2>
            <div className="space-y-0">
              {faqs.map((faq) => (
                <details key={faq.question} className="border-b border-gray-100 last:border-0 group">
                  <summary className="py-4 cursor-pointer font-medium text-gray-900 flex items-center justify-between">
                    {faq.question}
                    <ChevronDown className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="pb-4 text-gray-600 text-sm">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Simple CTA */}
          <div className="card p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-primary">Hulp bij kiezen?</h2>
              <p className="text-gray-600 text-sm">Beantwoord 5 vragen en krijg persoonlijk advies</p>
            </div>
            <Link href="/productfinder" className="btn-primary px-6 py-3 rounded-xl whitespace-nowrap">
              Start Productfinder →
            </Link>
          </div>

          {/* Collapsible Disclaimer */}
          <div className="mb-8">
            <button
              onClick={() => setShowDisclaimer(!showDisclaimer)}
              className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              <span>Disclaimer & Transparantie</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showDisclaimer ? 'rotate-180' : ''}`} />
            </button>
            {showDisclaimer && (
              <div className="text-xs text-gray-500 space-y-1 mt-2">
                <p><strong>Prijzen:</strong> Geverifieerd via officiële retailers. Prijzen kunnen wijzigen.</p>
                <p><strong>Reviews:</strong> Gecontroleerd via Trustpilot, Google Reviews en merkwebsites.</p>
                <p><strong>Duurzaamheid:</strong> Op basis van certificeringen. <Link href="/methodologie" className="text-primary hover:underline">Methodologie</Link>.</p>
                <p><strong>Onafhankelijk:</strong> Geen betaalde plaatsingen. Affiliate-commissies beïnvloeden niet de data.</p>
              </div>
            )}
          </div>

          {/* Minimal SEO footer */}
          <div className="border-t border-gray-200 pt-6 mb-8 text-sm text-gray-500">
            <p>{site.name} — Onafhankelijke vergelijking voor de Nederlandse {site.productNoun} markt.</p>
            <p className="mt-1">Contact: {site.contactEmail}</p>
          </div>

          {/* Padding for comparison bar */}
          <div className="h-20"></div>
        </div>
      </main>

      <ComparisonBar />
    </ComparisonProvider>
  );
}
