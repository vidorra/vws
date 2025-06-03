import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Check, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Mock data - will be replaced with database
const brandsData = {
  'mothers-earth': {
    name: "Mother's Earth",
    description: 'Pionier in milieuvriendelijke wasstrips met natuurlijke ingrediënten',
    longDescription: `Mother's Earth is een van de eerste merken die wasstrips introduceerde in Nederland. 
    Met een sterke focus op duurzaamheid en natuurlijke ingrediënten, biedt dit merk een uitstekend 
    alternatief voor traditioneel wasmiddel. De wasstrips zijn 100% plasticvrij verpakt en bevatten 
    geen schadelijke chemicaliën.`,
    price: 14.95,
    pricePerWash: 0.25,
    washesPerPack: 60,
    rating: 4.5,
    reviews: 234,
    inStock: true,
    pros: [
      '100% plasticvrije verpakking',
      'Veganistisch en dierproefvrij',
      'Hypoallergeen - geschikt voor gevoelige huid',
      'Effectief bij lage temperaturen',
      'Compact en licht voor transport'
    ],
    cons: [
      'Iets duurder dan sommige alternatieven',
      'Beperkte geurkeuze',
      'Minder effectief bij zware vlekken'
    ],
    features: {
      'Wastemperatuur': '20°C - 95°C',
      'Geschikt voor': 'Alle textielsoorten',
      'Geur': 'Fris & Neutraal',
      'Inhoud': '60 wasstrips',
      'Gewicht': '120 gram',
      'Biologisch afbreekbaar': 'Ja',
      'Fosfaatvrij': 'Ja'
    },
    priceHistory: [
      { date: '2024-01', price: 15.95 },
      { date: '2024-02', price: 15.95 },
      { date: '2024-03', price: 14.95 },
      { date: '2024-04', price: 14.95 },
      { date: '2024-05', price: 14.95 },
      { date: '2024-06', price: 14.95 }
    ]
  },
  'cosmeau': {
    name: 'Cosmeau',
    description: 'Nederlandse kwaliteit met focus op duurzaamheid en effectiviteit',
    longDescription: `Cosmeau is een Nederlands merk dat zich richt op het maken van duurzame 
    wasproducten zonder concessies te doen aan kwaliteit. Hun wasstrips zijn ontwikkeld in 
    samenwerking met Nederlandse universiteiten en worden lokaal geproduceerd.`,
    price: 12.99,
    pricePerWash: 0.22,
    washesPerPack: 60,
    rating: 4.3,
    reviews: 189,
    inStock: true,
    pros: [
      'Uitstekende prijs-kwaliteitverhouding',
      'CO2-neutraal geproduceerd',
      'Sterke vlekverwijdering',
      'Nederlandse productie',
      'Dermatologisch getest'
    ],
    cons: [
      'Verpakking niet composteerbaar',
      'Kan schuimen in sommige machines',
      'Geur verdwijnt snel'
    ],
    features: {
      'Wastemperatuur': '15°C - 90°C',
      'Geschikt voor': 'Alle textielsoorten',
      'Geur': 'Lavendel & Eucalyptus',
      'Inhoud': '60 wasstrips',
      'Gewicht': '110 gram',
      'Biologisch afbreekbaar': 'Ja',
      'Fosfaatvrij': 'Ja'
    },
    priceHistory: [
      { date: '2024-01', price: 13.99 },
      { date: '2024-02', price: 13.99 },
      { date: '2024-03', price: 12.99 },
      { date: '2024-04', price: 12.99 },
      { date: '2024-05', price: 12.99 },
      { date: '2024-06', price: 12.99 }
    ]
  },
  'bubblyfy': {
    name: 'Bubblyfy',
    description: 'Moderne wasstrips met frisse geuren en krachtige waswerking',
    longDescription: `Bubblyfy richt zich op de moderne consument die waarde hecht aan zowel 
    effectiviteit als beleving. Met hun unieke geurformules en krachtige waswerking zijn ze 
    populair bij jonge gezinnen.`,
    price: 13.50,
    pricePerWash: 0.23,
    washesPerPack: 60,
    rating: 4.4,
    reviews: 156,
    inStock: false,
    pros: [
      'Uitstekende geur die lang blijft hangen',
      'Zeer effectief tegen vlekken',
      'Moderne, aantrekkelijke verpakking',
      'Geschikt voor sportkleding',
      'Lost snel op'
    ],
    cons: [
      'Bevat meer synthetische ingrediënten',
      'Niet geschikt voor babykleding',
      'Regelmatig uitverkocht'
    ],
    features: {
      'Wastemperatuur': '20°C - 60°C',
      'Geschikt voor': 'Katoen, synthetisch, sportkleding',
      'Geur': 'Ocean Breeze',
      'Inhoud': '60 wasstrips',
      'Gewicht': '115 gram',
      'Biologisch afbreekbaar': 'Gedeeltelijk',
      'Fosfaatvrij': 'Ja'
    },
    priceHistory: [
      { date: '2024-01', price: 14.50 },
      { date: '2024-02', price: 14.50 },
      { date: '2024-03', price: 13.50 },
      { date: '2024-04', price: 13.50 },
      { date: '2024-05', price: 13.50 },
      { date: '2024-06', price: 13.50 }
    ]
  },
  'bio-suds': {
    name: 'Bio Suds',
    description: 'Biologische wasstrips voor de bewuste consument',
    longDescription: `Bio Suds is het premium biologische alternatief in de wasstrips markt. 
    Met 100% natuurlijke en biologische ingrediënten is dit de keuze voor consumenten die 
    geen compromissen willen sluiten op het gebied van duurzaamheid.`,
    price: 16.99,
    pricePerWash: 0.28,
    washesPerPack: 60,
    rating: 4.6,
    reviews: 98,
    inStock: true,
    pros: [
      '100% biologische ingrediënten',
      'Composteerbare verpakking',
      'Geen synthetische geuren of kleurstoffen',
      'Ideaal voor babykleding en gevoelige huid',
      'Gecertificeerd door EcoCert'
    ],
    cons: [
      'Hoogste prijs in vergelijking',
      'Minder effectief bij hardnekkige vlekken',
      'Beperkte beschikbaarheid'
    ],
    features: {
      'Wastemperatuur': '30°C - 60°C',
      'Geschikt voor': 'Alle natuurlijke vezels',
      'Geur': 'Natuurlijk fris (ongeparfumeerd)',
      'Inhoud': '60 wasstrips',
      'Gewicht': '125 gram',
      'Biologisch afbreekbaar': '100%',
      'Fosfaatvrij': 'Ja'
    },
    priceHistory: [
      { date: '2024-01', price: 17.99 },
      { date: '2024-02', price: 17.99 },
      { date: '2024-03', price: 16.99 },
      { date: '2024-04', price: 16.99 },
      { date: '2024-05', price: 16.99 },
      { date: '2024-06', price: 16.99 }
    ]
  }
};

