import { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';
import { getSite } from '@/lib/get-site';
import GidsSidebar from '@/components/GidsSidebar';

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
    alternates: {
      canonical: `${site.canonicalBase}/gids/kopen-tips`,
    },
  };
}

const qualityIndicators = [
  { label: 'Gebruikersreviews', description: 'Bekijk reviews op onafhankelijke platforms (Trustpilot, Google). Let op: een hoge score zegt meer als er 100+ reviews zijn.' },
  { label: 'Ingrediëntenlijst', description: 'Een transparante ingrediëntenlijst is een goed teken. Merken die niets te verbergen hebben, vermelden alle actieve stoffen.' },
  { label: 'Certificeringen', description: 'EcoCert of OECD 301B certificeringen betekenen dat onafhankelijke partijen de biologische afbreekbaarheid hebben geverifieerd.' },
  { label: 'Oplostijd', description: 'Goede wasstrips lossen volledig op bij 30°C. Bij twijfel: test met een glas lauw water.' },
];

const commonMistakes = [
  { mistake: 'Vergelijken op pakketprijs in plaats van prijs per wasbeurt', fix: 'Deel altijd de prijs door het aantal strips.' },
  { mistake: 'Alleen op het label "eco" of "groen" afgaan', fix: 'Controleer of er een certificering (EcoCert, EU Ecolabel) aan te pas komt.' },
  { mistake: 'Niet letten op watertype', fix: 'In hard-water-gebieden heb je mogelijk een half-strip meer nodig.' },
  { mistake: 'Reviews op de merkwebsite als objectief beschouwen', fix: 'Gebruik Trustpilot of Google Reviews.' },
];

const checklist = [
  'Heb je de prijs per wasbeurt berekend?',
  'Is de ingrediëntenlijst beschikbaar en zijn er plantaardige tensiden?',
  'Zijn er onafhankelijke reviews (Trustpilot / Google)?',
  'Past de verpakkingsgrootte bij je wasfrequentie?',
  'Heb je de houdbaarheidsdatum gecheckt bij bulk?',
  'Zijn er certificeringen (EcoCert, OECD 301B)?',
  'Heb je verzendkosten meegenomen in de totaalprijs?',
];

