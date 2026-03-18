export const revalidate = 300;

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, TrendingDown, Award, Leaf } from 'lucide-react';
import { getProductsSafe } from '@/lib/db-safe';
import { getSite } from '@/lib/get-site';

const categoryConfig = {
  'goedkoopste': {
    title: 'Goedkoopste',
    description: 'Voor de prijsbewuste consument',
    longDescription: 'Ontdek de meest betaalbare opties zonder in te leveren op kwaliteit. Perfect voor grote gezinnen of als je wilt besparen.',
    icon: TrendingDown,
    color: 'text-green-600',
    sort: 'price' as const,
  },
  'beste-waarde': {
    title: 'Beste Prijs-Kwaliteit',
    description: 'Optimale balans tussen prijs en prestatie',
    longDescription: 'Deze opties bieden de beste waarde voor je geld met uitstekende resultaten tegen een redelijke prijs.',
    icon: Award,
    color: 'text-blue-600',
    sort: 'value' as const,
  },
  'premium': {
    title: 'Premium',
    description: 'Voor de beste resultaten en duurzaamheid',
    longDescription: 'Premium opties met de hoogste kwaliteit ingrediënten voor superieure resultaten en maximale milieuvriendelijkheid.',
    icon: Leaf,
    color: 'text-purple-600',
    sort: 'sustainability' as const,
  },
};

type CategoryKey = keyof typeof categoryConfig;

export async function generateStaticParams() {
  return Object.keys(categoryConfig).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const site = getSite();
  const config = categoryConfig[params.category as CategoryKey];
  if (!config) return { title: 'Categorie niet gevonden' };

  const year = new Date().getFullYear();
  return {
    title: `${config.title} ${site.productNounCapitalized} Nederland - Vergelijking ${year}`,
    description: `${config.title} ${site.productNoun} vergelijken in Nederland. Actuele prijzen en reviews ${year}.`,
    keywords: `${params.category}, ${site.productNoun}, nederland, prijzen, vergelijking`,
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const config = categoryConfig[params.category as CategoryKey];
  if (!config) notFound();

  const site = getSite();
  const allProducts = await getProductsSafe(site.key);
  const year = new Date().getFullYear();
  const Icon = config.icon;

  // Sort products based on category
  let products: typeof allProducts;
  switch (config.sort) {
    case 'price':
      products = [...allProducts].sort((a, b) => (a.pricePerWash ?? Infinity) - (b.pricePerWash ?? Infinity));
      break;
    case 'value':
      products = [...allProducts].sort((a, b) => {
        const scoreA = (a.sustainability ?? 0) / (a.pricePerWash ?? 1);
        const scoreB = (b.sustainability ?? 0) / (b.pricePerWash ?? 1);
        return scoreB - scoreA;
      });
      break;
    case 'sustainability':
      products = [...allProducts].sort((a, b) => (b.sustainability ?? 0) - (a.sustainability ?? 0));
      break;
  }

  const topProducts = products.slice(0, 4);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": site.canonicalBase },
      { "@type": "ListItem", "position": 2, "name": "Prijzen", "item": `${site.canonicalBase}/prijzen` },
      { "@type": "ListItem", "position": 3, "name": config.title, "item": `${site.canonicalBase}/prijzen/${params.category}` },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${config.title} ${site.productNounCapitalized}`,
    "description": `${config.title} ${site.productNoun} vergelijking in Nederland`,
    "numberOfItems": topProducts.length,
    "itemListElement": topProducts.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "url": `${site.canonicalBase}/merken/${product.slug}`,
        "offers": {
          "@type": "Offer",
          "price": product.pricePerWash,
          "priceCurrency": "EUR"
        }
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/prijzen" className="hover:text-blue-600">Prijzen</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{config.title}</span>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Icon className={`h-16 w-16 ${config.color}`} />
          </div>
          <h1 className="text-4xl font-bold mb-4">{config.title} {site.productNounCapitalized}</h1>
          <p className="text-xl text-gray-600 mb-2">{config.description}</p>
          <p className="text-gray-600 max-w-3xl mx-auto">{config.longDescription}</p>
        </header>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {topProducts.map((product, index) => (
            <div key={product.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition relative">
              {index === 0 && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-black px-3 py-1 text-sm font-semibold rounded-bl-lg">
                  #1
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-3">{product.supplier}</p>

                {product.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating!) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  {product.currentPrice && (
                    <div className="text-3xl font-bold text-blue-600">€{product.currentPrice.toFixed(2)}</div>
                  )}
                  {product.pricePerWash && (
                    <div className="text-gray-600">€{product.pricePerWash.toFixed(3)} per wasbeurt</div>
                  )}
                </div>

                {product.sustainability && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Duurzaamheid</span>
                      <span className="font-medium text-green-600">{product.sustainability}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(product.sustainability / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <Link
                  href={`/merken/${product.slug}`}
                  className="block w-full text-center btn-primary py-2 rounded-lg"
                >
                  Bekijk Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Category specific content */}
        <section className="prose max-w-none">
          {params.category === 'goedkoopste' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Waarom kiezen voor goedkope {site.productNoun}?</h2>
              <p className="text-gray-600 mb-4">
                Goedkope {site.productNoun} betekenen niet dat je inlevert op kwaliteit. De producten in deze categorie
                bieden goede resultaten tegen de laagste prijs per wasbeurt.
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>Grote gezinnen die veel {site.key === 'vaatwasstrips' ? 'afwassen' : 'wassen'}</li>
                <li>Consumenten met een beperkt budget</li>
                <li>Eerste kennismaking met {site.productNoun}</li>
                <li>Besparen op jaarlijkse kosten</li>
              </ul>
            </>
          )}

          {params.category === 'beste-waarde' && (
            <>
              <h2 className="text-2xl font-bold mb-4">De gulden middenweg</h2>
              <p className="text-gray-600 mb-4">
                Onze beste prijs-kwaliteit {site.productNoun} zijn geselecteerd op basis van:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>Goede resultaten in onafhankelijke tests</li>
                <li>Positieve gebruikerservaringen</li>
                <li>Redelijke prijs per wasbeurt</li>
                <li>Milieuvriendelijke eigenschappen</li>
                <li>Betrouwbare beschikbaarheid</li>
              </ul>
            </>
          )}

          {params.category === 'premium' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Premium kwaliteit loont</h2>
              <p className="text-gray-600 mb-4">
                Premium {site.productNoun} onderscheiden zich door:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>Gecertificeerde biologische ingrediënten</li>
                <li>Hoogste duurzaamheidsscores</li>
                <li>Composteerbare verpakking</li>
                <li>Geschikt voor gevoelige huid en allergieën</li>
                <li>Minimale milieu-impact</li>
              </ul>
            </>
          )}

          <h3 className="text-xl font-semibold mb-2">Hoe we selecteren</h3>
          <p className="text-gray-600 mb-4">
            Onze selectie is gebaseerd op actuele prijsdata, gebruikersreviews en duurzaamheidsscores.
            We updaten onze rankings regelmatig om je altijd de meest actuele informatie te geven.
          </p>
        </section>
      </div>
    </>
  );
}
