import { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, CheckCircle, AlertTriangle, Recycle } from 'lucide-react';
import { getSite } from '@/lib/get-site';
import GidsSidebar from '@/components/GidsSidebar';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return {
    title: `Milieuvriendelijk Wassen met ${site.productNounCapitalized} - Complete Gids`,
    description: `Ontdek hoe ${site.productNoun} bijdragen aan milieuvriendelijk wassen. CO2-besparing, plasticvrije verpakking en biologisch afbreekbare ingrediënten.`,
    openGraph: {
      title: `Milieuvriendelijk Wassen met ${site.productNounCapitalized}`,
      description: `Hoe ${site.productNoun} bijdragen aan een duurzamere wasroutine`,
      type: 'article',
    },
  };
}

const certifications = [
  { name: 'EcoCert', description: 'Frans certificeringsinstituut dat garandeert dat minstens 95% van de plantaardige ingrediënten biologisch is en minstens 10% van het totale gewicht biologisch gecertificeerd. Streng en internationaal erkend.' },
  { name: 'OECD 301B', description: 'Internationale test die de biologische afbreekbaarheid van chemicaliën meet. Een product dat slaagt voor OECD 301B breekt voor meer dan 60% af binnen 28 dagen.' },
  { name: 'EU Ecolabel', description: 'Het officiële EU-milieukeurmerk. Verplicht dat alle tensiden snel biologisch afbreekbaar zijn en dat de verpakking gerecycled materiaal bevat.' },
  { name: 'Cradle to Cradle', description: 'Gaat verder dan biologische afbreekbaarheid: het certificaat vereist dat alle materialen in een veilige kringloop blijven. Zeldzaam voor wasmiddelen.' },
];

const sustainableTips = [
  { title: 'Was op 30°C of koud', text: 'Je spaart tot 60% energie ten opzichte van 60°C. Wasstrips werken even effectief bij lage temperaturen.' },
  { title: 'Volle trommel', text: 'Een volle trommel is efficiënter dan twee halve trommels. Vermijd echter overvullen — maximaal 80% vol.' },
  { title: 'Lijn drogen', text: 'Een droger gebruikt meer energie dan de wasmachine. Hang kleding op een rek of lijn voor maximale besparing.' },
  { title: 'Koop in bulk', text: 'Grotere verpakkingen hebben een lagere verpakkings-per-wasbeurt ratio en worden minder vaak bezorgd.' },
];

