import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Beginners Gids Wasstrips - Alles voor Starters',
  description: 'Complete beginners gids voor wasstrips. Leer wat wasstrips zijn, hoe ze werken, en hoe je ze gebruikt voor de beste wasresultaten.',
  keywords: 'wasstrips beginners, handleiding, hoe gebruik je wasstrips, dosering'
};

export default function BeginnersGuidePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Beginners Gids Wasstrips",
    "description": "Complete gids voor beginners over het gebruik van wasstrips",
    "author": {
      "@type": "Organization",
      "name": "Wasstrips Vergelijker"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Wasstrips Vergelijker",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wasstripsvergelijker.nl/images/logo.png"
      }
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString()
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/gids" className="hover:text-blue-600">Gids</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Beginners</span>
        </nav>

        <header className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-blue-100">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">Beginners Gids Wasstrips</h1>
          <p className="text-xl text-gray-600 text-center">
            Alles wat je moet weten om te starten met wasstrips
          </p>
        </header>

        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold mb-4">Inhoud</h2>
          <ol className="space-y-2">
            <li><a href="#wat-zijn-wasstrips" className="text-blue-600 hover:text-blue-800">1. Wat zijn wasstrips?</a></li>
            <li><a href="#voordelen" className="text-blue-600 hover:text-blue-800">2. Voordelen van wasstrips</a></li>
            <li><a href="#hoe-gebruik" className="text-blue-600 hover:text-blue-800">3. Hoe gebruik je wasstrips?</a></li>
            <li><a href="#dosering" className="text-blue-600 hover:text-blue-800">4. Dosering tips</a></li>
            <li><a href="#veelgestelde-vragen" className="text-blue-600 hover:text-blue-800">5. Veelgestelde vragen</a></li>
            <li><a href="#tips-tricks" className="text-blue-600 hover:text-blue-800">6. Tips & tricks</a></li>
          </ol>
        </div>

        {/* Content Sections */}
        <section id="wat-zijn-wasstrips" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">1. Wat zijn wasstrips?</h2>
          <p className="text-gray-600 mb-4">
            Wasstrips zijn dunne, voorgedoseerde velletjes wasmiddel die je direct in de wastrommel gooit. 
            Ze bevatten geconcentreerd wasmiddel zonder water, waardoor ze veel compacter zijn dan 
            traditioneel vloeibaar wasmiddel of waspoeder.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-2">Hoe werken wasstrips?</h3>
            <p className="text-gray-600">
              Zodra de wasstrip in contact komt met water, lost deze volledig op en verspreidt het 
              wasmiddel zich gelijkmatig door je was. De actieve ingrediënten gaan direct aan het 
              werk om vuil en vlekken te verwijderen.
            </p>
          </div>
        </section>

        <section id="voordelen" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">2. Voordelen van wasstrips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Milieuvriendelijk</h3>
                <p className="text-gray-600">Geen plastic verpakking, biologisch afbreekbaar</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Ruimtebesparend</h3>
                <p className="text-gray-600">Neemt 94% minder ruimte in dan vloeibaar wasmiddel</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Geen overdosering</h3>
                <p className="text-gray-600">Voorgedoseerd voor perfecte resultaten</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Geen morsen</h3>
                <p className="text-gray-600">Schone handen, schone wasmachine</p>
              </div>
            </div>
          </div>
        </section>

        <section id="hoe-gebruik" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">3. Hoe gebruik je wasstrips?</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="font-semibold mb-4">Stap-voor-stap instructies:</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                <div>
                  <p className="font-semibold">Sorteer je was</p>
                  <p className="text-gray-600">Net als bij normaal wassen, sorteer op kleur en temperatuur</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                <div>
                  <p className="font-semibold">Plaats de was in de machine</p>
                  <p className="text-gray-600">Vul de trommel niet te vol voor beste resultaten</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                <div>
                  <p className="font-semibold">Voeg de wasstrip toe</p>
                  <p className="text-gray-600">Leg de strip direct op de was, NIET in het wasmiddellade</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                <div>
                  <p className="font-semibold">Start het wasprogramma</p>
                  <p className="text-gray-600">Kies je gewenste programma en temperatuur</p>
                </div>
              </li>
            </ol>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertCircle className="h-6 w-6 text-yellow-400 mr-2" />
              <div>
                <h4 className="font-semibold">Belangrijk!</h4>
                <p className="text-gray-600">
                  Plaats de wasstrip altijd direct op de was, niet in het wasmiddellade. 
                  Dit zorgt voor optimale oplossing en wasresultaten.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="dosering" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">4. Dosering tips</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Wastype</th>
                  <th className="text-left py-2">Aantal strips</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Licht bevuilde was (4-5 kg)</td>
                  <td className="py-2 font-semibold">1 strip</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Normaal bevuilde was (6-8 kg)</td>
                  <td className="py-2 font-semibold">1 strip</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Zwaar bevuilde was</td>
                  <td className="py-2 font-semibold">2 strips</td>
                </tr>
                <tr>
                  <td className="py-2">Extra grote was (8+ kg)</td>
                  <td className="py-2 font-semibold">2 strips</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="veelgestelde-vragen" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">5. Veelgestelde vragen</h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow p-4">
              <summary className="cursor-pointer font-semibold flex items-center justify-between">
                <span>Werken wasstrips in koud water?</span>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </summary>
              <p className="mt-3 text-gray-600">
                Ja! Wasstrips zijn speciaal ontwikkeld om al vanaf 20°C volledig op te lossen. 
                Dit maakt ze ideaal voor koud wassen en energiebesparing.
              </p>
            </details>
            
            <details className="bg-white rounded-lg shadow p-4">
              <summary className="cursor-pointer font-semibold flex items-center justify-between">
                <span>Zijn wasstrips geschikt voor gevoelige huid?</span>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </summary>
              <p className="mt-3 text-gray-600">
                De meeste wasstrips zijn hypoallergeen en geschikt voor gevoelige huid. 
                Check altijd de verpakking voor specifieke informatie over het merk dat je kiest.
              </p>
            </details>
            
            <details className="bg-white rounded-lg shadow p-4">
              <summary className="cursor-pointer font-semibold flex items-center justify-between">
                <span>Kan ik wasstrips gebruiken voor handwas?</span>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </summary>
              <p className="mt-3 text-gray-600">
                Absoluut! Los een halve strip op in een emmer warm water voor handwas. 
                Perfect voor delicate items of op reis.
              </p>
            </details>
          </div>
        </section>

        <section id="tips-tricks" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">6. Tips & tricks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 Pro tip: Vlekken</h3>
              <p className="text-gray-600">
                Voor hardnekkige vlekken: maak de vlek nat en wrijf er een stukje wasstrip op. 
                Laat 5 minuten intrekken voor het wassen.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 Pro tip: Opslag</h3>
              <p className="text-gray-600">
                Bewaar wasstrips in een droge ruimte. Vocht kan ze laten plakken. 
                De originele verpakking is meestal het beste.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 Pro tip: Reizen</h3>
              <p className="text-gray-600">
                Neem een paar strips mee op reis in een ziplock zakje. 
                Geen gedoe met vloeistoffen bij de security!
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 Pro tip: Wasverzachter</h3>
              <p className="text-gray-600">
                Wasstrips bevatten vaak al verzachtende ingrediënten. 
                Extra wasverzachter is meestal niet nodig.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Klaar om te beginnen?</h2>
          <p className="mb-6">Ontdek welke wasstrips het beste bij jou passen</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/prijzen/goedkoopste" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Bekijk goedkoopste opties
            </Link>
            <Link href="/merken" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition">
              Vergelijk alle merken
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}