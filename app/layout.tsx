import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://vaatwasstripsvergelijker.nl'),
  title: 'Vaatwasstrips Vergelijker Nederland - Beste Prijzen 2024',
  description: 'Vergelijk vaatwasstrips van alle Nederlandse aanbieders. Bespaar tot 75% op je afwas met milieuvriendelijke alternatieven.',
  keywords: 'vaatwasstrips, vergelijken, nederland, prijs, milieuvriendelijk, afwassen',
  openGraph: {
    title: 'Vaatwasstrips Vergelijker Nederland',
    description: 'De meest complete vergelijking van vaatwasstrips',
    images: ['/og-image.jpg']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={`${inter.className} bg-gray-50`}>
        <Navigation />
        <main>
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Over Ons</h3>
                <p className="text-sm text-gray-600">
                  Vaatwasstrips Vergelijker helpt je de beste keuze te maken voor milieuvriendelijk afwassen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Snelle Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/merken" className="text-gray-600 hover:text-blue-600">Alle Merken</a></li>
                  <li><a href="/prijzen/goedkoopste" className="text-gray-600 hover:text-blue-600">Goedkoopste Opties</a></li>
                  <li><a href="/gids/beginners" className="text-gray-600 hover:text-blue-600">Beginners Gids</a></li>
                  <li><a href="/reviews" className="text-gray-600 hover:text-blue-600">Reviews</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                <p className="text-sm text-gray-600">
                  Vragen of suggesties?<br />
                  info@vaatwasstripsvergelijker.nl
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
              <p>&copy; 2024 Vaatwasstrips Vergelijker. Alle rechten voorbehouden.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}