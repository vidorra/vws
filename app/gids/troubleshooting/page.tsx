import { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, Droplets, Eye, Gauge, ThermometerSun } from 'lucide-react';
import { getSite } from '@/lib/get-site';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return {
    title: `${site.productNounCapitalized} Problemen Oplossen - Troubleshooting Gids`,
    description: `Veelvoorkomende problemen met ${site.productNoun} en hoe je ze oplost. Van strips die niet oplossen tot vlekken en aanslag.`,
    openGraph: {
      title: `${site.productNounCapitalized} Troubleshooting`,
      description: `Problemen met ${site.productNoun}? Hier vind je de oplossing`,
      type: 'article',
    },
  };
}

export default function TroubleshootingHubPage() {
  const site = getSite();
  const isVaatwas = site.key === 'vaatwasstrips';

  const articles = [
    {
      slug: 'strip-lost-niet-op',
      title: `${site.productNounCapitalized.slice(0, -1)} lost niet op`,
      description: isVaatwas
        ? 'Je vaatwasstrip lost niet volledig op in de vaatwasser? Dit zijn de oorzaken en oplossingen.'
        : 'Je wasstrip lost niet volledig op in de wasmachine? Dit zijn de oorzaken en oplossingen.',
      icon: Droplets,
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600',
    },
    {
      slug: 'witte-aanslag',
      title: isVaatwas ? 'Witte aanslag op glazen' : 'Witte vlekken op donkere kleding',
      description: isVaatwas
        ? 'Last van witte aanslag op glazen en bestek na het draaien met vaatwasstrips? Zo los je het op.'
        : 'Witte vlekken of strepen op donkere kleding na het wassen met wasstrips? Zo los je het op.',
      icon: Eye,
      color: 'bg-gray-100 text-gray-800',
      iconColor: 'text-gray-600',
    },
    {
      slug: 'dosering-problemen',
      title: isVaatwas ? 'Dosering bij vol gevulde machine' : 'Dosering bij lage temperaturen',
      description: isVaatwas
        ? 'Hoeveel vaatwasstrips gebruik je bij een volle vaatwasser? Tips voor optimale dosering.'
        : 'Hoe doseer je wasstrips bij koud wassen en lage temperaturen? Tips voor het beste resultaat.',
      icon: Gauge,
      color: 'bg-orange-100 text-orange-800',
      iconColor: 'text-orange-600',
    },
    {
      slug: 'gevoelige-huid',
      title: isVaatwas ? 'Troebel bestek en glas' : 'Allergische reactie en gevoelige huid',
      description: isVaatwas
        ? 'Troebel of dof bestek en glazen na het wassen? Oorzaken en oplossingen uitgelegd.'
        : 'Last van huidirritatie of allergie door wasstrips? Dit kun je eraan doen.',
      icon: ThermometerSun,
      color: 'bg-red-100 text-red-800',
      iconColor: 'text-red-600',
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": site.canonicalBase },
      { "@type": "ListItem", "position": 2, "name": "Gids", "item": `${site.canonicalBase}/gids` },
      { "@type": "ListItem", "position": 3, "name": "Troubleshooting", "item": `${site.canonicalBase}/gids/troubleshooting` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/gids" className="hover:text-blue-600">Gids</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Troubleshooting</span>
        </nav>

        <header className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-orange-100">
              <Wrench className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">
            {site.productNounCapitalized} Problemen Oplossen
          </h1>
          <p className="text-xl text-gray-600 text-center">
            Veelvoorkomende problemen met {site.productNoun} en hoe je ze snel oplost
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {articles.map((article) => {
            const Icon = article.icon;
            return (
              <Link
                key={article.slug}
                href={`/gids/troubleshooting/${article.slug}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group p-6"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full ${article.color} mr-4`}>
                    <Icon className={`h-6 w-6 ${article.iconColor}`} />
                  </div>
                  <h2 className="text-lg font-bold group-hover:text-blue-600 transition">
                    {article.title}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-800 transition">
                  Lees oplossing &rarr;
                </span>
              </Link>
            );
          })}
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-10 rounded-r-lg">
          <h3 className="font-bold mb-2">Probleem niet gevonden?</h3>
          <p className="text-gray-600 mb-3">
            Staat jouw probleem er niet bij? Bekijk onze andere gidsen voor meer informatie over het gebruik van {site.productNoun}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/gids/beginners" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Beginners Gids &rarr;
            </Link>
            <Link href="/gids/kopen-tips" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Kopen Tips &rarr;
            </Link>
            <Link href="/gids/milieuvriendelijk" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Milieuvriendelijk &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Andere {site.productNounSingular} proberen?</h2>
          <p className="mb-6">Misschien past een ander merk beter bij jouw situatie</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/productfinder" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Start Productfinder
            </Link>
            <Link href="/merken" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition">
              Vergelijk alle merken
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
