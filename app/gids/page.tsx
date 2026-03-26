import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Leaf, ShoppingCart, Wrench, Lightbulb, ArrowRight } from 'lucide-react';
import { getSite } from '@/lib/get-site';
import GidsSidebar from '@/components/GidsSidebar';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return {
    title: `${site.productNounCapitalized} Gids - Alles wat je moet weten`,
    description: `Complete gids over ${site.productNoun}. Van beginners tips tot milieuvriendelijk wassen. Leer alles over het gebruik van ${site.productNoun}.`,
    alternates: { canonical: `${site.canonicalBase}/gids` },
    openGraph: {
      title: `${site.productNounCapitalized} Gids`,
      description: `Complete gids over ${site.productNoun}`,
      type: 'article',
    },
  };
}

const guides = [
  {
    slug: 'beginners',
    title: 'Beginners Gids',
    description: 'Alles wat je moet weten om te starten',
    icon: BookOpen,
    topics: ['Wat zijn wasstrips?', 'Hoe gebruik je wasstrips?', 'Dosering en tips', 'Veelgestelde vragen'],
  },
  {
    slug: 'milieuvriendelijk',
    title: 'Milieuvriendelijk Wassen',
    description: 'De impact op het milieu en duurzaam wassen',
    icon: Leaf,
    topics: ['Milieuvoordelen', 'Plasticvrij wassen', 'CO2 besparing', 'Biologisch afbreekbaar'],
  },
  {
    slug: 'kopen-tips',
    title: 'Kopen Tips',
    description: 'Waar op te letten bij het kopen',
    icon: ShoppingCart,
    topics: ['Prijsvergelijking', 'Kwaliteitsindicatoren', 'Waar te kopen', 'Bulk kortingen'],
  },
  {
    slug: 'troubleshooting',
    title: 'Problemen Oplossen',
    description: 'Veelvoorkomende problemen en oplossingen',
    icon: Wrench,
    topics: ['Strip lost niet op', 'Witte aanslag', 'Dosering problemen', 'Gevoelige huid'],
  },
];

const quickTips = [
  { title: 'Dosering', text: 'Gebruik 1 strip voor normale was, 2 strips voor grote of vuile was' },
  { title: 'Temperatuur', text: 'Wasstrips werken al vanaf 20°C, ideaal voor koud wassen' },
  { title: 'Oplossen', text: 'Plaats de strip direct op de was, niet in het wasmiddellade' },
  { title: 'Opslag', text: 'Bewaar wasstrips droog en uit direct zonlicht' },
];

const faqItems = [
  { question: 'Zijn wasstrips geschikt voor alle wasmachines?', answer: 'Ja, wasstrips werken in alle wasmachines: voorladers, bovenladers, en zelfs voor handwas.' },
  { question: 'Hoe lang zijn wasstrips houdbaar?', answer: 'Wasstrips zijn meestal 2-3 jaar houdbaar mits droog bewaard. Check de verpakking voor exacte datum.' },
  { question: 'Werken wasstrips ook bij hardnekkige vlekken?', answer: 'Voor hardnekkige vlekken raden we aan om deze voor te behandelen of een extra strip te gebruiken.' },
];

export default function GidsPage() {
  const site = getSite();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": site.canonicalBase },
      { "@type": "ListItem", "position": 2, "name": "Gids", "item": `${site.canonicalBase}/gids` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <div className="mx-auto px-2 sm:px-4 py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="text-sm text-gray-500 mb-2">Gids</div>
                <h1 className="text-2xl font-bold text-primary mb-3 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-primary" />
                  {site.productNounCapitalized} Gids
                </h1>
                <p className="text-gray-500 leading-relaxed">
                  Ontdek alles over {site.productNoun} — van basis gebruik tot expert tips
                </p>
              </div>

              {/* Guide Categories */}
              {guides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Link
                    key={guide.slug}
                    href={`/gids/${guide.slug}`}
                    className="block bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6 hover:border-primary transition-colors group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-primary mb-1 group-hover:underline">
                          {guide.title}
                        </h2>
                        <p className="text-gray-600 mb-3">{guide.description}</p>
                        <ul className="space-y-1">
                          {guide.topics.map((topic, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                              <span className="text-gray-700 text-sm">{topic}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex items-center text-primary text-sm font-medium">
                          Lees meer <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Quick Tips */}
              <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Quick Tips
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickTips.map((tip, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-primary mb-1">{tip.title}</h3>
                      <p className="text-gray-600 text-sm">{tip.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-primary mb-4">Veelgestelde Vragen</h2>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-gray-700 mb-2">{item.question}</h3>
                      <p className="text-gray-600">{item.answer}</p>
                      {index < faqItems.length - 1 && (
                        <div className="border-b border-gray-200 mt-4"></div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <GidsSidebar
            relatedGuides={[
              { href: '/productfinder', title: 'Productfinder', description: 'Vind het beste product voor jouw situatie' },
            ]}
            sisterSite={site.sisterSite}
          />
        </div>
      </div>
    </div>
    </>
  );
}
