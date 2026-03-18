import { Metadata } from 'next';
import Link from 'next/link';
import { Gauge, CheckCircle, AlertCircle } from 'lucide-react';
import { getSite } from '@/lib/get-site';

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

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/gids" className="hover:text-blue-600">Gids</Link>
          <span className="mx-2">/</span>
          <Link href="/gids/troubleshooting" className="hover:text-blue-600">Troubleshooting</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Dosering</span>
        </nav>

        <header className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-orange-100">
              <Gauge className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">
            {site.productNounCapitalized} {pageTitle}
          </h1>
          <p className="text-xl text-gray-600 text-center">
            De juiste dosering voor elke situatie
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Doseertabel</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Situatie</th>
                  <th className="text-left py-3 px-4 font-semibold">Aantal strips</th>
                  <th className="text-left py-3 px-4 font-semibold">Temperatuur</th>
                </tr>
              </thead>
              <tbody>
                {doseringTable.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-4">{row.situation}</td>
                    <td className="py-3 px-4 font-semibold">{row.strips}</td>
                    <td className="py-3 px-4">{row.temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            * Dosering kan per merk verschillen. Raadpleeg altijd de verpakking voor merkspecifieke aanbevelingen.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Tips voor optimale dosering</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip) => (
              <div key={tip.title} className="bg-white rounded-lg shadow p-5">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">{tip.title}</h3>
                    <p className="text-gray-600 text-sm">{tip.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-12">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-yellow-400 mr-2 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold">Let op: hard water</h4>
              <p className="text-gray-600">
                {isVaatwas
                  ? 'In hard-water-gebieden (Utrecht, Zeeland) kan het nodig zijn om de onthardingsinstelling van je vaatwasser te verhogen. Dit is geen doseringsprobleem maar een waterprobleem.'
                  : 'In hard-water-gebieden (Utrecht, Zeeland) kan het nodig zijn om een halve strip extra te gebruiken. Sommige merken bieden speciale hard-water-varianten aan.'}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Veelgestelde vragen</h2>
          <div className="space-y-4">
            {faqs.map(faq => (
              <details key={faq.question} className="bg-white rounded-lg shadow p-4">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="bg-gray-50 rounded-lg p-6 mb-10">
          <h3 className="font-bold mb-3">Gerelateerde artikelen</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/gids/troubleshooting/strip-lost-niet-op" className="text-blue-600 hover:text-blue-800">
                &rarr; {site.productNounCapitalized.slice(0, -1)} lost niet op
              </Link>
            </li>
            <li>
              <Link href="/gids/kopen-tips" className="text-blue-600 hover:text-blue-800">
                &rarr; Kopen tips: waar op letten bij het vergelijken van {nouns}
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </>
  );
}