export default function MilieuvriendelijkGidsPage() {
  const site = getSite();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Milieuvriendelijk Wassen met ${site.productNounCapitalized}`,
    "description": `Complete gids over de milieu-impact van ${site.productNoun} en duurzaam wassen`,
    "author": { "@type": "Organization", "name": site.name },
    "publisher": { "@type": "Organization", "name": site.name },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString(),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": site.canonicalBase },
      { "@type": "ListItem", "position": 2, "name": "Gids", "item": `${site.canonicalBase}/gids` },
      { "@type": "ListItem", "position": 3, "name": "Milieuvriendelijk", "item": `${site.canonicalBase}/gids/milieuvriendelijk` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto px-2 sm:px-4 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="text-sm text-gray-500 mb-2">Gids &bull; Milieuvriendelijk</div>
                  <h1 className="text-2xl font-bold text-primary mb-3 flex items-center">
                    <Leaf className="w-6 h-6 mr-3 text-primary" />
                    Milieuvriendelijk Wassen met {site.productNounCapitalized}
                  </h1>
                  <p className="text-gray-500 leading-relaxed">
                    Hoe {site.productNoun} bijdragen aan een duurzamere wasroutine
                  </p>
                </div>

                {/* Intro */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">De milieu-impact van traditioneel wasmiddel</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Traditioneel vloeibaar wasmiddel bestaat voor 80–90% uit water. Je betaalt niet alleen voor dat water — je betaalt ook voor de energie die nodig is om het te vervoeren. Een standaard fles wasmiddel van 1,5 liter weegt al snel 1,6 kg en biedt 20–25 wasbeurten.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Daar bovenop komt de plastic verpakking. Nederlanders gooien jaarlijks tientallen miljoenen wasmiddelflessen weg, waarvan een groot deel niet gerecycled wordt.
                  </p>
                </section>

                {/* Voordelen */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Milieuvriendelijke voordelen
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Plasticvrije verpakking', text: 'Wasstrips worden geleverd in een kartonnen doosje zonder plastic binnenzak.' },
                      { title: 'Lagere CO2-uitstoot', text: 'Door het ontbreken van water zijn wasstrips 94% lichter. Dat scheelt enorm in transportemissies.' },
                      { title: 'Biologisch afbreekbaar', text: 'Goede wasstrips bevatten tensiden die volledig afbreken in de rioolwaterzuivering.' },
                      { title: 'Minder water nodig', text: 'Geconcentreerd wasmiddel werkt even effectief bij 30°C, dus je kunt op een lagere temperatuur wassen.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-primary">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Verpakking vergelijking */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Plasticvrije verpakking</h2>
                  <p className="text-gray-700 mb-4">
                    De meeste wasstrips worden geleverd in een dun kartonnen doosje. Dat klinkt simpel, maar het maakt een groot verschil: je recyclet het gewoon met oud papier.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-white">
                          <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Verpakkingsgewicht</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Materiaal</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Vloeibaar wasmiddel</td>
                          <td className="border border-gray-300 px-4 py-2">~120 g plastic</td>
                          <td className="border border-gray-300 px-4 py-2">HDPE fles</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-gray-300 px-4 py-2">Waspoeder</td>
                          <td className="border border-gray-300 px-4 py-2">~80 g karton + 15 g plastic</td>
                          <td className="border border-gray-300 px-4 py-2">Karton + PE zak</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">{site.productNounCapitalized}</td>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">~15 g karton</td>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">100% karton</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Ingredienten */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Biologisch afbreekbare ingrediënten</h2>
                  <p className="text-gray-700 mb-4">
                    Niet alle wasstrips zijn even duurzaam. De sleutel zit in de tensiden: de stoffen die het vuil lostrekken van kleding.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-primary mb-2">Plantaardige tensiden</h3>
                      <ul className="space-y-1">
                        {['Afgeleid van kokosnoot of maïs', 'Breken volledig af in water', 'Laag risico voor waterorganismen'].map((item, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-primary mb-2">Synthetische tensiden</h3>
                      <ul className="space-y-1">
                        {['Afgeleid van petroleum', 'Breken trager of onvolledig af', 'Kunnen hormoonverstorend werken'].map((item, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Certificeringen */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                    <Recycle className="w-5 h-5 mr-2" />
                    Certificeringen
                  </h2>
                  <div className="space-y-4">
                    {certifications.map((cert, index) => (
                      <div key={cert.name}>
                        <h3 className="font-medium text-primary mb-1">{cert.name}</h3>
                        <p className="text-gray-600 text-sm">{cert.description}</p>
                        {index < certifications.length - 1 && <div className="border-b border-gray-200 mt-4"></div>}
                      </div>
                    ))}
                  </div>
                </section>

                {/* CO2 */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">CO2-besparing in de praktijk</h2>
                  <p className="text-gray-700 mb-4">
                    Hoeveel CO2 bespaar je eigenlijk? Een doorrekening voor een gemiddeld huishouden (4 personen, 5 wasbeurten per week):
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">260 kg</div>
                      <p className="text-gray-600 text-sm">CO2/jaar vloeibaar wasmiddel</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">35 kg</div>
                      <p className="text-gray-600 text-sm">CO2/jaar bij {site.productNoun}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">-87%</div>
                      <p className="text-gray-600 text-sm">CO2-reductie transport</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">* Schattingen op basis van gewicht en transportafstand.</p>
                </section>

                {/* Warning */}
                <div className="bg-amber-50 rounded-2xl shadow-sm border border-amber-200 p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-800 mb-2">Let op</h3>
                      <p className="text-sm text-amber-700 leading-relaxed">
                        Niet alle wasstrips die zichzelf &ldquo;eco&rdquo; of &ldquo;groen&rdquo; noemen zijn dat ook werkelijk. Check altijd of er een EcoCert, OECD 301B of vergelijkbaar keurmerk aan te pas komt.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Extra tips voor duurzamer wassen</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sustainableTips.map((tip, index) => (
                      <div key={index}>
                        <h3 className="font-medium text-primary mb-1">{tip.title}</h3>
                        <p className="text-gray-600 text-sm">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Related */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Gerelateerde Gidsen</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/gids/beginners" className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                      <div className="font-medium text-primary text-sm">Beginners Gids &rarr;</div>
                      <div className="text-xs text-gray-600 mt-1">Hoe gebruik je {site.productNoun}?</div>
                    </Link>
                    <Link href="/gids/kopen-tips" className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                      <div className="font-medium text-primary text-sm">Kopen Tips &rarr;</div>
                      <div className="text-xs text-gray-600 mt-1">Waar op letten bij het vergelijken</div>
                    </Link>
                    <Link href="/gids/troubleshooting" className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                      <div className="font-medium text-primary text-sm">Problemen Oplossen &rarr;</div>
                      <div className="text-xs text-gray-600 mt-1">Veelvoorkomende issues en oplossingen</div>
                    </Link>
                  </div>
                </section>

                {/* CTA */}
                <section className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-primary mb-2">Klaar voor duurzamer wassen?</h2>
                    <p className="text-gray-600 mb-4">Vergelijk alle merken op duurzaamheid en prijs</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link href="/overzicht" className="inline-flex items-center px-5 py-2 btn-primary rounded-lg text-sm">
                        Vergelijk alle merken
                      </Link>
                      <Link href="/productfinder" className="inline-flex items-center px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-primary hover:border-primary transition-colors">
                        Productfinder
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <GidsSidebar relatedGuides={[
              { href: '/gids/beginners', title: 'Beginners Gids', description: 'Starten met wasstrips' },
              { href: '/gids/kopen-tips', title: 'Kopen Tips', description: 'Slim vergelijken en kopen' },
            ]} />
          </div>
        </div>
      </div>
    </>
  );
}
