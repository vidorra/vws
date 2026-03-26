import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { getSite } from '@/lib/get-site';
import GidsSidebar from '@/components/GidsSidebar';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  const noun = site.productNounCapitalized;
  return {
    title: `${noun.slice(0, -1)} Lost Niet Op - Oorzaken & Oplossingen`,
    description: `Je ${site.productNounSingular} lost niet volledig op? Ontdek de 5 meest voorkomende oorzaken en directe oplossingen.`,
    openGraph: {
      title: `${noun.slice(0, -1)} Lost Niet Op`,
      description: `Oorzaken en oplossingen wanneer je ${site.productNounSingular} niet oplost`,
      type: 'article',
    },
    alternates: {
      canonical: `${site.canonicalBase}/gids/troubleshooting/strip-lost-niet-op`,
    },
  };
}

export default function StripLostNietOpPage() {
  const site = getSite();
  const isVaatwas = site.key === 'vaatwasstrips';
  const machine = isVaatwas ? 'vaatwasser' : 'wasmachine';
  const noun = site.productNounSingular;
  const nouns = site.productNoun;

  const faqs = [
    {
      question: `Waarom lost mijn ${noun} niet op?`,
      answer: `De meest voorkomende oorzaak is een te lage watertemperatuur of een overvolle ${machine}. Zorg dat het water minimaal ${isVaatwas ? '45' : '20'}°C is en dat de ${machine} niet te vol zit.`,
    },
    {
      question: `Kan ik een half opgeloste ${noun} opnieuw gebruiken?`,
      answer: `Nee, een deels opgeloste strip heeft al een deel van de werkzame stoffen afgegeven. Gebruik een nieuwe strip en pas de tips uit dit artikel toe.`,
    },
    {
      question: `Werken alle ${nouns} even goed bij koud water?`,
      answer: isVaatwas
        ? 'De meeste vaatwasstrips zijn ontworpen voor temperaturen van 45-65°C. Bij eco-programma\'s (45°C) lossen ze iets langzamer op maar nog steeds volledig.'
        : 'De meeste wasstrips lossen op vanaf 20°C, maar de snelheid verschilt per merk. Premium merken lossen doorgaans sneller op bij lagere temperaturen.',
    },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${site.productNounCapitalized.slice(0, -1)} Lost Niet Op - Oorzaken & Oplossingen`,
    "description": `Troubleshooting gids voor ${nouns} die niet oplossen`,
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
      { "@type": "ListItem", "position": 4, "name": "Strip lost niet op", "item": `${site.canonicalBase}/gids/troubleshooting/strip-lost-niet-op` },
    ],
  };

  const causes = isVaatwas
    ? [
        { title: 'Te lage temperatuur', description: 'Het eco-programma (45°C) kan soms te koel zijn voor bepaalde merken. Probeer een normaal programma (55-65°C).' },
        { title: 'Strip zit ingeklemd', description: 'Als de strip tussen borden of pannen klem zit, kan het water er niet goed bij. Plaats de strip los in het bestekmandje of op het bovenrek.' },
        { title: 'Overvolle vaatwasser', description: 'Bij een te volle machine circuleert het water niet goed genoeg. Laat wat ruimte tussen de items.' },
        { title: 'Strip is te oud of vochtig', description: 'Vaatwasstrips die vocht hebben geabsorbeerd kunnen aan elkaar plakken en slechter oplossen. Bewaar ze droog.' },
        { title: 'Verkeerde plaatsing', description: 'Plaats de strip niet in het zeepvakje. Leg hem los in de machine zodat het water er direct bij kan.' },
      ]
    : [
        { title: 'Te lage temperatuur', description: 'Hoewel wasstrips werken vanaf 20°C, lossen sommige merken trager op bij koud water. Probeer 30°C als minimum.' },
        { title: 'Strip zit ingeklemd in kleding', description: 'Als de strip in een zak of opgevouwen kledingstuk zit, bereikt het water de strip niet. Leg de strip bovenop de was.' },
        { title: 'Overvolle wasmachine', description: 'Bij een te volle trommel (meer dan 80% vol) kan de strip niet goed circuleren en oplossen.' },
        { title: 'Strip is vochtig geworden', description: 'Strips die vocht hebben geabsorbeerd plakken aan elkaar en lossen slechter op. Bewaar ze altijd droog.' },
        { title: 'Te kort wasprogramma', description: 'Een snel wasprogramma (15-30 min) geeft de strip soms te weinig tijd. Kies een normaal programma van 45+ minuten.' },
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
          <span>Strip lost niet op</span>
        </p>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-primary mb-3">
                {site.productNounCapitalized.slice(0, -1)} Lost Niet Op
              </h1>
              <p className="text-gray-600">
                De 5 meest voorkomende oorzaken en directe oplossingen
              </p>
            </div>

            {/* Snel antwoord */}
            <div className="bg-brand-light border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-primary mb-2">Snel antwoord</h2>
              <p className="text-gray-700">
                In 90% van de gevallen lost het probleem zich op door de {noun} <strong>los bovenop</strong> de {isVaatwas ? 'vaat' : 'was'} te leggen,
                de {machine} maximaal 80% te vullen, en een programma van minimaal {isVaatwas ? '55' : '30'}°C te kiezen.
              </p>
            </div>

            {/* Oorzaken */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">5 oorzaken waarom je {noun} niet oplost</h2>
              <div className="space-y-4">
                {causes.map((cause, i) => (
                  <div key={cause.title} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <span className="bg-brand-light text-primary rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{cause.title}</h3>
                      <p className="text-gray-600 text-sm">{cause.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stap-voor-stap */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Stap-voor-stap oplossing</h2>
              <ol className="space-y-4">
                {[
                  { step: `Haal de ${noun} uit de verpakking en vouw hem niet dubbel`, detail: 'Een gevouwen strip heeft minder oppervlakte in contact met water.' },
                  { step: isVaatwas ? 'Leg de strip los op het bovenrek of in het bestekmandje' : 'Leg de strip bovenop de was in de trommel', detail: `Niet in het ${isVaatwas ? 'zeepvakje' : 'wasmiddellade'} stoppen.` },
                  { step: `Vul de ${machine} tot maximaal 80%`, detail: 'Water moet vrij kunnen circuleren.' },
                  { step: `Kies een programma van minimaal ${isVaatwas ? '55' : '30'}°C`, detail: isVaatwas ? 'Eco-programma werkt ook, maar normaal programma is betrouwbaarder.' : 'Koud wassen (20°C) kan bij sommige merken te laag zijn.' },
                  { step: 'Start de machine en controleer na afloop', detail: 'Als de strip nog steeds niet oplost, probeer een ander merk.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{item.step}</p>
                      <p className="text-gray-600 text-sm">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
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

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Nog steeds problemen?</h3>
                  <p className="text-gray-600 text-sm">
                    Als de strip na het volgen van alle stappen nog steeds niet oplost, kan het aan het specifieke merk liggen.
                    Probeer de <Link href="/productfinder" className="text-primary hover:underline font-medium">Productfinder</Link> om
                    een {noun} te vinden die beter bij jouw {machine} past.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <GidsSidebar
            relatedGuides={[
              { href: '/gids/troubleshooting/dosering-problemen', title: isVaatwas ? 'Dosering bij vol gevulde machine' : 'Dosering bij lage temperaturen', description: 'Tips voor de juiste dosering' },
              { href: '/gids/beginners', title: 'Beginners Gids', description: `Hoe gebruik je ${nouns}?` },
            ]}
            sisterSite={site.sisterSite}
          />
        </div>
      </article>
    </>
  );
}
