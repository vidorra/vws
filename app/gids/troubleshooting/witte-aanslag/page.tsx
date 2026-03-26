import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, Info } from 'lucide-react';
import { getSite } from '@/lib/get-site';
import GidsSidebar from '@/components/GidsSidebar';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  const isVaatwas = site.key === 'vaatwasstrips';
  const title = isVaatwas
    ? 'Witte Aanslag op Glazen na Vaatwasstrips - Oplossingen'
    : 'Witte Vlekken op Donkere Kleding na Wasstrips - Oplossingen';
  const description = isVaatwas
    ? 'Last van witte aanslag op glazen en bestek? Ontdek de oorzaken en 4 bewezen oplossingen.'
    : 'Witte vlekken of strepen op donkere was? Ontdek de oorzaken en 4 bewezen oplossingen.';
  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    alternates: {
      canonical: `${site.canonicalBase}/gids/troubleshooting/witte-aanslag`,
    },
  };
}

export default function WitteAanslagPage() {
  const site = getSite();
  const isVaatwas = site.key === 'vaatwasstrips';
  const nouns = site.productNoun;
  const noun = site.productNounSingular;

  const pageTitle = isVaatwas ? 'Witte Aanslag op Glazen' : 'Witte Vlekken op Donkere Kleding';
  const pageSubtitle = isVaatwas
    ? 'Oorzaken en oplossingen voor aanslag na het draaien met vaatwasstrips'
    : 'Oorzaken en oplossingen voor witte vlekken na het wassen met wasstrips';

  const causes = isVaatwas
    ? [
        { title: 'Hard water (kalk)', description: 'In gebieden met hard water (Utrecht, Zeeland, delen van Zuid-Holland) kan kalk neerslaan op glazen. Vaatwasstrips bevatten soms minder onthardingsmiddel dan tabletten.' },
        { title: 'Geen glansspoelmiddel', description: 'Vaatwasstrips bevatten niet altijd glansspoelmiddel. Zonder glansspoelmiddel droogt water op het oppervlak en laat minerale vlekken achter.' },
        { title: 'Overdosering', description: 'Te veel zeep kan een wazig residu achterlaten op glazen. Gebruik de aanbevolen dosering en niet meer.' },
        { title: 'Te lage temperatuur', description: 'Bij eco-programma\'s (45°C) lossen bepaalde mineralen minder goed op, wat aanslag kan veroorzaken.' },
      ]
    : [
        { title: 'Overdosering', description: 'Te veel wasstrip voor de hoeveelheid was. Bij een halfvolle trommel is een halve strip vaak voldoende.' },
        { title: 'Te koud gewassen', description: 'Bij 20°C lost de strip soms niet volledig op, waardoor residu op kleding achterblijft. Probeer 30°C.' },
        { title: 'Overvolle trommel', description: 'Bij een te volle trommel kan het spoelwater niet alle zeepresten wegspoelen, met name uit donkere kleding.' },
        { title: 'Hard water', description: 'In hard-water-gebieden kunnen kalkdeeltjes in combinatie met zeepresten witte vlekken veroorzaken op donkere stoffen.' },
      ];

  const solutions = isVaatwas
    ? [
        { step: 'Vul het glansspoelmiddel-reservoir', detail: 'Gebruik een apart glansspoelmiddel naast je vaatwasstrip. Dit voorkomt 80% van de aanslag.' },
        { step: 'Controleer je waterhardheid', detail: 'Check bij je waterleiding bedrijf. Bij hard water: stel de onthardingsinstelling van je vaatwasser hoger in.' },
        { step: 'Gebruik de juiste dosering', detail: 'Volg de aanbeveling op de verpakking. Bij een halfvolle machine is een halve strip voldoende.' },
        { step: 'Draai af en toe een leeg programma met azijn', detail: 'Een scheutje witte azijn in een leeg programma verwijdert kalkaanslag uit de machine.' },
      ]
    : [
        { step: 'Verlaag de dosering', detail: 'Gebruik een halve strip bij een halfvolle trommel of licht bevuilde was.' },
        { step: 'Verhoog de temperatuur naar 30°C', detail: 'Dit helpt de strip volledig op te lossen en het residu weg te spoelen.' },
        { step: 'Gebruik een extra spoelgang', detail: 'Stel een extra spoelbeurt in op je wasmachine om alle zeepresten te verwijderen.' },
        { step: 'Draai de kleding binnenstebuiten', detail: 'Donkere kleding binnenstebuiten wassen vermindert zichtbare residu-vlekken.' },
      ];

  const faqs = [
    {
      question: isVaatwas ? 'Is witte aanslag schadelijk?' : 'Zijn witte vlekken permanent?',
      answer: isVaatwas
        ? 'Nee, witte aanslag (kalk) is niet schadelijk. Het is een cosmetisch probleem dat eenvoudig te verhelpen is met glansspoelmiddel of azijn.'
        : 'Nee, witte vlekken door zeepresten zijn niet permanent. Was het kledingstuk opnieuw met minder wasstrip en een extra spoelgang.',
    },
    {
      question: `Moet ik overstappen van ${nouns}?`,
      answer: `Nee, ${isVaatwas ? 'witte aanslag' : 'witte vlekken'} is een doseringsprobleem, geen productprobleem. Met de juiste dosering en instellingen verdwijnt het probleem volledig.`,
    },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": pageTitle,
    "description": pageSubtitle,
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
      { "@type": "ListItem", "position": 4, "name": pageTitle, "item": `${site.canonicalBase}/gids/troubleshooting/witte-aanslag` },
    ],
  };

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
          <span>{isVaatwas ? 'Witte aanslag' : 'Witte vlekken'}</span>
        </p>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-primary mb-3">{pageTitle}</h1>
              <p className="text-gray-600">{pageSubtitle}</p>
            </div>

            {/* Oorzaken */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Oorzaken</h2>
              <div className="space-y-4">
                {causes.map((cause) => (
                  <div key={cause.title} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{cause.title}</h3>
                      <p className="text-gray-600 text-sm">{cause.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Oplossingen */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Oplossingen</h2>
              <div className="space-y-4">
                {solutions.map((item, i) => (
                  <div key={i} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <span className="bg-brand-light text-primary rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.step}</p>
                      <p className="text-gray-600 text-sm">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wist je dat (vaatwas only) */}
            {isVaatwas && (
              <div className="bg-brand-light border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Wist je dat?</h3>
                    <p className="text-gray-700 text-sm">
                      Vaatwasstrips bevatten doorgaans geen glansspoelmiddel, in tegenstelling tot all-in-one tabletten.
                      Dit is bewust: zo kun je de hoeveelheid glansspoelmiddel aanpassen aan je waterhardheid.
                      In zachte watergebieden heb je minder nodig, in harde watergebieden meer.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
              { href: '/gids/troubleshooting/dosering-problemen', title: isVaatwas ? 'Dosering bij vol gevulde machine' : 'Dosering bij lage temperaturen', description: 'Tips voor de juiste dosering' },
            ]}
            sisterSite={site.sisterSite}
          />
        </div>
      </article>
    </>
  );
}
