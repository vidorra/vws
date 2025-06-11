export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { getProductsSafe } from '@/lib/db-safe';
import ProductFilters from '@/components/ProductFilters';
import Link from 'next/link';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vaatwasstrips Vergelijken Nederland 2025 - Onafhankelijke Vergelijking',
  description: 'Vergelijk alle Nederlandse vaatwasstrips merken op prijs, duurzaamheid en prestaties. Transparante duurzaamheidsscores, actuele prijzen en geverifieerde reviews.',
  keywords: 'vaatwasstrips, vergelijken, nederland, prijs, duurzaamheid, milieuvriendelijk, afwassen, 2025',
  openGraph: {
    title: 'Vaatwasstrips Vergelijker Nederland 2025',
    description: 'Onafhankelijke vergelijking van alle Nederlandse aanbieders',
    type: 'website',
    url: 'https://vaatwasstripsvergelijker.nl',
    images: ['/og-image.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaatwasstrips Vergelijker Nederland 2025',
    description: 'Onafhankelijke vergelijking van alle Nederlandse aanbieders'
  }
};

// Comparison data
const comparisonData = [
  { type: 'Vaatwasstrips', priceRange: '€0.26-0.48', effectiveness: '30-45%', availability: 'Online only', plasticPackaging: '0-25%', sustainabilityScore: '6.2-9.4/10' },
  { type: 'Budget Tabletten', priceRange: '€0.14-0.26', effectiveness: '85-90%', availability: 'Alle retailers', plasticPackaging: '60-80%', sustainabilityScore: '4.0-5.5/10' },
  { type: 'Premium Tabletten', priceRange: '€0.45-0.65', effectiveness: '90-95%', availability: 'Alle retailers', plasticPackaging: '60-80%', sustainabilityScore: '4.5-6.0/10' }
];

const faqs = (lowestPrice: string, highestPrice: string) => [
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

export default async function HomePage() {
  // Fetch products from database with error handling
  const products = await getProductsSafe();
  
  // Sort by price per wash if available
  const sortedProducts = products.sort((a: any, b: any) => {
    const priceA = a.pricePerWash || a.currentPrice || 0;
    const priceB = b.pricePerWash || b.currentPrice || 0;
    return priceA - priceB;
  });
  
  // Calculate stats from products
  const lowestPrice = sortedProducts.length > 0 && sortedProducts[0].pricePerWash
    ? sortedProducts[0].pricePerWash!.toFixed(2)
    : '0.26';
    
  const lastProduct = sortedProducts[sortedProducts.length - 1];
  const highestPrice = sortedProducts.length > 0 && lastProduct?.pricePerWash !== null && lastProduct?.pricePerWash !== undefined
    ? lastProduct.pricePerWash.toFixed(2)
    : '0.48';
    
  const sustainabilityScores = products
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Vaatwasstrips Vergelijken Nederland 2025
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Onafhankelijke vergelijking van alle Nederlandse aanbieders
          </p>
          
          {/* Feature List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
            <div className="flex items-center text-left">
              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <span className="text-gray-700">Transparante duurzaamheidsscores op basis van certificeringen</span>
            </div>
            <div className="flex items-center text-left">
              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <span className="text-gray-700">Actuele prijzen van Nederlandse webshops</span>
            </div>
            <div className="flex items-center text-left">
              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <span className="text-gray-700">Geverifieerde reviews en beoordelingen</span>
            </div>
            <div className="flex items-center text-left">
              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <span className="text-gray-700">Objectieve vergelijking met traditionele tabletten</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#vergelijking" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Bekijk Vergelijking →
            </a>
            <Link href="/methodologie" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Lees Methodologie →
            </Link>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Marktoverzicht Nederlandse Vaatwasstrips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">€{lowestPrice}</div>
              <div className="text-sm text-gray-600 mt-1">Laagste prijs per wasbeurt</div>
              <div className="text-xs text-gray-500 mt-1">(December 2024)</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-red-600">€{highestPrice}</div>
              <div className="text-sm text-gray-600 mt-1">Hoogste prijs per wasbeurt</div>
              <div className="text-xs text-gray-500 mt-1">(Premium segment)</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-purple-600">{products.length}</div>
              <div className="text-sm text-gray-600 mt-1">Nederlandse aanbieders vergeleken</div>
              <div className="text-xs text-gray-500 mt-1">(100% marktdekking)</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-green-600">{minSustainability}-{maxSustainability}</div>
              <div className="text-sm text-gray-600 mt-1">Duurzaamheidsscores range</div>
              <div className="text-xs text-gray-500 mt-1">(Op 10-punts schaal)</div>
            </div>
          </div>
        </div>

        {/* Intro Text */}
        <div className="prose prose-lg max-w-none mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vaatwasstrips Kopen in Nederland: Complete Vergelijking 2025
          </h2>
          <p className="text-gray-700 mb-4">
            Vergelijk alle <strong>Nederlandse vaatwasstrips merken</strong> op prijs, duurzaamheid en prestaties. 
            Onze onafhankelijke analyse toont actuele kosten, certificeringen en gebruikerservaringen van 
            <strong> vaatwasstrips aanbieders</strong> in Nederland.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Marktoverzicht:</h3>
            <ul className="space-y-2">
              <li>• Prijzen variëren van €{lowestPrice}-€{highestPrice} per wasbeurt</li>
              <li>• Duurzaamheidsscores tussen {minSustainability}-{maxSustainability}/10</li>
              <li>• Alle merken alleen online verkrijgbaar</li>
              <li>• Productie voornamelijk in China, enkele Nederlandse operaties</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4 italic">Gegevens bijgewerkt: December 2024</p>
          </div>
        </div>

        {/* Product Filters and Cards - Using existing component with database data */}
        <div id="vergelijking" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Nederlandse Vaatwasstrips Aanbieders Vergelijking
          </h2>
          <ProductFilters products={products} />
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
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
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Kostenanalyse per Jaar (4 wasbeurten/week)</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Vaatwasstrips:</strong> €{(parseFloat(lowestPrice) * 208).toFixed(0)}-€{(parseFloat(highestPrice) * 208).toFixed(0)} per jaar</li>
                <li>• <strong>Budget tabletten:</strong> €29-54 per jaar</li>
                <li>• <strong>Premium tabletten:</strong> €94-135 per jaar</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
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

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Veelgestelde Vragen over Vaatwasstrips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs(lowestPrice, highestPrice).map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Q: {faq.question}</h3>
                <p className="text-gray-600 text-sm">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vergelijk Alle Opties</h2>
          <p className="text-gray-600 mb-6">Hulp bij kiezen?</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
            Start Productfinder Tool →
          </button>
          <p className="text-sm text-gray-500 mt-2">5 vragen over gebruikssituatie en prioriteiten</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 rounded-lg p-6 text-sm text-gray-600">
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
{/* SEO Footer */}
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
</main>
</>
);
}