export default function KopenTipsGidsPage() {
  const site = getSite();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${site.productNounCapitalized} Kopen Tips - Waar op te Letten`,
    "description": `Praktische gids voor het kopen van ${site.productNoun}`,
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
      { "@type": "ListItem", "position": 3, "name": "Kopen Tips", "item": `${site.canonicalBase}/gids/kopen-tips` },
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
                  <div className="text-sm text-gray-500 mb-2">Gids &bull; Kopen Tips</div>
                  <h1 className="text-2xl font-bold text-primary mb-3 flex items-center">
                    <ShoppingCart className="w-6 h-6 mr-3 text-primary" />
                    {site.productNounCapitalized} Kopen Tips
                  </h1>
                  <p className="text-gray-500 leading-relaxed">
                    Alles wat je moet weten voordat je {site.productNoun} koopt
                  </p>
                </div>

                {/* Prijs per wasbeurt */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Prijs per wasbeurt — de enige eerlijke maatstaf</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Vergelijk nooit op pakketprijs. Een doosje van &euro;8,99 met 30 strips is duurder dan een doosje van &euro;14,99 met 60 strips. Reken altijd uit: <strong>prijs &divide; aantal strips</strong>.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-white">
                          <th className="border border-gray-300 px-4 py-2 text-left">Categorie</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Prijs per wasbeurt</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Voor wie</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">Budget</td>
                          <td className="border border-gray-300 px-4 py-2">&euro;0,18 – &euro;0,22</td>
                          <td className="border border-gray-300 px-4 py-2">Prijsbewuste consument</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-gray-300 px-4 py-2 font-semibold">Midden</td>
                          <td className="border border-gray-300 px-4 py-2">&euro;0,22 – &euro;0,28</td>
                          <td className="border border-gray-300 px-4 py-2">Balans prijs/kwaliteit</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">Premium</td>
                          <td className="border border-gray-300 px-4 py-2">&euro;0,28 – &euro;0,40</td>
                          <td className="border border-gray-300 px-4 py-2">Biologisch, gevoelige huid</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
                        Sommige merken tellen &ldquo;1 strip&rdquo; als één wasbeurt, anderen adviseren 1,5 of 2 strips voor een volle trommel. Controleer de gebruiksaanwijzing voor een eerlijke vergelijking.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kwaliteitsindicatoren */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Kwaliteitsindicatoren</h2>
                  <div className="space-y-4">
                    {qualityIndicators.map((item, index) => (
                      <div key={item.label}>
                        <h3 className="font-medium text-primary mb-1">{item.label}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                        {index < qualityIndicators.length - 1 && <div className="border-b border-gray-200 mt-4"></div>}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Verpakkingsgrootte */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Welke verpakkingsgrootte kies je?</h2>
                  <p className="text-gray-700 mb-4">
                    De meeste merken bieden 30, 60 of 120 strips aan. Koop zo groot als mogelijk, mits je niet vergeet dat wasstrips niet eindeloos houdbaar zijn (gemiddeld 2–3 jaar).
                  </p>
                  <div className="space-y-3">
                    {[
                      { size: '30 strips', target: 'Starters / eerste aankoop', pro: 'Laag instaprisico', con: 'Hoogste prijs per wasbeurt' },
                      { size: '60 strips', target: 'Gemiddeld huishouden', pro: '10–15% goedkoper per strip', con: 'Minder besparing dan 120' },
                      { size: '120 strips', target: 'Grote gezinnen / vaste klanten', pro: 'Laagste prijs per wasbeurt', con: 'Hogere vooruitbetaling' },
                    ].map((pkg) => (
                      <div key={pkg.size} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                        <div>
                          <h3 className="font-medium text-primary">{pkg.size} — {pkg.target}</h3>
                          <p className="text-gray-600 text-sm">Voordeel: {pkg.pro}. Nadeel: {pkg.con}.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Bulkinkoop */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Bulkinkoop: wanneer loont het?</h2>
                  <p className="text-gray-700 mb-4">
                    Bulkinkoop loont als je al weet dat een merk goed werkt voor jou.
                  </p>
                  <h3 className="font-medium text-primary mb-2">Wanneer bulk kopen?</h3>
                  <ul className="space-y-1 mb-4">
                    {['Je hebt het merk al minstens één pakket getest', 'Je wast regelmatig (4+ keer per week)', 'Je hebt droge opslagruimte', 'Er is een kortingsactie van 20%+'].map((item, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium text-primary mb-2">Wanneer niet bulk kopen?</h3>
                    <ul className="space-y-1">
                      {['Je hebt het merk nog nooit geprobeerd', 'Je wast minder dan 2x per week', 'Je woont in een vochtige ruimte'].map((item, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Waar kopen */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Waar koop je {site.productNoun}?</h2>
                  <div className="space-y-4">
                    {[
                      { channel: 'Direct bij de fabrikant', pro: 'Laagste prijs, directe relatie met merk', tip: 'Beste keuze voor vaste klanten' },
                      { channel: 'Bol.com / Amazon', pro: 'Gemakkelijk vergelijken, snel geleverd', tip: 'Handig voor meerdere merken tegelijk' },
                      { channel: 'Supermarkt', pro: 'Direct meenemen, geen verzendkosten', tip: 'Geschikt voor noodaankoop' },
                      { channel: 'Abonnement', pro: 'Automatisch thuis, 10–15% korting', tip: 'Controleer altijd de opzegcondities' },
                    ].map((ch, index) => (
                      <div key={ch.channel}>
                        <h3 className="font-medium text-primary mb-1">{ch.channel}</h3>
                        <p className="text-gray-600 text-sm">{ch.pro}. Tip: {ch.tip}.</p>
                        {index < 3 && <div className="border-b border-gray-200 mt-4"></div>}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Veelgemaakte fouten */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Veelgemaakte fouten bij het kopen
                  </h2>
                  <div className="space-y-4">
                    {commonMistakes.map((item, index) => (
                      <div key={index}>
                        <h3 className="font-medium text-gray-700 mb-1">{item.mistake}</h3>
                        <p className="text-gray-600 text-sm">Fix: {item.fix}</p>
                        {index < commonMistakes.length - 1 && <div className="border-b border-gray-200 mt-4"></div>}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Checklist */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Koopbeslissing checklist
                  </h2>
                  <ul className="space-y-2">
                    {checklist.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Related */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Gerelateerde Gidsen</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/gids/beginners" className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                      <div className="font-medium text-primary text-sm">Beginners Gids &rarr;</div>
                      <div className="text-xs text-gray-600 mt-1">Hoe gebruik je {site.productNoun}?</div>
                    </Link>
                    <Link href="/gids/milieuvriendelijk" className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                      <div className="font-medium text-primary text-sm">Milieuvriendelijk Wassen &rarr;</div>
                      <div className="text-xs text-gray-600 mt-1">Duurzaamheid uitgelegd</div>
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
                    <h2 className="text-lg font-semibold text-primary mb-2">Klaar om te vergelijken?</h2>
                    <p className="text-gray-600 mb-4">Bekijk alle {site.productNoun} met prijs per wasbeurt op een rij</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link href="/vergelijk" className="inline-flex items-center px-5 py-2 btn-primary rounded-lg text-sm">
                        Vergelijk nu
                      </Link>
                      <Link href="/prijzen/goedkoopste" className="inline-flex items-center px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-primary hover:border-primary transition-colors">
                        Goedkoopste opties
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <GidsSidebar
              relatedGuides={[
                { href: '/gids/beginners', title: 'Beginners Gids', description: 'Starten met wasstrips' },
                { href: '/gids/milieuvriendelijk', title: 'Milieuvriendelijk Wassen', description: 'Duurzaam wassen uitgelegd' },
              ]}
              sisterSite={site.sisterSite}
            />
          </div>
        </div>
      </div>
    </>
  );
}
