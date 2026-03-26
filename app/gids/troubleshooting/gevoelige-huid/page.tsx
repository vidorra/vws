import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, Info } from 'lucide-react';
import { getSite } from '@/lib/get-site';
import GidsSidebar from '@/components/GidsSidebar';

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
    alternates: {
      canonical: `${site.canonicalBase}/gids/troubleshooting/gevoelige-huid`,
    },
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

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-sm text-gray-500 mb-6">
          <Link href="/gids" className="hover:text-primary">Gids</Link>
          {' • '}
          <Link href="/gids/troubleshooting" className="hover:text-primary">Troubleshooting</Link>
          {' • '}
          <span>{isVaatwas ? 'Troebel bestek' : 'Gevoelige huid'}</span>
        </p>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-primary mb-3">{pageTitle}</h1>
              <p className="text-gray-600">{pageSubtitle}</p>
            </div>

            {isVaatwas ? (
              <>
                {/* Waarom troebel */}
                <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Waarom wordt bestek troebel?</h2>
                  <p className="text-gray-600 mb-4">
                    Troebel of dof bestek en glazen na de vaatwasser heeft twee mogelijke oorzaken.
                    Het is belangrijk om het verschil te kennen, want de oplossing verschilt:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-brand-light rounded-xl p-4">
                      <h3 className="font-semibold text-primary mb-2">Kalkaanslag (reversibel)</h3>
                      <ul className="text-gray-600 space-y-2 text-sm">
                        {[
                          'Witte, melkachtige waas op glazen',
                          'Verdwijnt als je er met azijn overheen wrijft',
                          'Veroorzaakt door hard water + onvoldoende ontharding',
                          'Oplossing: glansspoelmiddel + onthardingsinstelling aanpassen',
                        ].map((item) => (
                          <li key={item} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Etching / glazuurschade (permanent)</h3>
                      <ul className="text-gray-600 space-y-2 text-sm">
                        {[
                          'Regenboogachtige of permanent doffe glazen',
                          'Verdwijnt NIET met azijn',
                          'Veroorzaakt door te heet wassen of te agressieve chemicaliën',
                          'Helaas niet te herstellen; voorkom door lagere temperatuur',
                        ].map((item) => (
                          <li key={item} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Oplossingen vaatwas */}
                <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Oplossingen</h2>
                  <div className="space-y-4">
                    {[
                      { step: 'Controleer en vul het glansspoelmiddel', detail: 'Vaatwasstrips bevatten geen glansspoelmiddel. Vul het reservoir van je vaatwasser altijd apart.' },
                      { step: 'Stel de waterhardheid in op je vaatwasser', detail: 'Check je waterhardheid via je waterleidingbedrijf. Stel de ontharder van je vaatwasser in op de juiste waarde.' },
                      { step: 'Gebruik regenereerzout', detail: 'Vul het zoutreservoir regelmatig bij. Zonder zout werkt de ingebouwde ontharder van je vaatwasser niet.' },
                      { step: 'Kies een lager temperatuurprogramma', detail: 'Was glazen op 55°C in plaats van 65°C om etching te voorkomen. Pannen en borden kunnen hoger.' },
                      { step: 'Week troebele glazen in azijnoplossing', detail: 'Meng 1 deel witte azijn met 3 delen water. Week glazen 30 minuten. Als de troebelheid verdwijnt: het was kalk.' },
                    ].map((item, i) => (
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
              </>
            ) : (
              <>
                {/* Oorzaken huidirritatie */}
                <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Mogelijke oorzaken van huidirritatie</h2>
                  <div className="space-y-4">
                    {[
                      { title: 'Geurstof-allergie', description: 'Parfum en geurstof zijn de meest voorkomende allergenen in wasmiddelen. Kies een geurvrije variant als je last hebt van irritatie.' },
                      { title: 'Zeepresten in kleding', description: 'Bij overdosering of te weinig spoelen blijven zeepresten in de vezels zitten. Dit kan jeuken, roodheid of uitslag veroorzaken.' },
                      { title: 'Specifieke ingrediënten', description: 'Sommige mensen zijn gevoelig voor bepaalde tensiden of enzymen. Een wasstrip met plantaardige tensiden is vaak zachter voor de huid.' },
                      { title: 'Kleurstoffen', description: 'Gekleurde wasstrips bevatten soms kleurstoffen die bij gevoelige huid irritatie kunnen geven. Kies een witte of ongekleurde variant.' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preventie wasstrips */}
                <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Zo voorkom je huidirritatie</h2>
                  <div className="space-y-4">
                    {[
                      { step: 'Kies een geurvrije wasstrip', detail: 'Parfumvrije varianten zijn het veiligst voor gevoelige huid. Check het label op "fragrance free" of "parfumvrij".' },
                      { step: 'Gebruik de juiste dosering', detail: 'Overdosering is een veelvoorkomende oorzaak van zeepresten in kleding. Gebruik een halve strip bij een halfvolle trommel.' },
                      { step: 'Stel een extra spoelgang in', detail: 'Een extra spoelbeurt verwijdert alle zeepresten uit de kleding. Essentieel voor babykleding en ondergoed.' },
                      { step: 'Was op 30-40°C', detail: 'Hogere temperaturen openen de vezels en sluiten meer zeepresten in. 30-40°C is ideaal voor dagelijkse was.' },
                      { step: 'Test eerst met een klein kledingstuk', detail: 'Bij een nieuw merk: was eerst een t-shirt en draag het een dag. Zo test je of je huid goed reageert.' },
                    ].map((item, i) => (
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

                {/* Huisarts warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Wanneer naar de huisarts?</h3>
                      <p className="text-gray-600 text-sm">
                        Als je last hebt van ernstige jeuk, zwelling, blaasjes of uitslag die langer dan 2 dagen aanhoudt,
                        raadpleeg dan je huisarts of een dermatoloog. Neem de ingrediëntenlijst van de wasstrip mee.
                      </p>
                    </div>
                  </div>
                </div>
              </>
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
              { href: '/gids/troubleshooting/witte-aanslag', title: isVaatwas ? 'Witte aanslag op glazen' : 'Witte vlekken op donkere kleding', description: 'Oorzaken en oplossingen' },
              { href: '/gids/troubleshooting/dosering-problemen', title: isVaatwas ? 'Dosering bij vol gevulde machine' : 'Dosering bij lage temperaturen', description: 'Tips voor de juiste dosering' },
              { href: '/gids/milieuvriendelijk', title: 'Milieuvriendelijk', description: `Ingrediënten van ${nouns} uitgelegd` },
            ]}
            sisterSite={site.sisterSite}
          />
        </div>
      </article>
    </>
  );
}
