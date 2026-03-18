import { Metadata } from 'next';
import Link from 'next/link';
import { Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { getSite } from '@/lib/get-site';

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

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/gids" className="hover:text-blue-600">Gids</Link>
          <span className="mx-2">/</span>
          <Link href="/gids/troubleshooting" className="hover:text-blue-600">Troubleshooting</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{isVaatwas ? 'Witte aanslag' : 'Witte vlekken'}</span>
        </nav>

        <header className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-gray-100">
              <Eye className="h-12 w-12 text-gray-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">{pageTitle}</h1>
          <p className="text-xl text-gray-600 text-center">{pageSubtitle}</p>
        </header>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Oorzaken</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {causes.map((cause, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-5">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">{cause.title}</h3>
                    <p className="text-gray-600 text-sm">{cause.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Oplossingen</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ol className="space-y-4">
              {solutions.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{item.step}</p>
                    <p className="text-gray-600 text-sm">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {isVaatwas && (
          <section className="mb-12">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-bold mb-3">Wist je dat?</h3>
              <p className="text-gray-700">
                Vaatwasstrips bevatten doorgaans geen glansspoelmiddel, in tegenstelling tot all-in-one tabletten.
                Dit is bewust: zo kun je de hoeveelheid glansspoelmiddel aanpassen aan je waterhardheid.
                In zachte watergebieden heb je minder nodig, in harde watergebieden meer.
              </p>
            </div>
          </section>
        )}

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
              <Link href="/gids/troubleshooting/dosering-problemen" className="text-blue-600 hover:text-blue-800">
                &rarr; {isVaatwas ? 'Dosering bij vol gevulde machine' : 'Dosering bij lage temperaturen'}
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </>
  );
}
