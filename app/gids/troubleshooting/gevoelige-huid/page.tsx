import { Metadata } from 'next';
import Link from 'next/link';
import { ThermometerSun, CheckCircle, AlertCircle } from 'lucide-react';
import { getSite } from '@/lib/get-site';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  const isVaatwas = site.key === 'vaatwasstrips';
  const title = isVaatwas
    ? 'Troebel Bestek en Glas na Vaatwasstrips - Oplossingen'
    : 'Wasstrips en Gevoelige Huid - Allergische Reactie Voorkomen';
  const description = isVaatwas
    ? 'Troebel of dof bestek na het draaien met vaatwasstrips? Oorzaken en oplossingen voor helder resultaat.'
    : 'Last van huidirritatie door wasstrips? Tips om allergische reacties te voorkomen en de juiste wasstrip te kiezen.';
  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
  };
}

export default function GevoeligeHuidPage() {
  const site = getSite();
  const isVaatwas = site.key === 'vaatwasstrips';
  const nouns = site.productNoun;

  const pageTitle = isVaatwas ? 'Troebel Bestek en Glas' : 'Gevoelige Huid & Allergische Reactie';
  const pageSubtitle = isVaatwas
    ? 'Waarom je bestek en glazen dof of troebel worden en hoe je het oplost'
    : 'Hoe je huidirritatie door wasstrips voorkomt en welke merken het veiligst zijn';

  const faqs = isVaatwas
    ? [
        {
          question: 'Is troebel glas een teken dat mijn vaatwasstrip niet werkt?',
          answer: 'Nee, troebel glas wordt niet veroorzaakt door slechte reiniging maar door kalkaanslag of etching (glazuurschade). De reiniging werkt prima, maar er is een bijkomend probleem.',
        },
        {
          question: 'Kan ik troebel glas weer helder krijgen?',
          answer: 'Kalkaanslag: ja, week het glas in witte azijn (1:3 met water) gedurende 30 minuten. Etching (permanente glazuurschade): helaas niet meer te herstellen.',
        },
        {
          question: 'Welke vaatwasstrips zijn het beste tegen troebelheid?',
          answer: 'Strips met ingebouwde waterontharder presteren het best in hard-water-gebieden. Check onze merkvergelijking voor details.',
        },
      ]
    : [
        {
          question: 'Zijn wasstrips hypoallergeen?',
          answer: 'De meeste wasstrips zijn hypoallergeen, maar niet allemaal. Kijk op de verpakking naar de vermelding "hypoallergeen" of "dermatologisch getest". Geurvrije varianten zijn over het algemeen het veiligst.',
        },
        {
          question: 'Wat doe ik als ik een allergische reactie krijg?',
          answer: 'Stop direct met het gebruik van de betreffende wasstrip. Was de kleding opnieuw met alleen water en een extra spoelgang. Bij aanhoudende klachten: raadpleeg een huisarts of dermatoloog.',
        },
        {
          question: 'Zijn wasstrips veiliger dan vloeibaar wasmiddel voor gevoelige huid?',
          answer: 'Over het algemeen ja, omdat wasstrips minder chemische toevoegingen bevatten. Ze zijn voorgedoseerd (geen overdosering) en bevatten vaak minder parfum. Maar individuele gevoeligheid verschilt.',
        },
      ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${site.productNounCapitalized}: ${pageTitle}`,
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
      { "@type": "ListItem", "position": 4, "name": pageTitle, "item": `${site.canonicalBase}/gids/troubleshooting/gevoelige-huid` },
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
          <span className="text-gray-900">{isVaatwas ? 'Troebel bestek' : 'Gevoelige huid'}</span>
        </nav>

        <header className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-red-100">
              <ThermometerSun className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">{pageTitle}</h1>
          <p className="text-xl text-gray-600 text-center">{pageSubtitle}</p>
        </header>

        {isVaatwas ? (
          <>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Waarom wordt bestek troebel?</h2>
              <p className="text-gray-600 mb-4">
                Troebel of dof bestek en glazen na de vaatwasser heeft twee mogelijke oorzaken.
                Het is belangrijk om het verschil te kennen, want de oplossing verschilt:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-5">
                  <h3 className="font-semibold text-blue-800 mb-2">Kalkaanslag (reversibel)</h3>
                  <ul className="text-gray-600 space-y-2 list-disc pl-4 text-sm">
                    <li>Witte, melkachtige waas op glazen</li>
                    <li>Verdwijnt als je er met azijn overheen wrijft</li>
                    <li>Veroorzaakt door hard water + onvoldoende ontharding</li>
                    <li>Oplossing: glansspoelmiddel + onthardingsinstelling aanpassen</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-5">
                  <h3 className="font-semibold text-red-800 mb-2">Etching / glazuurschade (permanent)</h3>
                  <ul className="text-gray-600 space-y-2 list-disc pl-4 text-sm">
                    <li>Regenboogachtige of permanent doffe glazen</li>
                    <li>Verdwijnt NIET met azijn</li>
                    <li>Veroorzaakt door te heet wassen of te agressieve chemicaliën</li>
                    <li>Helaas niet te herstellen; voorkom door lagere temperatuur</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Oplossingen</h2>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <ol className="space-y-4">
                  {[
                    { step: 'Controleer en vul het glansspoelmiddel', detail: 'Vaatwasstrips bevatten geen glansspoelmiddel. Vul het reservoir van je vaatwasser altijd apart.' },
                    { step: 'Stel de waterhardheid in op je vaatwasser', detail: 'Check je waterhardheid via je waterleidingbedrijf. Stel de ontharder van je vaatwasser in op de juiste waarde.' },
                    { step: 'Gebruik regenereerzout', detail: 'Vul het zoutreservoir regelmatig bij. Zonder zout werkt de ingebouwde ontharder van je vaatwasser niet.' },
                    { step: 'Kies een lager temperatuurprogramma', detail: 'Was glazen op 55°C in plaats van 65°C om etching te voorkomen. Pannen en borden kunnen hoger.' },
                    { step: 'Week troebele glazen in azijnoplossing', detail: 'Meng 1 deel witte azijn met 3 delen water. Week glazen 30 minuten. Als de troebelheid verdwijnt: het was kalk.' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold">{item.step}</p>
                        <p className="text-gray-600 text-sm">{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Mogelijke oorzaken van huidirritatie</h2>
              <div className="space-y-4">
                {[
                  { title: 'Geurstof-allergie', description: 'Parfum en geurstof zijn de meest voorkomende allergenen in wasmiddelen. Kies een geurvrije variant als je last hebt van irritatie.' },
                  { title: 'Zeepresten in kleding', description: 'Bij overdosering of te weinig spoelen blijven zeepresten in de vezels zitten. Dit kan jeuken, roodheid of uitslag veroorzaken.' },
                  { title: 'Specifieke ingrediënten', description: 'Sommige mensen zijn gevoelig voor bepaalde tensiden of enzymen. Een wasstrip met plantaardige tensiden is vaak zachter voor de huid.' },
                  { title: 'Kleurstoffen', description: 'Gekleurde wasstrips bevatten soms kleurstoffen die bij gevoelige huid irritatie kunnen geven. Kies een witte of ongekleurde variant.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-lg shadow p-5">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Zo voorkom je huidirritatie</h2>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <ol className="space-y-4">
                  {[
                    { step: 'Kies een geurvrije wasstrip', detail: 'Parfumvrije varianten zijn het veiligst voor gevoelige huid. Check het label op "fragrance free" of "parfumvrij".' },
                    { step: 'Gebruik de juiste dosering', detail: 'Overdosering is een veelvoorkomende oorzaak van zeepresten in kleding. Gebruik een halve strip bij een halfvolle trommel.' },
                    { step: 'Stel een extra spoelgang in', detail: 'Een extra spoelbeurt verwijdert alle zeepresten uit de kleding. Essentieel voor babykleding en ondergoed.' },
                    { step: 'Was op 30-40°C', detail: 'Hogere temperaturen openen de vezels en sluiten meer zeepresten in. 30-40°C is ideaal voor dagelijkse was.' },
                    { step: 'Test eerst met een klein kledingstuk', detail: 'Bij een nieuw merk: was eerst een t-shirt en draag het een dag. Zo test je of je huid goed reageert.' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold">{item.step}</p>
                        <p className="text-gray-600 text-sm">{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-12">
              <div className="flex">
                <AlertCircle className="h-6 w-6 text-red-400 mr-2 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Wanneer naar de huisarts?</h4>
                  <p className="text-gray-600">
                    Als je last hebt van ernstige jeuk, zwelling, blaasjes of uitslag die langer dan 2 dagen aanhoudt,
                    raadpleeg dan je huisarts of een dermatoloog. Neem de ingrediëntenlijst van de wasstrip mee.
                  </p>
                </div>
              </div>
            </div>
          </>
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
              <Link href="/gids/troubleshooting/witte-aanslag" className="text-blue-600 hover:text-blue-800">
                &rarr; {isVaatwas ? 'Witte aanslag op glazen' : 'Witte vlekken op donkere kleding'}
              </Link>
            </li>
            <li>
              <Link href="/gids/troubleshooting/dosering-problemen" className="text-blue-600 hover:text-blue-800">
                &rarr; {isVaatwas ? 'Dosering bij vol gevulde machine' : 'Dosering bij lage temperaturen'}
              </Link>
            </li>
            <li>
              <Link href="/gids/milieuvriendelijk" className="text-blue-600 hover:text-blue-800">
                &rarr; Milieuvriendelijk {isVaatwas ? 'afwassen' : 'wassen'}: ingrediënten uitgelegd
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </>
  );
}
