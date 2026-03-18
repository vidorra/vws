import { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, CheckCircle, AlertCircle, Recycle, Wind, Droplets } from 'lucide-react';
import { getSite } from '@/lib/get-site';

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
    "dateModified": new Date().toISOString()
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

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/gids" className="hover:text-blue-600">
            Gids
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Milieuvriendelijk Wassen</span>
        </nav>

        <header className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-green-100">
              <Leaf className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">
            Milieuvriendelijk Wassen met Wasstrips
          </h1>
          <p className="text-xl text-gray-600 text-center">
            Hoe wasstrips bijdragen aan een duurzamere wasroutine
          </p>
        </header>

        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold mb-4">Inhoud</h2>
          <ol className="space-y-2">
            <li>
              <a href="#milieu-impact" className="text-blue-600 hover:text-blue-800">
                1. De milieu-impact van traditioneel wasmiddel
              </a>
            </li>
            <li>
              <a href="#voordelen" className="text-blue-600 hover:text-blue-800">
                2. Milieuvriendelijke voordelen van wasstrips
              </a>
            </li>
            <li>
              <a href="#verpakking" className="text-blue-600 hover:text-blue-800">
                3. Plasticvrije verpakking
              </a>
            </li>
            <li>
              <a href="#ingredienten" className="text-blue-600 hover:text-blue-800">
                4. Biologisch afbreekbare ingrediënten
              </a>
            </li>
            <li>
              <a href="#certificeringen" className="text-blue-600 hover:text-blue-800">
                5. Certificeringen: EcoCert, OECD 301B en meer
              </a>
            </li>
            <li>
              <a href="#co2" className="text-blue-600 hover:text-blue-800">
                6. CO2-besparing in de praktijk
              </a>
            </li>
            <li>
              <a href="#tips" className="text-blue-600 hover:text-blue-800">
                7. Extra tips voor duurzamer wassen
              </a>
            </li>
          </ol>
        </div>

        {/* Section 1 */}
        <section id="milieu-impact" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">
            1. De milieu-impact van traditioneel wasmiddel
          </h2>
          <p className="text-gray-600 mb-4">
            Traditioneel vloeibaar wasmiddel bestaat voor 80–90% uit water. Je betaalt niet alleen
            voor dat water — je betaalt ook voor de energie die nodig is om het te vervoeren. Een
            standaard fles wasmiddel van 1,5 liter weegt al snel 1,6 kg en biedt 20–25
            wasbeurten.
          </p>
          <p className="text-gray-600 mb-4">
            Daar bovenop komt de plastic verpakking. Nederlanders gooien jaarlijks tientallen
            miljoenen wasmiddelflessen weg, waarvan een groot deel niet gerecycled wordt. Poeder
            klinkt beter, maar de kartonnen doos heeft een plastic binnenzak en een plastic
            sluitstrip.
          </p>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <AlertCircle className="h-6 w-6 text-red-400 mr-2 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold">Feiten</h4>
                <ul className="text-gray-600 mt-2 space-y-1 list-disc pl-4">
                  <li>~80% van flessen vloeibaar wasmiddel is water</li>
                  <li>Transport veroorzaakt onnodig hoge CO2-uitstoot</li>
                  <li>Veel synthetische tensiden zijn slecht biologisch afbreekbaar</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="voordelen" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">2. Milieuvriendelijke voordelen van wasstrips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Recycle,
                color: 'text-green-500',
                title: 'Plasticvrije verpakking',
                text: 'Wasstrips worden geleverd in een kartonnen doosje zonder plastic binnenzak.',
              },
              {
                icon: Wind,
                color: 'text-blue-500',
                title: 'Lagere CO2-uitstoot',
                text: 'Door het ontbreken van water zijn wasstrips 94% lichter. Dat scheelt enorm in transportemissies.',
              },
              {
                icon: Droplets,
                color: 'text-teal-500',
                title: 'Biologisch afbreekbaar',
                text: 'Goede wasstrips bevatten tensiden die volledig afbreken in het rioolwaterzuivering.',
              },
              {
                icon: Leaf,
                color: 'text-green-600',
                title: 'Minder water nodig',
                text: 'Geconcentreerd wasmiddel werkt even effectief bij 30°C, dus je kunt ook nog eens op een lagere temperatuur wassen.',
              },
            ].map(({ icon: Icon, color, title, text }) => (
              <div key={title} className="flex items-start">
                <CheckCircle className={`h-6 w-6 ${color} mr-3 flex-shrink-0 mt-1`} />
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-gray-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section id="verpakking" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">3. Plasticvrije verpakking</h2>
          <p className="text-gray-600 mb-4">
            De meeste wasstrips worden geleverd in een dun kartonnen doosje. Dat klinkt simpel,
            maar het maakt een groot verschil: je recyclet het gewoon met oud papier. Geen losse
            dop, geen plastic film, geen sorteerproblemen.
          </p>
          <div className="bg-green-50 rounded-lg p-6 mb-4">
            <h3 className="font-semibold mb-3">Vergelijking verpakkingsgewicht per 60 wasbeurten</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b font-semibold">
                  <td className="py-2">Product</td>
                  <td className="py-2">Verpakkingsgewicht</td>
                  <td className="py-2">Materiaal</td>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Vloeibaar wasmiddel</td>
                  <td className="py-2">~120 g plastic</td>
                  <td className="py-2">HDPE fles</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Waspoeder</td>
                  <td className="py-2">~80 g karton + 15 g plastic</td>
                  <td className="py-2">Karton + PE zak</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-green-700">Wasstrips</td>
                  <td className="py-2 font-semibold text-green-700">~15 g karton</td>
                  <td className="py-2 font-semibold text-green-700">100% karton</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 */}
        <section id="ingredienten" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">4. Biologisch afbreekbare ingrediënten</h2>
          <p className="text-gray-600 mb-4">
            Niet alle wasstrips zijn even duurzaam. De sleutel zit in de tensiden: de stoffen die
            het vuil lostrekken van kleding. Er zijn twee categorieën:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Plantaardige tensiden ✅</h3>
              <ul className="text-gray-600 space-y-1 list-disc pl-4">
                <li>Afgeleid van kokosnoot of maïs</li>
                <li>Breken volledig af in water</li>
                <li>Schadelijk voor waterorganismen: laag</li>
                <li>Voorbeeld: Sodium Coco Sulfate, Lauryl Glucoside</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Synthetische tensiden ⚠️</h3>
              <ul className="text-gray-600 space-y-1 list-disc pl-4">
                <li>Afgeleid van petroleum</li>
                <li>Breken trager of onvolledig af</li>
                <li>Kunnen hormoonverstorend werken</li>
                <li>Voorbeeld: Sodium Laureth Sulfate (SLES)</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-600">
            Check bij het kopen van wasstrips altijd de ingrediëntenlijst. Merken met een EcoCert-
            of vergelijkbaar keurmerk gebruiken uitsluitend plantaardige en biologisch afbreekbare
            tensiden.
          </p>
        </section>

        {/* Section 5 */}
        <section id="certificeringen" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">5. Certificeringen: EcoCert, OECD 301B en meer</h2>
          <p className="text-gray-600 mb-6">
            Certificeringen geven je zekerheid dat de claims kloppen. Dit zijn de meest relevante:
          </p>
          <div className="space-y-4">
            {[
              {
                name: 'EcoCert',
                description:
                  'Frans certificeringsinstituut dat garandeert dat minstens 95% van de plantaardige ingrediënten biologisch is en minstens 10% van het totale gewicht biologisch gecertificeerd. Streng én internationaal erkend.',
                badge: 'bg-green-100 text-green-800',
              },
              {
                name: 'OECD 301B',
                description:
                  'Internationale test die de biologische afbreekbaarheid van chemicaliën meet. Een product dat slaagt voor OECD 301B breekt voor meer dan 60% af binnen 28 dagen. Dit is het minimale niveau dat de EU verplicht stelt voor huishoudelijke reinigingsmiddelen.',
                badge: 'bg-blue-100 text-blue-800',
              },
              {
                name: 'EU Ecolabel',
                description:
                  'Het officiële EU-milieukeurmerk. Verplicht dat alle tensiden snel biologisch afbreekbaar zijn en dat de verpakking gerecycled materiaal bevat. Niet veel wasstrip-merken hebben dit keurmerk — het is de gouden standaard.',
                badge: 'bg-yellow-100 text-yellow-800',
              },
              {
                name: 'Cradle to Cradle',
                description:
                  'Gaat verder dan biologische afbreekbaarheid: het certificaat vereist dat alle materialen in een veilige kringloop blijven. Zeldzaam voor wasmiddelen, maar een sterke indicatie van maximale duurzaamheid.',
                badge: 'bg-purple-100 text-purple-800',
              },
            ].map(cert => (
              <div key={cert.name} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold mr-4 flex-shrink-0 ${cert.badge}`}>
                    {cert.name}
                  </span>
                  <p className="text-gray-600">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 */}
        <section id="co2" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">6. CO2-besparing in de praktijk</h2>
          <p className="text-gray-600 mb-4">
            Hoeveel CO2 bespaar je eigenlijk? Een doorrekening voor een gemiddeld huishouden (4
            personen, 5 wasbeurten per week):
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-red-500 mb-1">260 kg</div>
                <div className="text-sm text-gray-600">CO2/jaar bij vloeibaar wasmiddel (transport + verpakking)</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-green-500 mb-1">35 kg</div>
                <div className="text-sm text-gray-600">CO2/jaar bij wasstrips (transport + verpakking)</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">-87%</div>
                <div className="text-sm text-gray-600">Reductie in transportgerelateerde CO2-uitstoot</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            * Schattingen op basis van gewicht en transportafstand. Exacte cijfers variëren per merk en
            leverancier.
          </p>
        </section>

        {/* Section 7 */}
        <section id="tips" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">7. Extra tips voor duurzamer wassen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                emoji: '🌡️',
                title: 'Was op 30°C of koud',
                text: 'Je spaart tot 60% energie ten opzichte van 60°C. Wasstrips werken even effectief bij lage temperaturen.',
              },
              {
                emoji: '🔄',
                title: 'Volle trommel',
                text: 'Een volle trommel is efficiënter dan twee halve trommels. Vermijd echter overvullen — maximaal 80% vol.',
              },
              {
                emoji: '🌬️',
                title: 'Lijn drogen',
                text: 'Een droger gebruikt meer energie dan de wasmachine. Hang kleding op een rek of lijn voor maximale besparing.',
              },
              {
                emoji: '📦',
                title: 'Koop in bulk',
                text: 'Grotere verpakkingen hebben een lagere verpakkings-per-wasbeurt ratio en worden minder vaak bezorgd.',
              },
            ].map(tip => (
              <div key={tip.title} className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  {tip.emoji} {tip.title}
                </h3>
                <p className="text-gray-600">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related guides */}
        <div className="bg-gray-50 rounded-lg p-6 mb-10">
          <h3 className="font-bold mb-3">Gerelateerde gidsen</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/gids/beginners" className="text-blue-600 hover:text-blue-800">
                → Beginners Gids: hoe gebruik je wasstrips?
              </Link>
            </li>
            <li>
              <Link href="/gids/kopen-tips" className="text-blue-600 hover:text-blue-800">
                → Kopen tips: waar op letten bij het vergelijken van wasstrips
              </Link>
            </li>
            <li>
              <Link href="/gids/troubleshooting" className="text-blue-600 hover:text-blue-800">
                → Problemen oplossen: veelvoorkomende issues en oplossingen
              </Link>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Klaar voor duurzamer wassen?</h2>
          <p className="mb-6">Vergelijk alle wasstrip-merken op duurzaamheid en prijs</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/merken"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Vergelijk alle merken
            </Link>
            <Link
              href="/overzicht"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition"
            >
              Bekijk duurzaamheidsscores
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
