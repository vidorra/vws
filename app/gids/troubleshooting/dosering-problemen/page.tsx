import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { getSite } from '@/lib/get-site';
import GidsSidebar from '@/components/GidsSidebar';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  const isVaatwas = site.key === 'vaatwasstrips';
  const title = isVaatwas
    ? 'Vaatwasstrips Dosering bij Vol Gevulde Machine'
    : 'Wasstrips Dosering bij Lage Temperaturen';
  const description = isVaatwas
    ? 'Hoeveel vaatwasstrips gebruik je bij een volle vaatwasser? Doseertabel en tips voor optimaal resultaat.'
    : 'Hoe doseer je wasstrips bij koud wassen? Doseertabel per temperatuur en wastrommel-grootte.';
  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
  };
}

export default function DoseringProblemenPage() {
  const site = getSite();
  const isVaatwas = site.key === 'vaatwasstrips';
  const nouns = site.productNoun;
  const noun = site.productNounSingular;
  const machine = isVaatwas ? 'vaatwasser' : 'wasmachine';

  const pageTitle = isVaatwas ? 'Dosering bij Vol Gevulde Machine' : 'Dosering bij Lage Temperaturen';

  const faqs = [
    {
      question: isVaatwas
        ? 'Kan ik twee vaatwasstrips tegelijk gebruiken?'
        : 'Kan ik twee wasstrips tegelijk gebruiken?',
      answer: isVaatwas
        ? 'Ja, bij een zwaar bevuilde volle vaatwasser of bij hardnekkig aangekoekt eten kun je twee strips gebruiken. Dit is echter zelden nodig bij normaal gebruik.'
        : 'Ja, bij extra vuile was of een grote trommel (9+ kg) kun je twee strips gebruiken. Voor normaal bevuilde was is dit niet nodig.',
    },
    {
      question: `Is een halve ${noun} genoeg voor een halfvolle ${machine}?`,
      answer: `Ja, een halve ${noun} is voldoende voor een halfvolle ${machine} met normaal bevuilde ${isVaatwas ? 'vaat' : 'was'}. Scheur de strip doormidden en bewaar de andere helft droog.`,
    },
    {
      question: isVaatwas
        ? 'Maakt het uit welk programma ik kies?'
        : 'Werken wasstrips bij 20°C?',
      answer: isVaatwas
        ? 'Ja. Het intensieve programma (65-75°C) is het beste voor zwaar bevuild servies. Het eco-programma (45°C) werkt prima voor dagelijkse vaat. Let op: bij eco-programma moet de strip goed bereikbaar zijn voor water.'
        : 'De meeste wasstrips lossen op vanaf 20°C, maar de effectiviteit verschilt per merk. Bij twijfel: kies 30°C voor een betrouwbaar resultaat.',
    },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${site.productNounCapitalized} ${pageTitle}`,
    "description": `Doseergids voor ${nouns}`,
    "author": { "@type": "Organization", "name": site.name },
    "publisher": { "@type": "Organization", "name": site.name },
    "datePublished": "2024-06-01",
    "dateModified": new Date().toISOString(),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": site.canonicalBase },
      { "@type": "ListItem", "position": 2, "name": "Gids", "item": `${site.canonicalBase}/gids` },
      { "@type": "ListItem", "position": 3, "name": "Troubleshooting", "item": `${site.canonicalBase}/gids/troubleshooting` },
      { "@type": "ListItem", "position": 4, "name": pageTitle, "item": `${site.canonicalBase}/gids/troubleshooting/dosering-problemen` },
    ],
  };

  const doseringTable = isVaatwas
    ? [
        { situation: 'Halfvolle vaatwasser, licht bevuild', strips: '½ strip', temp: '45-55°C' },
        { situation: 'Volle vaatwasser, normaal bevuild', strips: '1 strip', temp: '55°C' },
        { situation: 'Volle vaatwasser, zwaar bevuild', strips: '1-1½ strip', temp: '65°C' },
        { situation: 'Aangekoekt eten (pannen, ovenschalen)', strips: '1½-2 strips', temp: '65-75°C' },
      ]
    : [
        { situation: 'Halfvolle trommel (3-4 kg), licht bevuild', strips: '½ strip', temp: '20-30°C' },
        { situation: 'Normale was (5-7 kg)', strips: '1 strip', temp: '30°C' },
        { situation: 'Volle trommel (8+ kg), normaal bevuild', strips: '1 strip', temp: '30-40°C' },
        { situation: 'Zware was (sportkleding, handdoeken)', strips: '1½-2 strips', temp: '40-60°C' },
        { situation: 'Koud wassen (20°C), normaal bevuild', strips: '1 strip', temp: '20°C' },
      ];

  const tips = isVaatwas
    ? [
        { title: 'Plaats de strip altijd los in de machine', detail: 'Niet in het zeepvakje. Leg de strip op het bovenrek of in het bestekmandje zodat water er direct bij kan.' },
        { title: 'Spoel aangekoekt eten even voor', detail: 'Een snelle voorspoeling van zwaar bevuild servies voorkomt dat je extra strips nodig hebt.' },
        { title: 'Stapel niet te hoog', detail: 'Als borden en schalen te dicht op elkaar staan, bereikt het water niet alle oppervlakken.' },
        { title: 'Gebruik glansspoelmiddel apart', detail: 'Vaatwasstrips bevatten meestal geen glansspoelmiddel. Vul het reservoir apart voor streepvrij resultaat.' },
      ]
    : [
        { title: 'Leg de strip bovenop de was', detail: 'Niet in het wasmiddellade. Direct contact met water zorgt voor snellere en volledige oplossing.' },
        { title: 'Kies minimaal 30°C bij twijfel', detail: 'Hoewel de meeste strips werken vanaf 20°C, garandeert 30°C volledige oplossing bij alle merken.' },
        { title: 'Volle trommel = maximaal 80%', detail: 'Laat ruimte voor watercirculatie. Te vol = slechter wasresultaat en kans op residu.' },
        { title: 'Extra spoelgang bij gevoelige huid', detail: 'Een extra spoelbeurt verwijdert alle zeepresten, ideaal voor babykleding of gevoelige huid.' },
      ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-sm text-gray-500 mb-6">
          <Link href="/gids" className="hover:text-primary">Gids</Link>
          {' • '}
          <Link href="/gids/troubleshooting" className="hover:text-primary">Troubleshooting</Link>
          {' • '}
          <span>Dosering</span>
        </p>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-primary mb-3">
                {site.productNounCapitalized} {pageTitle}
              </h1>
              <p className="text-gray-600">De juiste dosering voor elke situatie</p>
            </div>

            {/* Doseertabel */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Doseertabel</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 pr-4 font-semibold text-gray-900">Situatie</th>
                      <th className="text-left py-3 pr-4 font-semibold text-gray-900">Aantal strips</th>
                      <th className="text-left py-3 font-semibold text-gray-900">Temperatuur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doseringTable.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 pr-4 text-gray-600">{row.situation}</td>
                        <td className="py-3 pr-4 font-semibold text-primary">{row.strips}</td>
                        <td className="py-3 text-gray-600">{row.temp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * Dosering kan per merk verschillen. Raadpleeg altijd de verpakking voor merkspecifieke aanbevelingen.
              </p>
            </div>

            {/* Tips */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Tips voor optimale dosering</h2>
              <div className="space-y-4">
                {tips.map((tip) => (
                  <div key={tip.title} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                      <p className="text-gray-600 text-sm">{tip.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hard water warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Let op: hard water</h3>
                  <p className="text-gray-600 text-sm">
                    {isVaatwas
                      ? 'In hard-water-gebieden (Utrecht, Zeeland) kan het nodig zijn om de onthardingsinstelling van je vaatwasser te verhogen. Dit is geen doseringsprobleem maar een waterprobleem.'
                      : 'In hard-water-gebieden (Utrecht, Zeeland) kan het nodig zijn om een halve strip extra te gebruiken. Sommige merken bieden speciale hard-water-varianten aan.'}
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Veelgestelde vragen</h2>
              <div className="space-y-0">
                {faqs.map(faq => (
                  <div key={faq.question} className="border-b border-gray-100 last:border-0 py-4 first:pt-0 last:pb-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <GidsSidebar
            relatedGuides={[
              { href: '/gids/troubleshooting/strip-lost-niet-op', title: `${site.productNounCapitalized.slice(0, -1)} lost niet op`, description: 'Oorzaken en oplossingen' },
              { href: '/gids/kopen-tips', title: 'Kopen Tips', description: `Waar let je op bij het vergelijken van ${nouns}?` },
            ]}
          />
        </div>
      </article>
    </>
  );
}