export async function generateStaticParams() {
  return Object.keys(brandsData).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const brand = brandsData[params.slug as keyof typeof brandsData];
  
  if (!brand) {
    return {
      title: 'Merk niet gevonden',
    };
  }

  const currentYear = new Date().getFullYear();
  
  return {
    title: `${brand.name} Wasstrips Review & Prijzen - ${currentYear}`,
    description: `Uitgebreide review van ${brand.name} wasstrips. Actuele prijzen, voor- en nadelen, en ${brand.reviews} gebruikerservaringen. €${brand.pricePerWash} per wasbeurt.`,
    keywords: `${brand.name}, wasstrips, review, prijs, kopen, ${currentYear}`,
    openGraph: {
      title: `${brand.name} Wasstrips Review ${currentYear}`,
      description: brand.description,
      type: 'article',
    },
  };
}

export default function BrandPage({ params }: { params: { slug: string } }) {
  const brand = brandsData[params.slug as keyof typeof brandsData];
  
  if (!brand) {
    notFound();
  }

  const currentYear = new Date().getFullYear();
  const lastPrice = brand.priceHistory[brand.priceHistory.length - 1];
  const previousPrice = brand.priceHistory[brand.priceHistory.length - 2];
  const priceChange = lastPrice.price - previousPrice.price;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${brand.name} Wasstrips`,
    "description": brand.description,
    "brand": {
      "@type": "Brand",
      "name": brand.name
    },
    "offers": {
      "@type": "Offer",
      "price": brand.price,
      "priceCurrency": "EUR",
      "availability": brand.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://wasstripsvergelijker.nl/merken/${params.slug}`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": brand.rating,
      "reviewCount": brand.reviews
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/merken" className="hover:text-blue-600">Merken</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{brand.name}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{brand.name} Wasstrips Review {currentYear}</h1>
          <p className="text-xl text-gray-600">{brand.description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Overzicht</h2>
              <p className="text-gray-600 mb-6">{brand.longDescription}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">Voordelen</h3>
                  <ul className="space-y-2">
                    {brand.pros.map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">Nadelen</h3>
                  <ul className="space-y-2">
                    {brand.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Specifications */}
            <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Specificaties</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(brand.features).map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-semibold text-gray-700">{key}:</dt>
                    <dd className="text-gray-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Price History */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Prijsgeschiedenis</h2>
              <div className="space-y-2">
                {brand.priceHistory.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">{entry.date}</span>
                    <span className="font-semibold">€{entry.price}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Box */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 sticky top-24">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600">€{brand.price}</div>
                <div className="text-gray-600">€{brand.pricePerWash} per wasbeurt</div>
                <div className="flex items-center justify-center mt-2">
                  {priceChange < 0 ? (
                    <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  ) : priceChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-500 mr-1" />
                  )}
                  <span className={`text-sm ${priceChange < 0 ? 'text-green-500' : priceChange > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {priceChange < 0 ? `€${Math.abs(priceChange).toFixed(2)} goedkoper` : 
                     priceChange > 0 ? `€${priceChange.toFixed(2)} duurder` : 
                     'Prijs stabiel'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-6 w-6 ${i < Math.floor(brand.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{brand.rating} ({brand.reviews} reviews)</span>
              </div>

              <div className={`text-center mb-6 ${brand.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {brand.inStock ? '✓ Op voorraad' : '✗ Uitverkocht'}
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Bekijk bij leverancier
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                * We ontvangen mogelijk een commissie
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}