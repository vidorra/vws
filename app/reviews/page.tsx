import { Metadata } from 'next';
import Link from 'next/link';
import { Star, ThumbsUp, Calendar, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wasstrips Reviews 2024 - Echte Gebruikerservaringen',
  description: 'Lees echte reviews van wasstrips gebruikers. Ontdek wat anderen vinden van Mother\'s Earth, Cosmeau, Bubblyfy en meer.',
  keywords: 'wasstrips reviews, ervaringen, gebruikersreviews, 2024'
};

// Mock review data - will be replaced with database
const recentReviews = [
  {
    id: 1,
    author: 'Anna K.',
    date: '2024-06-01',
    brand: "Mother's Earth",
    brandSlug: 'mothers-earth',
    rating: 5,
    title: 'Geweldig product!',
    content: 'Deze wasstrips werken echt goed en zijn super makkelijk in gebruik. Geen gemorst wasmiddel meer en mijn kleding ruikt heerlijk fris.',
    helpful: 23,
    verified: true
  },
  {
    id: 2,
    author: 'Mark V.',
    date: '2024-05-28',
    brand: 'Cosmeau',
    brandSlug: 'cosmeau',
    rating: 4,
    title: 'Goede prijs-kwaliteit',
    content: 'Voor de prijs zijn deze wasstrips echt top. Ze wassen goed, alleen bij hardnekkige vlekken moet je voorbehandelen. Verder zeer tevreden!',
    helpful: 18,
    verified: true
  },
  {
    id: 3,
    author: 'Lisa B.',
    date: '2024-05-25',
    brand: 'Bubblyfy',
    brandSlug: 'bubblyfy',
    rating: 5,
    title: 'Heerlijke geur!',
    content: 'De geur van deze wasstrips is echt fantastisch. Mijn was ruikt dagenlang fris. Ook de wasresultaten zijn uitstekend.',
    helpful: 15,
    verified: false
  },
  {
    id: 4,
    author: 'Peter J.',
    date: '2024-05-20',
    brand: 'Bio Suds',
    brandSlug: 'bio-suds',
    rating: 4,
    title: 'Milieuvriendelijk en effectief',
    content: 'Fijn dat het 100% biologisch is. Wast goed, vooral op eco-programma. Wel wat duurder, maar dat heb ik er voor over.',
    helpful: 12,
    verified: true
  },
  {
    id: 5,
    author: 'Sandra M.',
    date: '2024-05-18',
    brand: "Mother's Earth",
    brandSlug: 'mothers-earth',
    rating: 3,
    title: 'Wisselende resultaten',
    content: 'Bij lichte was werkt het prima, maar sportkleding wordt niet altijd helemaal fris. Voor normale was wel een aanrader.',
    helpful: 8,
    verified: true
  }
];

const brandStats = [
  { name: "Mother's Earth", avgRating: 4.5, totalReviews: 234 },
  { name: 'Cosmeau', avgRating: 4.3, totalReviews: 189 },
  { name: 'Bubblyfy', avgRating: 4.4, totalReviews: 156 },
  { name: 'Bio Suds', avgRating: 4.6, totalReviews: 98 }
];

export default function ReviewsPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Reviews</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">Wasstrips Reviews {currentYear}</h1>
      <p className="text-xl text-gray-600 mb-12">
        Lees wat andere gebruikers vinden van verschillende wasstrips merken
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content - Reviews */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recente Reviews</h2>
            <select className="border rounded-lg px-4 py-2">
              <option>Meest recent</option>
              <option>Hoogste beoordeling</option>
              <option>Laagste beoordeling</option>
              <option>Meest behulpzaam</option>
            </select>
          </div>

          <div className="space-y-6">
            {recentReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <h3 className="font-semibold">{review.title}</h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {review.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(review.date).toLocaleDateString('nl-NL')}
                      </span>
                      {review.verified && (
                        <span className="text-green-600 text-xs font-semibold">
                          ✓ Geverifieerde koop
                        </span>
                      )}
                    </div>
                  </div>
                  <Link 
                    href={`/merken/${review.brandSlug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {review.brand}
                  </Link>
                </div>

                <p className="text-gray-600 mb-4">{review.content}</p>

                <div className="flex items-center justify-between">
                  <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Nuttig ({review.helpful})
                  </button>
                  <Link 
                    href={`/merken/${review.brandSlug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Meer {review.brand} reviews →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Meer reviews laden
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Brand Overview */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Merk Overzicht</h3>
            <div className="space-y-4">
              {brandStats.map((brand) => (
                <div key={brand.name}>
                  <div className="flex justify-between items-center mb-1">
                    <Link 
                      href={`/merken/${brand.name.toLowerCase().replace(/['\s]/g, '-')}`}
                      className="font-medium hover:text-blue-600"
                    >
                      {brand.name}
                    </Link>
                    <span className="text-sm text-gray-600">
                      {brand.totalReviews} reviews
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(brand.avgRating / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{brand.avgRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review CTA */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-2">Deel jouw ervaring</h3>
            <p className="text-gray-600 mb-4">
              Help anderen de juiste keuze te maken door jouw review te delen
            </p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Schrijf een review
            </button>
          </div>

          {/* Review Guidelines */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold mb-3">Review Richtlijnen</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Wees eerlijk en objectief
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Deel specifieke ervaringen
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Vermeld hoe lang je het product gebruikt
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                Geen spam of promotie
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-16 prose max-w-none">
        <h2 className="text-2xl font-bold mb-4">Waarom zijn reviews belangrijk?</h2>
        <p className="text-gray-600 mb-4">
          Reviews van echte gebruikers geven je het beste inzicht in hoe wasstrips in de praktijk presteren. 
          Ze helpen je om:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>De werkelijke wasresultaten te begrijpen</li>
          <li>Mogelijke problemen of beperkingen te ontdekken</li>
          <li>Het beste merk voor jouw specifieke situatie te kiezen</li>
          <li>Tips en tricks van andere gebruikers te leren</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-2">Hoe beoordelen we wasstrips?</h3>
        <p className="text-gray-600 mb-4">
          Onze reviews zijn gebaseerd op verschillende criteria:
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li><strong>Wasresultaat:</strong> Hoe schoon wordt de was?</li>
          <li><strong>Geur:</strong> Ruikt de was fris en hoe lang blijft de geur?</li>
          <li><strong>Oplosbaarheid:</strong> Lost de strip goed op in water?</li>
          <li><strong>Prijs-kwaliteit:</strong> Is het product zijn geld waard?</li>
          <li><strong>Milieuvriendelijkheid:</strong> Hoe duurzaam is het product?</li>
        </ul>
      </section>
    </div>
  );
}