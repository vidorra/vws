import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wasstrips Blog - Tips, Nieuws & Achtergronden',
  description: 'Lees de laatste artikelen over wasstrips, duurzaam wassen, en tips om te besparen op je was. Expert advies en gebruikerservaringen.',
  keywords: 'wasstrips blog, duurzaam wassen, wastips, milieuvriendelijk'
};

const blogPosts = [
  {
    slug: 'wasstrips-vs-wasmiddel',
    title: 'Wasstrips vs Traditioneel Wasmiddel: De Ultieme Vergelijking',
    excerpt: 'Een diepgaande vergelijking tussen wasstrips en traditioneel wasmiddel. Ontdek de voor- en nadelen van beide opties.',
    author: 'Redactie',
    date: '2024-06-15',
    readTime: '8 min',
    category: 'Vergelijking',
    image: '/images/blog/wasstrips-vs-wasmiddel.jpg'
  },
  {
    slug: 'duurzaam-wassen',
    title: 'Duurzaam Wassen: 10 Tips om Milieuvriendelijk te Wassen',
    excerpt: 'Praktische tips om je wasroutine duurzamer te maken. Van temperatuur tot dosering, alles wat je moet weten.',
    author: 'Lisa van den Berg',
    date: '2024-06-10',
    readTime: '6 min',
    category: 'Duurzaamheid',
    image: '/images/blog/duurzaam-wassen.jpg'
  },
  {
    slug: 'besparen-wasmiddel',
    title: 'Zo Bespaar je tot €150 per Jaar op Wasmiddel',
    excerpt: 'Slimme tips om geld te besparen op je waskosten zonder in te leveren op schone was.',
    author: 'Mark Jansen',
    date: '2024-06-05',
    readTime: '5 min',
    category: 'Besparen',
    image: '/images/blog/besparen-wasmiddel.jpg'
  },
  {
    slug: 'wasstrips-geschiedenis',
    title: 'De Geschiedenis van Wasstrips: Van Innovatie tot Mainstream',
    excerpt: 'Hoe wasstrips ontstonden en waarom ze nu zo populair zijn. Een kijkje in de ontwikkeling van deze innovatie.',
    author: 'Redactie',
    date: '2024-05-28',
    readTime: '7 min',
    category: 'Achtergrond',
    image: '/images/blog/geschiedenis.jpg'
  },
  {
    slug: 'vlekken-verwijderen',
    title: 'Vlekken Verwijderen met Wasstrips: Complete Gids',
    excerpt: 'Van rode wijn tot gras, leer hoe je verschillende vlekken effectief verwijdert met wasstrips.',
    author: 'Sandra de Vries',
    date: '2024-05-20',
    readTime: '10 min',
    category: 'Tips',
    image: '/images/blog/vlekken.jpg'
  }
];

const categories = [
  { name: 'Alle artikelen', count: blogPosts.length },
  { name: 'Vergelijking', count: 1 },
  { name: 'Duurzaamheid', count: 1 },
  { name: 'Besparen', count: 1 },
  { name: 'Tips', count: 1 },
  { name: 'Achtergrond', count: 1 }
];

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Blog</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">Wasstrips Blog</h1>
      <p className="text-xl text-gray-600 mb-12">
        Tips, nieuws en achtergronden over wasstrips en duurzaam wassen
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content - Blog Posts */}
        <div className="lg:col-span-2">
          {/* Featured Post */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <span className="text-gray-500">Featured Image</span>
            </div>
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold mr-3">
                  {blogPosts[0].category}
                </span>
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-3">{new Date(blogPosts[0].date).toLocaleDateString('nl-NL')}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{blogPosts[0].readTime} leestijd</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-3">
                <Link href={`/blog/${blogPosts[0].slug}`} className="hover:text-blue-600">
                  {blogPosts[0].title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-4">{blogPosts[0].excerpt}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Door {blogPosts[0].author}</span>
                <Link 
                  href={`/blog/${blogPosts[0].slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Lees meer <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>

          {/* Other Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.slice(1).map((post) => (
              <article key={post.slug} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="bg-gray-200 h-40 flex items-center justify-center">
                  <span className="text-gray-500">Image</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2">
                      {post.category}
                    </span>
                    <span>{post.readTime} leestijd</span>
                  </div>
                  
                  <h3 className="font-bold mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{new Date(post.date).toLocaleDateString('nl-NL')}</span>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Lees meer →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Meer artikelen laden
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Categories */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Categorieën</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    href={`/blog?category=${category.name.toLowerCase()}`}
                    className="flex justify-between items-center py-2 hover:text-blue-600"
                  >
                    <span>{category.name}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-2">Blijf op de hoogte</h3>
            <p className="text-gray-600 mb-4">
              Ontvang de laatste tips en aanbiedingen in je inbox
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Je e-mailadres"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Aanmelden
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              We sturen maximaal 1x per week een mail
            </p>
          </div>

          {/* Popular Posts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Populaire artikelen</h3>
            <ul className="space-y-3">
              {blogPosts.slice(0, 3).map((post, index) => (
                <li key={post.slug} className="flex items-start">
                  <span className="text-2xl font-bold text-gray-300 mr-3">{index + 1}</span>
                  <div>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="font-medium hover:text-blue-600 text-sm"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">{post.readTime} leestijd</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-16 prose max-w-none">
        <h2 className="text-2xl font-bold mb-4">Over onze blog</h2>
        <p className="text-gray-600 mb-4">
          Op de Wasstrips Vergelijker blog delen we regelmatig nieuwe inzichten, tips en nieuws over 
          wasstrips en duurzaam wassen. Of je nu net begint met wasstrips of al een ervaren gebruiker 
          bent, hier vind je waardevolle informatie om het meeste uit je wasroutine te halen.
        </p>
        <p className="text-gray-600">
          Onze artikelen worden geschreven door experts en ervaren gebruikers die hun kennis graag 
          delen. We behandelen onderwerpen variërend van praktische wastips tot diepgaande analyses 
          van de nieuwste ontwikkelingen in de wereld van milieuvriendelijk wassen.
        </p>
      </section>
    </div>
  );
}