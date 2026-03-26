import { Metadata } from 'next';
import Link from 'next/link';
import { Droplets, Eye, Gauge, ThermometerSun, ArrowRight } from 'lucide-react';
import { getSite } from '@/lib/get-site';
import GidsSidebar from '@/components/GidsSidebar';

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
    alternates: {
      canonical: `${site.canonicalBase}/gids/troubleshooting`,
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
    },
    {
      slug: 'witte-aanslag',
      title: isVaatwas ? 'Witte aanslag op glazen' : 'Witte vlekken op donkere kleding',
      description: isVaatwas
        ? 'Last van witte aanslag op glazen en bestek na het draaien met vaatwasstrips? Zo los je het op.'
        : 'Witte vlekken of strepen op donkere kleding na het wassen met wasstrips? Zo los je het op.',
      icon: Eye,
    },
    {
      slug: 'dosering-problemen',
      title: isVaatwas ? 'Dosering bij vol gevulde machine' : 'Dosering bij lage temperaturen',
      description: isVaatwas
        ? 'Hoeveel vaatwasstrips gebruik je bij een volle vaatwasser? Tips voor optimale dosering.'
        : 'Hoe doseer je wasstrips bij koud wassen en lage temperaturen? Tips voor het beste resultaat.',
      icon: Gauge,
    },
    {
      slug: 'gevoelige-huid',
      title: isVaatwas ? 'Troebel bestek en glas' : 'Allergische reactie en gevoelige huid',
      description: isVaatwas
        ? 'Troebel of dof bestek en glazen na het wassen? Oorzaken en oplossingen uitgelegd.'
        : 'Last van huidirritatie of allergie door wasstrips? Dit kun je eraan doen.',
      icon: ThermometerSun,
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-sm text-gray-500 mb-6">
          <Link href="/gids" className="hover:text-primary">Gids</Link>
          {' • '}
          <span>Troubleshooting</span>
        </p>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-primary mb-3">
                {site.productNounCapitalized} Problemen Oplossen
              </h1>
              <p className="text-gray-600">
                Veelvoorkomende problemen met {site.productNoun} en hoe je ze snel oplost. Kies hieronder het probleem dat je ervaart.
              </p>
            </div>

            {/* Articles */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Veelvoorkomende problemen</h2>
              <div className="space-y-4">
                {articles.map((article) => {
                  const Icon = article.icon;
                  return (
                    <Link
                      key={article.slug}
                      href={`/gids/troubleshooting/${article.slug}`}
                      className="block p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors group"
                    >
                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-brand-light mr-4 flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary group-hover:underline mb-1">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{article.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary mt-1 flex-shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Probleem niet gevonden */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Probleem niet gevonden?</h3>
              <p className="text-gray-600 text-sm mb-3">
                Staat jouw probleem er niet bij? Bekijk onze andere gidsen voor meer informatie over het gebruik van {site.productNoun}.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/gids/beginners" className="text-primary hover:underline font-medium text-sm">
                  Beginners Gids &rarr;
                </Link>
                <Link href="/gids/kopen-tips" className="text-primary hover:underline font-medium text-sm">
                  Kopen Tips &rarr;
                </Link>
                <Link href="/gids/milieuvriendelijk" className="text-primary hover:underline font-medium text-sm">
                  Milieuvriendelijk &rarr;
                </Link>
              </div>
            </div>
          </div>

          <GidsSidebar
            relatedGuides={[
              { href: '/gids/beginners', title: 'Beginners Gids', description: `Alles over het gebruik van ${site.productNoun}` },
              { href: '/gids/kopen-tips', title: 'Kopen Tips', description: `Waar let je op bij het kopen van ${site.productNoun}?` },
              { href: '/gids/milieuvriendelijk', title: 'Milieuvriendelijk', description: `Hoe duurzaam zijn ${site.productNoun}?` },
            ]}
            sisterSite={site.sisterSite}
          />
        </div>
      </div>
    </>
  );
}
