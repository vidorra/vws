import { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingCart, CheckCircle, Star, Package, AlertCircle, TrendingDown } from 'lucide-react';
import { getSite } from '@/lib/get-site';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return {
    title: `${site.productNounCapitalized} Kopen Tips - Waar op te Letten`,
    description: `Praktische kooptips voor ${site.productNoun}. Vergelijk prijs per wasbeurt, kwaliteitsindicatoren, bulkkorting en waar je de beste deals vindt.`,
    openGraph: {
      title: `${site.productNounCapitalized} Kopen Tips`,
      description: `Alles wat je moet weten voordat je ${site.productNoun} koopt`,
      type: 'article',
    },
  };
}

export default function KopenTipsGidsPage() {
  const site = getSite();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${site.productNounCapitalized} Kopen Tips - Waar op te Letten`,
    "description": `Praktische gids voor het kopen van ${site.productNoun}: prijs, kwaliteit en waar te kopen`,
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
      { "@type": "ListItem", "position": 3, "name": "Kopen Tips", "item": `${site.canonicalBase}/gids/kopen-tips` },
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
          <span className="text-gray-900">Kopen Tips</span>
        </nav>

        <header className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-purple-100">
              <ShoppingCart className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">Wasstrips Kopen Tips</h1>
          <p className="text-xl text-gray-600 text-center">
            Alles wat je moet weten voordat je je wasstrips koopt
          </p>
        </header>

        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold mb-4">Inhoud</h2>
          <ol className="space-y-2">
            <li>
              <a href="#prijs-per-wasbeurt" className="text-blue-600 hover:text-blue-800">
                1. Prijs per wasbeurt — de enige eerlijke maatstaf
              </a>
            </li>
            <li>
              <a href="#kwaliteit" className="text-blue-600 hover:text-blue-800">
                2. Kwaliteitsindicatoren
              </a>
            </li>
            <li>
              <a href="#verpakkingsgrootte" className="text-blue-600 hover:text-blue-800">
                3. Welke verpakkingsgrootte kies je?
              </a>
            </li>
            <li>
              <a href="#bulk" className="text-blue-600 hover:text-blue-800">
                4. Bulkinkoop: wanneer loont het?
              </a>
            </li>
            <li>
              <a href="#waar-kopen" className="text-blue-600 hover:text-blue-800">
                5. Waar koop je wasstrips?
              </a>
            </li>
            <li>
              <a href="#valkuilen" className="text-blue-600 hover:text-blue-800">
                6. Veelgemaakte fouten bij het kopen
              </a>
            </li>
            <li>
              <a href="#checklist" className="text-blue-600 hover:text-blue-800">
                7. Koopbeslissing checklist
              </a>
            </li>
          </ol>
        </div>

        {/* Section 1 */}
        <section id="prijs-per-wasbeurt" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">
            1. Prijs per wasbeurt — de enige eerlijke maatstaf
          </h2>
          <p className="text-gray-600 mb-4">
            Vergelijk nooit op pakketprijs. Een doosje van €8,99 met 30 strips is duurder dan een
            doosje van €14,99 met 60 strips. Reken altijd uit: <strong>prijs ÷ aantal strips</strong>.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 mb-4">
            <h3 className="font-semibold mb-3">Richtprijzen (Nederland, 2025)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b font-semibold">
                  <td className="py-2">Categorie</td>
                  <td className="py-2">Prijs per wasbeurt</td>
                  <td className="py-2">Voor wie</td>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Budget</td>
                  <td className="py-2">€0,18 – €0,22</td>
                  <td className="py-2">Prijsbewuste consument</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Midden</td>
                  <td className="py-2">€0,22 – €0,28</td>
                  <td className="py-2">Balans prijs/kwaliteit</td>
                </tr>
                <tr>
                  <td className="py-2">Premium</td>
                  <td className="py-2">€0,28 – €0,40</td>
                  <td className="py-2">Biologisch, gevoelige huid</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertCircle className="h-6 w-6 text-yellow-400 mr-2 flex-shrink-0 mt-1" />
              <p className="text-gray-600">
                <strong>Let op:</strong> Sommige merken tellen &ldquo;1 strip&rdquo; als één wasbeurt, anderen
                adviseren 1,5 of 2 strips voor een volle trommel. Controleer de gebruiksaanwijzing
                voor een eerlijke vergelijking.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="kwaliteit" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">2. Kwaliteitsindicatoren</h2>
          <p className="text-gray-600 mb-6">
            Een lage prijs is verleidelijk, maar er zijn een paar kwaliteitssignalen waarop je moet
            letten:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Star,
                color: 'text-yellow-500',
                label: 'Gebruikersreviews',
                description:
                  'Bekijk reviews op onafhankelijke platforms (Trustpilot, Google). Let op: een hoge gemiddelde score zegt meer als er 100+ reviews zijn.',
              },
              {
                icon: CheckCircle,
                color: 'text-green-500',
                label: 'Ingrediëntenlijst',
                description:
                  'Een transparante ingrediëntenlijst is een goed teken. Merken die niets te verbergen hebben, vermelden alle actieve stoffen.',
              },
              {
                icon: Package,
                color: 'text-blue-500',
                label: 'Certificeringen',
                description:
                  'EcoCert of OECD 301B certificeringen betekenen dat onafhankelijke partijen de biologische afbreekbaarheid hebben geverifieerd.',
              },
              {
                icon: TrendingDown,
                color: 'text-purple-500',
                label: 'Oplostijd',
                description:
                  'Goede wasstrips lossen volledig op bij 30°C binnen het wascentrifugegedeelte. Bij twijfel: test met een glas lauw water.',
              },
            ].map(({ icon: Icon, color, label, description }) => (
              <div key={label} className="bg-white rounded-lg shadow p-4 flex items-start">
                <Icon className={`h-6 w-6 ${color} mr-3 flex-shrink-0 mt-1`} />
                <div>
                  <h3 className="font-semibold mb-1">{label}</h3>
                  <p className="text-gray-600 text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section id="verpakkingsgrootte" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">3. Welke verpakkingsgrootte kies je?</h2>
          <p className="text-gray-600 mb-4">
            De meeste merken bieden 30, 60 of 120 strips aan. De vuistregel: koop zo groot als
            mogelijk, mits je niet vergeet dat wasstrips niet eindeloos houdbaar zijn (gemiddeld
            2–3 jaar).
          </p>
          <div className="space-y-4">
            {[
              {
                size: '30 strips',
                for: 'Starters / eerste aankoop',
                pros: 'Laag instaprisico, probeer het merk uit',
                cons: 'Hogste prijs per wasbeurt',
                badge: 'bg-gray-100 text-gray-700',
              },
              {
                size: '60 strips',
                for: 'Gemiddeld huishouden',
                pros: '10–15% goedkoper per strip dan de kleine verpakking',
                cons: 'Minder risico, maar ook minder besparing dan 120',
                badge: 'bg-blue-100 text-blue-700',
              },
              {
                size: '120 strips',
                for: 'Grote gezinnen / vaste klanten',
                pros: 'Laagste prijs per wasbeurt, minder leveringen',
                cons: 'Hogere vooruitbetaling, langere tijd vast aan één merk',
                badge: 'bg-green-100 text-green-700',
              },
            ].map(pkg => (
              <div key={pkg.size} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${pkg.badge}`}>
                        {pkg.size}
                      </span>
                      <span className="text-gray-600 text-sm">{pkg.for}</span>
                    </div>
                    <p className="text-sm text-green-700">
                      <strong>Voordeel:</strong> {pkg.pros}
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      <strong>Nadeel:</strong> {pkg.cons}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section id="bulk" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">4. Bulkinkoop: wanneer loont het?</h2>
          <p className="text-gray-600 mb-4">
            Bulkinkoop loont als je al weet dat een merk goed werkt voor jou. Hoe groter het pakket,
            hoe lager de prijs per wasbeurt — maar er zijn valkuilen.
          </p>
          <div className="bg-green-50 rounded-lg p-6 mb-4">
            <h3 className="font-semibold mb-3 text-green-800">Wanneer bulk kopen? ✅</h3>
            <ul className="text-gray-600 space-y-2 list-disc pl-4">
              <li>Je hebt het merk al minstens één pakket getest</li>
              <li>Je wast regelmatig (4+ keer per week)</li>
              <li>Je hebt droge opslagruimte</li>
              <li>Er is een kortingsactie van 20%+</li>
            </ul>
          </div>
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-red-800">Wanneer NIET bulk kopen? ❌</h3>
            <ul className="text-gray-600 space-y-2 list-disc pl-4">
              <li>Je hebt het merk nog nooit geprobeerd</li>
              <li>Je wast minder dan 2x per week (houdbaarheidsdatum!)</li>
              <li>Je woont in een vochtige ruimte (strips kunnen aan elkaar plakken)</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section id="waar-kopen" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">5. Waar koop je wasstrips?</h2>
          <div className="space-y-4">
            {[
              {
                channel: 'Direct bij de fabrikant',
                pro: 'Laagste prijs, directe relatie met merk',
                con: 'Hogere verzendkosten bij kleine orders',
                tip: 'Beste keuze voor vaste klanten van één merk',
              },
              {
                channel: 'Bol.com / Amazon',
                pro: 'Gemakkelijk vergelijken, snel geleverd, reviews beschikbaar',
                con: 'Soms hogere prijs dan directe webshop',
                tip: 'Handig als je meerdere merken tegelijk wilt vergelijken',
              },
              {
                channel: 'Supermarkt (Albert Heijn, Jumbo)',
                pro: 'Direct meenemen, geen verzendkosten',
                con: 'Beperkt assortiment (1–2 merken), hogere prijs per strip',
                tip: 'Geschikt voor noodaankoop of eerste kennismaking',
              },
              {
                channel: 'Abonnement',
                pro: 'Automatisch thuis, vaak 10–15% korting op herhaalaankopen',
                con: 'Flexibiliteit beperkt, vergeten opzeggen kan duur uitpakken',
                tip: 'Controleer altijd de opzegcondities',
              },
            ].map(ch => (
              <div key={ch.channel} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2">{ch.channel}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <p className="text-green-700">
                    <strong>+</strong> {ch.pro}
                  </p>
                  <p className="text-red-600">
                    <strong>-</strong> {ch.con}
                  </p>
                  <p className="text-blue-600">
                    <strong>Tip:</strong> {ch.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 */}
        <section id="valkuilen" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">6. Veelgemaakte fouten bij het kopen</h2>
          <div className="space-y-4">
            {[
              {
                mistake: 'Vergelijken op pakketprijs in plaats van prijs per wasbeurt',
                fix: 'Deel altijd de prijs door het aantal strips.',
              },
              {
                mistake: 'Alleen op het label "eco" of "groen" afgaan',
                fix: 'Controleer of er een certificering (EcoCert, EU Ecolabel) aan te pas komt.',
              },
              {
                mistake: 'Niet letten op watertype',
                fix:
                  'In hard-water-gebieden (zoals Utrecht, Zeeland) heb je mogelijk een half-strip meer nodig. Sommige merken hebben varianten voor hard water.',
              },
              {
                mistake: 'Reviews op de merkwebsite als objectief beschouwen',
                fix: 'Gebruik Trustpilot of Google Reviews — daar kan het merk geen reviews verwijderen.',
              },
            ].map(item => (
              <div key={item.mistake} className="flex items-start bg-white rounded-lg shadow p-4">
                <AlertCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">{item.mistake}</p>
                  <p className="text-green-700 text-sm mt-1">
                    <strong>Fix:</strong> {item.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7 */}
        <section id="checklist" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">7. Koopbeslissing checklist</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              Gebruik deze checklist voordat je op &ldquo;Bestellen&rdquo; klikt:
            </p>
            <ul className="space-y-3">
              {[
                'Heb je de prijs per wasbeurt berekend?',
                'Is de ingrediëntenlijst beschikbaar en zijn er plantaardige tensiden?',
                'Zijn er onafhankelijke reviews (Trustpilot / Google)?',
                'Past de verpakkingsgrootte bij je wasfrequentie?',
                'Heb je de houdbaarheidsdatum gecheckt bij bulk?',
                'Zijn er certificeringen (EcoCert, OECD 301B)?',
                'Heb je verzendkosten meegenomen in de totaalprijs?',
              ].map((item, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
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
              <Link href="/gids/milieuvriendelijk" className="text-blue-600 hover:text-blue-800">
                → Milieuvriendelijk wassen: duurzaamheid uitgelegd
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
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Klaar om te vergelijken?</h2>
          <p className="mb-6">Bekijk alle wasstrips met prijs per wasbeurt op een rij</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/vergelijk"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Vergelijk nu
            </Link>
            <Link
              href="/prijzen/goedkoopste"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition"
            >
              Goedkoopste opties
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
