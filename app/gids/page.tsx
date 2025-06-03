import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Leaf, ShoppingCart, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wasstrips Gids - Alles wat je moet weten',
  description: 'Complete gids over wasstrips. Van beginners tips tot milieuvriendelijk wassen. Leer alles over het gebruik van wasstrips.',
  keywords: 'wasstrips gids, handleiding, tips, beginners, milieuvriendelijk'
};

const guides = [
  {
    slug: 'beginners',
    title: 'Beginners Gids',
    description: 'Alles wat je moet weten om te starten met wasstrips',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-800',
    iconColor: 'text-blue-600',
    topics: [
      'Wat zijn wasstrips?',
      'Hoe gebruik je wasstrips?',
      'Dosering en tips',
      'Veelgestelde vragen'
    ]
  },
  {
    slug: 'milieuvriendelijk',
    title: 'Milieuvriendelijk Wassen',
    description: 'De impact van wasstrips op het milieu en duurzaam wassen',
    icon: Leaf,
    color: 'bg-green-100 text-green-800',
    iconColor: 'text-green-600',
    topics: [
      'Milieuvoordelen wasstrips',
      'Plasticvrij wassen',
      'CO2 besparing',
      'Biologisch afbreekbaar'
    ]
  },
  {
    slug: 'kopen-tips',
    title: 'Kopen Tips',
    description: 'Waar op te letten bij het kopen van wasstrips',
    icon: ShoppingCart,
    color: 'bg-purple-100 text-purple-800',
    iconColor: 'text-purple-600',
    topics: [
      'Prijsvergelijking',
      'Kwaliteitsindicatoren',
      'Waar te kopen',
      'Bulk kortingen'
    ]
  }
];

export default function GidsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Gids</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">Wasstrips Gids</h1>
      <p className="text-xl text-gray-600 mb-12">
        Ontdek alles over wasstrips - van basis gebruik tot expert tips
      </p>

      {/* Guide Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <Link 
              key={guide.slug}
              href={`/gids/${guide.slug}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-4 rounded-full ${guide.color}`}>
                    <Icon className={`h-8 w-8 ${guide.iconColor}`} />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-2 text-center group-hover:text-blue-600 transition">
                  {guide.title}
                </h2>
                <p className="text-gray-600 text-center mb-4">{guide.description}</p>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2 text-sm text-gray-700">In deze gids:</h3>
                  <ul className="space-y-1">
                    {guide.topics.map((topic, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="text-green-500 mr-2">•</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 text-center">
                  <span className="text-blue-600 font-semibold group-hover:text-blue-800 transition">
                    Lees meer →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Tips Section */}
      <section className="bg-blue-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Quick Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-2">💡 Dosering</h3>
            <p className="text-gray-600">
              Gebruik 1 strip voor normale was, 2 strips voor grote of vuile was
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-2">🌡️ Temperatuur</h3>
            <p className="text-gray-600">
              Wasstrips werken al vanaf 20°C, ideaal voor koud wassen
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-2">💧 Oplossen</h3>
            <p className="text-gray-600">
              Plaats de strip direct op de was, niet in het wasmiddellade
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-2">📦 Opslag</h3>
            <p className="text-gray-600">
              Bewaar wasstrips droog en uit direct zonlicht
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Veelgestelde Vragen</h2>
        <div className="space-y-4">
          <details className="border-b pb-4">
            <summary className="cursor-pointer font-semibold hover:text-blue-600">
              Zijn wasstrips geschikt voor alle wasmachines?
            </summary>
            <p className="mt-2 text-gray-600">
              Ja, wasstrips werken in alle wasmachines: voorladers, bovenladers, en zelfs voor handwas.
            </p>
          </details>
          
          <details className="border-b pb-4">
            <summary className="cursor-pointer font-semibold hover:text-blue-600">
              Hoe lang zijn wasstrips houdbaar?
            </summary>
            <p className="mt-2 text-gray-600">
              Wasstrips zijn meestal 2-3 jaar houdbaar mits droog bewaard. Check de verpakking voor exacte datum.
            </p>
          </details>
          
          <details className="border-b pb-4">
            <summary className="cursor-pointer font-semibold hover:text-blue-600">
              Werken wasstrips ook bij hardnekkige vlekken?
            </summary>
            <p className="mt-2 text-gray-600">
              Voor hardnekkige vlekken raden we aan om deze voor te behandelen of een extra strip te gebruiken.
            </p>
          </details>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/gids/beginners" className="text-blue-600 hover:text-blue-800 font-semibold">
            Bekijk alle FAQ's →
          </Link>
        </div>
      </section>
    </div>
  );
}