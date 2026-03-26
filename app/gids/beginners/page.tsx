import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { getSite } from '@/lib/get-site';
import GidsSidebar from '@/components/GidsSidebar';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return {
    title: `Beginners Gids ${site.productNounCapitalized} - Alles wat je moet weten`,
    description: `Complete beginners gids voor ${site.productNoun}. Leer hoe je ${site.productNoun} gebruikt, doseertips en veelgestelde vragen.`,
    openGraph: {
      title: `Beginners Gids ${site.productNounCapitalized}`,
      description: `Alles wat je moet weten om te starten met ${site.productNoun}`,
      type: 'article',
    },
    alternates: {
      canonical: `${site.canonicalBase}/gids/beginners`,
    },
  };
}

const faqs = [
  { question: 'Werken wasstrips in koud water?', answer: 'Ja! Wasstrips zijn speciaal ontwikkeld om al vanaf 20°C volledig op te lossen. Dit maakt ze ideaal voor koud wassen en energiebesparing.' },
  { question: 'Zijn wasstrips geschikt voor gevoelige huid?', answer: 'De meeste wasstrips zijn hypoallergeen en geschikt voor gevoelige huid. Check altijd de verpakking voor specifieke informatie over het merk dat je kiest.' },
  { question: 'Kan ik wasstrips gebruiken voor handwas?', answer: 'Absoluut! Los een halve strip op in een emmer warm water voor handwas. Perfect voor delicate items of op reis.' },
];

const steps = [
  { title: 'Sorteer je was', description: 'Net als bij normaal wassen, sorteer op kleur en temperatuur' },
  { title: 'Plaats de was in de machine', description: 'Vul de trommel niet te vol voor beste resultaten' },
  { title: 'Voeg de wasstrip toe', description: 'Leg de strip direct op de was, NIET in het wasmiddellade' },
  { title: 'Start het wasprogramma', description: 'Kies je gewenste programma en temperatuur' },
];

const tips = [
  { title: 'Vlekken', text: 'Voor hardnekkige vlekken: maak de vlek nat en wrijf er een stukje wasstrip op. Laat 5 minuten intrekken voor het wassen.' },
  { title: 'Opslag', text: 'Bewaar wasstrips in een droge ruimte. Vocht kan ze laten plakken. De originele verpakking is meestal het beste.' },
  { title: 'Reizen', text: 'Neem een paar strips mee op reis in een ziplock zakje. Geen gedoe met vloeistoffen bij de security!' },
  { title: 'Wasverzachter', text: 'Wasstrips bevatten vaak al verzachtende ingrediënten. Extra wasverzachter is meestal niet nodig.' },
];

export default function BeginnersGuidePage() {
  const site = getSite();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Beginners Gids ${site.productNounCapitalized}`,
    "description": `Complete gids voor beginners over het gebruik van ${site.productNoun}`,
    "author": { "@type": "Organization", "name": site.name },
    "publisher": { "@type": "Organization", "name": site.name },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString(),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
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
      { "@type": "ListItem", "position": 3, "name": "Beginners", "item": `${site.canonicalBase}/gids/beginners` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto px-2 sm:px-4 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="text-sm text-gray-500 mb-2">Gids &bull; Beginners</div>
                  <h1 className="text-2xl font-bold text-primary mb-3 flex items-center">
                    <BookOpen className="w-6 h-6 mr-3 text-primary" />
                    Beginners Gids {site.productNounCapitalized}
                  </h1>
                  <p className="text-gray-500 leading-relaxed">
                    Alles wat je moet weten om te starten met {site.productNoun}
                  </p>
                </div>

                {/* Wat zijn wasstrips? */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Wat zijn {site.productNoun}?</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {site.productNounCapitalized} zijn dunne, voorgedoseerde velletjes wasmiddel die je direct in de wastrommel gooit. Ze bevatten geconcentreerd wasmiddel zonder water, waardoor ze veel compacter zijn dan traditioneel vloeibaar wasmiddel of waspoeder.
                  </p>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium text-primary mb-2">Hoe werken {site.productNoun}?</h3>
                    <p className="text-gray-700">
                      Zodra de strip in contact komt met water, lost deze volledig op en verspreidt het wasmiddel zich gelijkmatig door je was. De actieve ingrediënten gaan direct aan het werk om vuil en vlekken te verwijderen.
                    </p>
                  </div>
                </section>

                {/* Voordelen */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Voordelen van {site.productNoun}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Milieuvriendelijk', desc: 'Geen plastic verpakking, biologisch afbreekbaar' },
                      { title: 'Ruimtebesparend', desc: 'Neemt 94% minder ruimte in dan vloeibaar wasmiddel' },
                      { title: 'Geen overdosering', desc: 'Voorgedoseerd voor perfecte resultaten' },
                      { title: 'Geen morsen', desc: 'Schone handen, schone wasmachine' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-primary">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Stap voor stap */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Hoe gebruik je {site.productNoun}?</h2>
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-primary">{step.title}</h3>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                      </div>
                    ))}
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
                        Plaats de wasstrip altijd direct op de was, niet in het wasmiddellade. Dit zorgt voor optimale oplossing en wasresultaten.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dosering */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Dosering tips</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-white">
                          <th className="border border-gray-300 px-4 py-2 text-left">Wastype</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Aantal strips</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Licht bevuilde was (4-5 kg)</td>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">1 strip</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-gray-300 px-4 py-2">Normaal bevuilde was (6-8 kg)</td>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">1 strip</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Zwaar bevuilde was</td>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">2 strips</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-gray-300 px-4 py-2">Extra grote was (8+ kg)</td>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">2 strips</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* FAQ */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Veelgestelde Vragen</h2>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index}>
                        <h3 className="font-medium text-gray-700 mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                        {index < faqs.length - 1 && <div className="border-b border-gray-200 mt-4"></div>}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Tips */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Tips &amp; Tricks
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tips.map((tip, index) => (
                      <div key={index}>
                        <h3 className="font-medium text-primary mb-1">{tip.title}</h3>
                        <p className="text-gray-600 text-sm">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Related Guides */}
                <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-primary mb-4">Gerelateerde Gidsen</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/gids/milieuvriendelijk" className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                      <div className="font-medium text-primary text-sm">Milieuvriendelijk Wassen &rarr;</div>
                      <div className="text-xs text-gray-600 mt-1">Duurzaamheid uitgelegd</div>
                    </Link>
                    <Link href="/gids/kopen-tips" className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                      <div className="font-medium text-primary text-sm">Kopen Tips &rarr;</div>
                      <div className="text-xs text-gray-600 mt-1">Waar op letten bij het vergelijken</div>
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
                    <h2 className="text-lg font-semibold text-primary mb-2">Klaar om te beginnen?</h2>
                    <p className="text-gray-600 mb-4">Ontdek welke {site.productNoun} het beste bij jou passen</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link href="/prijzen/goedkoopste" className="inline-flex items-center px-5 py-2 btn-primary rounded-lg text-sm">
                        Bekijk goedkoopste opties
                      </Link>
                      <Link href="/#vergelijking" className="inline-flex items-center px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-primary hover:border-primary transition-colors">
                        Vergelijk alle merken
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <GidsSidebar
              relatedGuides={[
                { href: '/gids/milieuvriendelijk', title: 'Milieuvriendelijk Wassen', description: 'Duurzaam wassen uitgelegd' },
                { href: '/gids/kopen-tips', title: 'Kopen Tips', description: 'Slim vergelijken en kopen' },
              ]}
              sisterSite={site.sisterSite}
            />
          </div>
        </div>
      </div>
    </>
  );
}
