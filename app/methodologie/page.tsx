import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Duurzaamheidsscore Methodologie - Vaatwasstrips Vergelijker',
  description: 'Transparante uitleg over hoe wij de duurzaamheidsscores berekenen voor vaatwasstrips. Objectieve criteria en wegingsfactoren.',
  keywords: 'duurzaamheidsscore, methodologie, vaatwasstrips, beoordeling, criteria',
};

export default function MethodologiePage() {
  const criteria = [
    {
      name: 'Verpakking',
      weight: '25%',
      description: 'Beoordeelt het gebruik van plastic, recycleerbaarheid en composteerbare materialen',
      scores: [
        { range: '9.5-10.0', description: '100% plastic-vrij + composteerbaar + minimale inkt' },
        { range: '8.5-9.4', description: 'Plastic-vrij + recycleerbaar + duurzame bedrukking' },
        { range: '7.0-8.4', description: 'Minimaal plastic + recycleerbaar' },
        { range: '5.5-6.9', description: 'Beperkt plastic + recycleerbaar' },
        { range: '1.0-5.4', description: 'Veel plastic of niet-recycleerbaar' }
      ]
    },
    {
      name: 'Ingrediënten & Certificeringen',
      weight: '30%',
      description: 'Evalueert biologische afbreekbaarheid, certificeringen en transparantie van ingrediënten',
      scores: [
        { range: '9.5-10.0', description: 'OECD 301B + dermatologisch getest + transparante ingrediëntenlijst' },
        { range: '8.5-9.4', description: 'OECD 301B OF dermatologisch getest + meerdere geverifieerde claims' },
        { range: '7.0-8.4', description: 'Biologisch afbreekbaar + minimaal 2 geverifieerde claims' },
        { range: '5.5-6.9', description: 'Enkele geverifieerde milieuclaims' },
        { range: '1.0-5.4', description: 'Onbewezen claims of ontbrekende informatie' }
      ]
    },
    {
      name: 'Productie & Transport',
      weight: '25%',
      description: 'Beoordeelt productielocatie, CO2-compensatie en transportefficiëntie',
      scores: [
        { range: '9.5-10.0', description: 'Europese productie + CO2-neutraal' },
        { range: '8.5-9.4', description: 'China productie + volledig CO2-gecompenseerd + transparantie' },
        { range: '7.0-8.4', description: 'China productie + CO2 compensatie + transparantie' },
        { range: '5.5-6.9', description: 'China productie + beperkte compensatie' },
        { range: '1.0-5.4', description: 'Onduidelijke productie + geen compensatie' }
      ]
    },
    {
      name: 'Bedrijfsverantwoordelijkheid',
      weight: '20%',
      description: 'Evalueert transparantie, sociale impact, garanties en klantenservice',
      scores: [
        { range: '9.5-10.0', description: 'Volledige transparantie + sociale impact + garanties' },
        { range: '8.5-9.4', description: 'Uitstekende transparantie + garanties + goede service' },
        { range: '7.0-8.4', description: 'Goede transparantie + betrouwbare service' },
        { range: '5.5-6.9', description: 'Basis transparantie + enkele maatregelen' },
        { range: '1.0-5.4', description: 'Beperkte transparantie of tegenstrijdige informatie' }
      ]
    }
  ];

  const examples = [
    {
      brand: "Mother's Earth",
      scores: {
        verpakking: 9.7,
        ingredienten: 9.6,
        productie: 8.8,
        bedrijf: 9.8
      },
      total: 9.4,
      explanation: "Hoogste score door OECD certificering, CO2-neutrale verzending en sociale impact"
    },
    {
      brand: "Wasstrip.nl",
      scores: {
        verpakking: 8.2,
        ingredienten: 7.8,
        productie: 7.9,
        bedrijf: 8.5
      },
      total: 8.1,
      explanation: "Goede score door plastic-vrije verpakking en Nederlandse klantenservice"
    },
    {
      brand: "Bubblyfy",
      scores: {
        verpakking: 7.1,
        ingredienten: 6.8,
        productie: 5.2,
        bedrijf: 5.1
      },
      total: 6.2,
      explanation: "Lagere score door gebrek aan certificeringen en beperkte transparantie"
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Transparante Duurzaamheidsmethodologie
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Hoe wij objectief de duurzaamheid van vaatwasstrips beoordelen op basis van
          geverifieerde data en erkende certificeringen
        </p>
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          ← Terug naar vergelijking
        </Link>
      </div>

      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Waarom deze methodologie?</h2>
        <p className="text-gray-700 mb-4">
          Onze duurzaamheidsscores bieden consumenten een objectieve manier om vaatwasstrips te vergelijken
          op basis van milieu-impact en bedrijfsverantwoordelijkheid. We gebruiken alleen verifieerbare data
          en erkende certificeringen.
        </p>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-gray-700">
            <strong className="text-blue-600">Baseline score:</strong> Alle vaatwasstrips starten op minimaal 6.0/10 vanwege inherente
            voordelen ten opzichte van traditionele tabletten (compacte verpakking, minder plastic,
            geconcentreerde formule).
          </p>
        </div>
      </div>

      {/* Scoring Criteria */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Beoordelingscriteria (1.0-10.0 schaal)</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {criteria.map((criterion, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{criterion.name}</h3>
                  <p className="text-gray-600 mt-1">{criterion.description}</p>
                </div>
                <span className="bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {criterion.weight}
                </span>
              </div>
              
              <div className="space-y-3">
                {criterion.scores.map((score, idx) => (
                  <div key={idx} className="flex items-start bg-gray-50 rounded-lg p-3">
                    <span className="font-semibold text-gray-700 min-w-[100px]">{score.range}:</span>
                    <span className="text-gray-600 ml-2 text-sm">{score.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculation Formula */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Berekeningsformule</h2>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 font-mono text-center">
          <p className="text-lg text-gray-800">
            (Verpakking × 0.25) + (Ingrediënten × 0.30) + (Productie × 0.25) + (Bedrijf × 0.20) = <strong className="text-green-600">Totaalscore</strong>
          </p>
        </div>
      </div>

      {/* Examples */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Praktijkvoorbeelden</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{example.brand}</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verpakking</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${example.scores.verpakking * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{example.scores.verpakking}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ingrediënten</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${example.scores.ingredienten * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{example.scores.ingredienten}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Productie</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${example.scores.productie * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{example.scores.productie}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bedrijf</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${example.scores.bedrijf * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{example.scores.bedrijf}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Totaalscore:</span>
                  <span className="text-2xl font-bold text-green-600">{example.total}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${example.total * 10}%` }}
                  />
                </div>
                <p className="text-gray-600 text-sm">{example.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Belangrijke Opmerkingen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2 text-xl">📊</span>
              <span className="text-gray-700">Scores worden maandelijks geëvalueerd op basis van nieuwe informatie en certificeringen</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2 text-xl">✓</span>
              <span className="text-gray-700">Alleen extern geverifieerde claims worden meegenomen in de beoordeling</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2 text-xl">📈</span>
              <span className="text-gray-700">Bedrijven kunnen hun score verbeteren door transparantie en certificeringen</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2 text-xl">🌱</span>
              <span className="text-gray-700">Deze methodologie focust op duurzaamheid, niet op reinigingsprestaties</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Databronnen</h2>
        <p className="text-gray-700 mb-6 text-center">
          Onze beoordelingen zijn gebaseerd op:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center bg-gray-50 rounded-lg p-4">
            <span className="text-blue-600 mr-3">📋</span>
            <span className="text-gray-700">Officiële productinformatie van fabrikanten</span>
          </div>
          <div className="flex items-center bg-gray-50 rounded-lg p-4">
            <span className="text-blue-600 mr-3">🏆</span>
            <span className="text-gray-700">Onafhankelijke certificeringsorganisaties (OECD, dermatologische instituten)</span>
          </div>
          <div className="flex items-center bg-gray-50 rounded-lg p-4">
            <span className="text-blue-600 mr-3">🏢</span>
            <span className="text-gray-700">Publiek beschikbare bedrijfsinformatie</span>
          </div>
          <div className="flex items-center bg-gray-50 rounded-lg p-4">
            <span className="text-blue-600 mr-3">💬</span>
            <span className="text-gray-700">Directe communicatie met merken voor verificatie</span>
          </div>
          <div className="flex items-center bg-gray-50 rounded-lg p-4">
            <span className="text-blue-600 mr-3">⭐</span>
            <span className="text-gray-700">Consumentenreviews voor servicekwaliteit</span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Vragen over onze methodologie?</h3>
        <p className="text-gray-600 mb-6">
          We staan open voor feedback en verbeteringen
        </p>
        <a href="mailto:methodologie@vaatwasstrips-vergelijker.nl" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Contact opnemen →
        </a>
        <p className="text-sm text-gray-500 mt-6">
          <strong>Email:</strong> methodologie@vaatwasstrips-vergelijker.nl<br/>
          <strong>Laatste update:</strong> December 2024
        </p>
      </div>
    </main>
  );
}