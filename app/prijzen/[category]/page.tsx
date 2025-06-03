import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, TrendingDown, Award, Leaf } from 'lucide-react';

const categories = {
  'goedkoopste': {
    title: 'Goedkoopste Wasstrips',
    description: 'Voor de prijsbewuste consument',
    longDescription: 'Ontdek de meest betaalbare wasstrips zonder in te leveren op kwaliteit. Perfect voor grote gezinnen of studenten.',
    icon: TrendingDown,
    color: 'text-green-600',
    products: [
      {
        name: 'Cosmeau',
        price: 12.99,
        pricePerWash: 0.22,
        rating: 4.3,
        reviews: 189,
        slug: 'cosmeau',
        highlight: 'Beste prijs'
      },
      {
        name: 'Bubblyfy',
        price: 13.50,
        pricePerWash: 0.23,
        rating: 4.4,
        reviews: 156,
        slug: 'bubblyfy',
        highlight: 'Populair'
      }
    ]
  },
  'beste-waarde': {
    title: 'Beste Prijs-Kwaliteit Wasstrips',
    description: 'Optimale balans tussen prijs en prestatie',
    longDescription: 'Deze wasstrips bieden de beste waarde voor je geld met uitstekende wasresultaten tegen een redelijke prijs.',
    icon: Award,
    color: 'text-blue-600',
    products: [
      {
        name: "Mother's Earth",
        price: 14.95,
        pricePerWash: 0.25,
        rating: 4.5,
        reviews: 234,
        slug: 'mothers-earth',
        highlight: 'Editors choice'
      },
      {
        name: 'Cosmeau',
        price: 12.99,
        pricePerWash: 0.22,
        rating: 4.3,
        reviews: 189,
        slug: 'cosmeau',
        highlight: 'Top verkocht'
      }
    ]
  },
  'premium': {
    title: 'Premium Wasstrips',
    description: 'Voor de beste wasresultaten',
    longDescription: 'Premium wasstrips met de hoogste kwaliteit ingrediënten voor superieure wasresultaten en milieuvriendelijkheid.',
    icon: Star,
    color: 'text-purple-600',
    products: [
      {
        name: 'Bio Suds',
        price: 16.99,
        pricePerWash: 0.28,
        rating: 4.6,
        reviews: 98,
        slug: 'bio-suds',
        highlight: '100% Biologisch'
      },
      {
        name: "Mother's Earth",
        price: 14.95,
        pricePerWash: 0.25,
        rating: 4.5,
        reviews: 234,
        slug: 'mothers-earth',
        highlight: 'Eco-certified'
      }
    ]
  }
};

export async function generateStaticParams() {
  return Object.keys(categories).map((category) => ({
    category: category,
  }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = categories[params.category as keyof typeof categories];
  
  if (!category) {
    return {
      title: 'Categorie niet gevonden',
    };
  }

  const currentYear = new Date().getFullYear();
  
  return {
    title: `${category.title} Nederland - Vergelijking ${currentYear}`,
    description: `${category.title} vergelijken in Nederland. Vind de beste deals van ${category.products.length} geteste merken. Actuele prijzen en reviews ${currentYear}.`,
    keywords: `${params.category}, wasstrips, nederland, prijzen, vergelijking`,
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categories[params.category as keyof typeof categories];
  
  if (!category) {
    notFound();
  }

  const currentYear = new Date().getFullYear();
  const Icon = category.icon;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": category.title,
    "description": `${category.title} vergelijking in Nederland`,
    "numberOfItems": category.products.length,
    "itemListElement": category.products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "url": `https://wasstripsvergelijker.nl/merken/${product.slug}`,
        "offers": {
          "@type": "Offer",
          "price": product.pricePerWash,
          "priceCurrency": "EUR"
        }
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/prijzen" className="hover:text-blue-600">Prijzen</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{category.title}</span>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Icon className={`h-16 w-16 ${category.color}`} />
          </div>
          <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
          <p className="text-xl text-gray-600 mb-2">{category.description}</p>
          <p className="text-gray-600 max-w-3xl mx-auto">{category.longDescription}</p>
        </header>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {category.products.map((product, index) => (
            <div key={product.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition relative">
              {index === 0 && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-black px-3 py-1 text-sm font-semibold">
                  #1
                </div>
              )}
              {product.highlight && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                  {product.highlight}
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-blue-600">€{product.price}</div>
                  <div className="text-gray-600">€{product.pricePerWash} per wasbeurt</div>
                </div>

                <Link 
                  href={`/merken/${product.slug}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Bekijk Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Category specific content */}
        <section className="prose max-w-none">
          {params.category === 'goedkoopste' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Waarom kiezen voor goedkope wasstrips?</h2>
              <p className="text-gray-600 mb-4">
                Goedkope wasstrips betekenen niet dat je inlevert op kwaliteit. De wasstrips in deze categorie 
                bieden uitstekende wasresultaten tegen de laagste prijs per wasbeurt. Perfect voor:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>Grote gezinnen met veel was</li>
                <li>Studenten met een beperkt budget</li>
                <li>Iedereen die wil besparen op waskosten</li>
                <li>Eerste kennismaking met wasstrips</li>
              </ul>
            </>
          )}

          {params.category === 'beste-waarde' && (
            <>
              <h2 className="text-2xl font-bold mb-4">De gulden middenweg</h2>
              <p className="text-gray-600 mb-4">
                Onze beste prijs-kwaliteit wasstrips zijn zorgvuldig geselecteerd op basis van:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>Uitstekende wasresultaten in onafhankelijke tests</li>
                <li>Positieve gebruikerservaringen</li>
                <li>Redelijke prijs per wasbeurt</li>
                <li>Milieuvriendelijke eigenschappen</li>
                <li>Betrouwbare beschikbaarheid</li>
              </ul>
            </>
          )}

          {params.category === 'premium' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Premium kwaliteit loont</h2>
              <p className="text-gray-600 mb-4">
                Premium wasstrips onderscheiden zich door:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>100% natuurlijke en biologische ingrediënten</li>
                <li>Superieure vlekverwijdering</li>
                <li>Langdurige frisheid</li>
                <li>Geschikt voor de meest delicate stoffen</li>
                <li>Minimale milieu-impact</li>
              </ul>
            </>
          )}

          <h3 className="text-xl font-semibold mb-2">Hoe we selecteren</h3>
          <p className="text-gray-600 mb-4">
            Onze selectie is gebaseerd op uitgebreide tests, gebruikersreviews, en prijsanalyses. 
            We updaten onze rankings maandelijks om je altijd de meest actuele informatie te geven.
          </p>
        </section>
      </div>
    </>
  );
}